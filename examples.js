import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";
import { assert, assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

const $$value = Symbol.for("value");

// isEquivalent :: Setoid a|a -> Setoid b|b -> Boolean
const isEquivalent = (containerA, containerB) => {
  // When the container are Setoids...
  if (Reflect.getPrototypeOf(containerA).hasOwnProperty("equals")) return containerA.equals(containerB);
  else return containerA[$$value] === containerB[$$value];
};

const assertIsEquivalent = (containerA, containerB) => assert(isEquivalent(containerA, containerB));

export const Setoid = function (value) {
  this[$$value] = value;
}

// equals :: Setoid a => a ~> a -> Boolean
Setoid.prototype.equals = function (container) {
  return (container.hasOwnProperty($$value))
    ? this[$$value] === container[$$value]
    : this[$$value] === container;
}

Deno.test(
  "Setoid: #equals",
  () =>
    assert(
      new Setoid(42).equals(42)
    )
);

Deno.test(
  "Setoid: #equals - Reflexivity",
  () =>
    assert(
      new Setoid(42).equals(new Setoid(42))
    )
);

Deno.test(
  "Setoid: #equals - Symmetry",
  () => {
    const containerA = new Setoid(42);
    const containerB = new Setoid(42);

    assert(containerA.equals(containerB) === containerB.equals(containerA));
  }
);

Deno.test(
  "Setoid: #equals - Transitivity",
  () => {
    const containerA = new Setoid(42);
    const containerB = new Setoid(42);
    const containerC = new Setoid(42);

    assert(
      containerA.equals(containerB)
      === containerB.equals(containerC)
      === containerA.equals(containerC)
    )
  }
);

// Ord :: Setoid
export const Ord = function (value) {
  this[$$value] = value;
};

Ord.prototype.equals = Setoid.prototype.equals;

// lte :: Ord a => a ~> a -> Boolean
Ord.prototype.lte = function (container) {
  return (container.hasOwnProperty($$value))
    ? this[$$value] <= container[$$value]
    : this[$$value] <= container;
}

Deno.test(
  "Ord: #lte - Totality",
  () => {
    const containerA = new Ord(24);
    const containerB = new Ord(42);

    assert(
      containerA.lte(containerB)
      || containerB.lte(containerA) === true
    );
  }
);

Deno.test(
  "Ord: #lte - Antisymmetry",
  () => {
    const containerA = new Ord(24);
    const containerB = new Ord(42);

    assert(
      containerA.lte(containerB)
      && containerB.lte(containerA) === containerA.equals(containerB)
    );
  }
);

Deno.test(
  "Ord: #lte - Transitivity",
  () => {
    const containerA = new Ord(2);
    const containerB = new Ord(24);
    const value = 42;

    assert(
      containerA.lte(containerB)
      && containerB.lte(value) === containerA.lte(value)
    );
  }
);

export const Semigroup = function (value) {
  this[$$value] = value;
};

Semigroup.prototype.concat = function (container) {
  return (container.hasOwnProperty($$value))
    ? new Semigroup(this[$$value] + container[$$value])
    : new Semigroup(this[$$value] + container);
}

Deno.test(
  "Semigroup: #concat - Associativity",
  () => {
    const containerA = new Semigroup("hello");
    const containerB = new Semigroup(" ");
    const containerC = new Semigroup("world");

    assertIsEquivalent(
      containerA.concat(containerB).concat(containerC),
      containerA.concat(containerB.concat(containerC))
    );
  }
);

// Monoid :: Semigroup
export const Monoid = function (value) {
  this[$$value] = value;
};

Monoid.prototype.concat = Semigroup.prototype.concat;

// empty :: Monoid a => a ~> () -> a
Monoid.prototype.empty = function (container) {
  return new Monoid("");
}

Deno.test(
  "Monoid: #empty - Right identity",
  () => {
    const container = new Monoid("hello");

    assertIsEquivalent(
      container.concat(container.empty()),
      container
    );
  }
);

Deno.test(
  "Monoid: #empty - Left identity",
  () => {
    const container = new Monoid("hello");

    assertIsEquivalent(
      container.empty().concat(container),
      container
    );
  }
);

export const Functor = function (value) {
  this[$$value] = value;
};

// map :: Functor => f a ~> (a -> b) -> f b
Functor.prototype.map = function (mappingFunction) {
  return new Functor(mappingFunction(this[$$value]));
}

Deno.test(
  "Functor: #map - Identity",
  () => {
    const container = new Functor(42);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Functor: #map - Composition",
  () => {
    const container = new Functor(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

export const Contravariant = function (predicate) {
  this.predicate = predicate;
};

// contramap :: Contravariant => f a ~> (b -> a) -> f b
Contravariant.prototype.contramap = function (f) {
  return new Contravariant((x, y) => this.predicate(f(x), f(y)));
}

Deno.test(
  "Contravariant: #contramap - Identity",
  () => {
    const container = new Contravariant((x, y) => x === y);
    const argumentList = [ "Hello", "HELLO!" ];

    assertEquals(
      container.contramap(x => x).predicate(...argumentList),
      container.predicate(...argumentList)
    )
  }
);

Deno.test(
  "Contravariant: #contramap - Composition",
  () => {
    const container = new Contravariant((x, y) => x === y);
    const f = x => x.replace(/\W+/, '');
    const g = x => x.toLowerCase();
    const argumentList = [ "Hello", "HELLO!" ];

    assertEquals(
      container.contramap(f).contramap(g).predicate(...argumentList),
      container.contramap(x => f(g(x))).predicate(...argumentList)
    );
  }
);

// Apply :: Functor
export const Apply = function (value) {
  this[$$value] = value;
};

// map :: Apply f => f a ~> (a -> b) -> f b
Apply.prototype.map = function (mappingFunction) {

  return new Apply(mappingFunction(this[$$value]));
};

// ap :: Apply f => f a ~> f (a -> b) -> f b
Apply.prototype.ap = function (container) {

  return new Apply(container[$$value](this[$$value]));
};

Deno.test(
  "Apply: #ap - Composition",
  () => {
    const containerA = new Apply(42);
    const containerB = new Apply(x => x + 2);
    const containerC = new Apply(x => x * 2);

    assertIsEquivalent(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))),
      containerA.ap(containerB).ap(containerC)
    );
  }
);

// Applicative :: Apply
export const Applicative = function (value) {
  this[$$value] = value;
};

// map :: Applicative f => f a ~> (a -> b) -> f b
Applicative.prototype.map = function (mappingFunction) {

  return new Applicative(mappingFunction(this[$$value]));
};

// ap :: Applicative f => f a ~> f (a -> b) -> f b
Applicative.prototype.ap = function (container) {

  return new Applicative(container[$$value](this[$$value]));
};

// of :: Applicative f => a -> f a
Applicative.of = function (value) {

  return new Applicative(value);
}

Deno.test(
  "Applicative: #of - Identity",
  () => {
    const container = new Applicative(42);

    assertIsEquivalent(
      container.ap(Applicative.of(x => x)),
      container
    );
  }
);

Deno.test(
  "Applicative: #of - Homomorphism",
  () =>
    assertIsEquivalent(
      Applicative.of(42).ap(Applicative.of(x => x + 2)),
      Applicative.of((x => x + 2)(42))
    )
);

Deno.test(
  "Applicative: #of - Interchange",
  () =>
    assertIsEquivalent(
      Applicative.of(42).ap(new Applicative(x => x + 2)),
      new Applicative(x => x + 2).ap(Applicative.of(f => f(42)))
    )
);

export const Pointed = function (value) {
  this[$$value] = value;
};

// of :: Pointed f => a -> f a
Pointed.of = function (value) {

  return new Pointed(value);
};
