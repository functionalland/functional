import * as R from "../../ramda/source/index.js";
import { assert, assertEquals } from "../../deno/std/testing/asserts.ts";

const $$value = Symbol.for("value");

// assertReflexivity :: Function -> a -> Boolean
const assertReflexivity = R.curry(
  (method, container) =>
    method.call(container, container)
);

// assertSymmetry :: Function -> a -> b -> Boolean
const assertSymmetry = R.curry(
  (method, containerA, containerB) =>
    method.call(containerA, containerB) === method.call(containerB, containerA)
);

// assertTransitivity :: Function -> a -> b -> c -> Boolean
const assertTransitivity = R.curry(
  (method, containerA, containerB, containerC) =>
    method.call(containerA, containerB) === method.call(containerB, containerC) === method.call(containerA, containerC)
);

// assertTotality :: Function -> Ord a -> Ord b -> Boolean
const assertTotality = R.curry(
  (method, containerA, containerB) =>
    method.call(containerA, containerB) || method.call(containerB, containerA) === true
);

// assertAntisymmetry :: Function -> Ord a -> Ord b -> Boolean
const assertAntisymmetry = R.curry(
  (method, containerA, containerB) =>
    method.call(containerA, containerB) && method.call(containerB, containerA)
      === Setoid.prototype.equals.call(containerA, containerB)
);

// assertRightIdentity :: Function -> Semigroup a -> Semigroup b -> Semigroup c -> Boolean
const assertAssociativity = R.curry(
  (method, containerA, containerB, containerC) =>
    method.call(method.call(containerA, containerB), containerC)[$$value]
    === method.call(containerA, method.call(containerB, containerC))[$$value]
);

// assertRightIdentity :: Function -> Monoid -> Boolean
const assertRightIdentity = R.curry(
  (method, container) =>
    container.concat(container.empty())[$$value] === container[$$value]
);

// assertLeftIdentity :: Function -> Monoid -> Boolean
const assertLeftIdentity = R.curry(
  (method, container) =>
    container.empty().concat(container)[$$value] === container[$$value]
);

// assertIdentity :: Function -> Functor -> Boolean
const assertIdentity = R.curry(
  (method, container) =>
    container.map(x => x)[$$value] === container[$$value]
);

// assertIdentity :: Function -> Functor -> Function -> Function -> Boolean
const assertComposition = R.curry(
  (method, container, f, g) =>
    container.map(f).map(g)[$$value] === container.map(x => g(f(x)))[$$value]
);

// assertContramapIdentity :: Function -> Contravariant -> [a] -> Boolean
const assertContramapIdentity = R.curry(
  (method, container, argumentList) =>
    container.contramap(x => x)[$$value](...argumentList) === container[$$value](...argumentList)
);

// assertContramapComposition :: Function -> Contravariant -> Function -> Function -> [a] -> Boolean
const assertContramapComposition = R.curry(
  (method, container, f, g, argumentList) =>
    container.contramap(f).contramap(g)[$$value](...argumentList)
    === container.contramap(x => f(g(x)))[$$value](...argumentList)
)

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
    assertReflexivity(Setoid.prototype.equals, new Setoid(42))
);

Deno.test(
  "Setoid: #equals - Symmetry",
  () =>
    assert(
      assertSymmetry(Setoid.prototype.equals, new Setoid(42), new Setoid(42))
    )
);

Deno.test(
  "Setoid: #equals - Transitivity",
  () =>
    assert(
      assertTransitivity(Setoid.prototype.equals, new Setoid(42), new Setoid(42), 42)
    )
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
  () =>
    assert(
      assertTotality(Ord.prototype.lte, new Ord(24), new Ord(42))
    )
);

Deno.test(
  "Ord: #lte - Antisymmetry",
  () =>
    assert(
      assertAntisymmetry(Ord.prototype.lte, new Ord(24), new Ord(42))
    )
);

Deno.test(
  "Ord: #lte - Transitivity",
  () =>
    assert(
      assertTransitivity(Ord.prototype.lte, new Ord(2), new Ord(24), 42)
    )
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
  () =>
    assert(
      assertAssociativity(
        Semigroup.prototype.concat,
        new Semigroup("hello"),
        new Semigroup(" "),
        new Semigroup("world")
      )
    )
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
  () =>
    assert(
      assertRightIdentity(Ord.prototype.empty, new Monoid("hello"))
    )
);

Deno.test(
  "Monoid: #empty - Left identity",
  () =>
    assert(
      assertLeftIdentity(Ord.prototype.empty, new Monoid("hello"))
    )
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
  () =>
    assert(
      assertIdentity(Functor.prototype.map, new Functor(42))
    )
);

Deno.test(
  "Functor: #map - Composition",
  () =>
    assert(
      assertComposition(Functor.prototype.map, new Functor(42), x => x + 2, x => x * 2)
    )
);

export const Contravariant = function (predicate) {
  this[$$value] = predicate;
};

// contramap :: Contravariant => f a ~> (b -> a) -> f b
Contravariant.prototype.contramap = function (f) {
  return new Contravariant((x, y) => this[$$value](f(x), f(y)));
}

Deno.test(
  "Contravariant: #contramap - Identity",
  () =>
    assert(
      assertContramapIdentity(
        Contravariant.prototype.contramap,
        new Contravariant((x, y) => x === y),
        [ "Hello", "HELLO!" ]
      )
    )
);

Deno.test(
  "Contravariant: #contramap - Composition",
  () =>
    assert(
      assertContramapComposition(
        Contravariant.prototype.contramap,
        new Contravariant((x, y) => x === y),
        x => x.replace(/\W+/, ''),
        x => x.toLowerCase(),
        [ "Hello", "HELLO!" ]
      )
    )
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
}

Deno.test(
  "Apply: #ap - Composition",
  () =>
    assert(
      assertApplyComposition(
        Contravariant.prototype.contramap,
        new Contravariant((x, y) => x === y),
        [ "Hello", "HELLO!" ]
      )
    )
);
