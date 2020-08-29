import { assertIsDefined, assertIsEquivalent, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";

const $$value = Symbol.for("TypeValue");

export const Either = factorizeSumType(
  "Either",
  {
    Left: [ $$value ],
    Right: [ $$value ]
  }
);

Either.fromNullable = value =>
  !assertIsDefined(value) || assertIsNone(value) ? Either.Left(value) : Either.Right(value);
Either.left = value => Either.Left(value);
Either.right = value => Either.Right(value);
Either.of = value => Either.Right(value);

// alt :: Either a b ~> Either a b -> Either a b
Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Left: _ => container,
    Right: _ => this
  });
};

// ap :: Either a b ~> Either a (b -> c) -> Either a c
Either.prototype.ap = function (container) {
  if (Either.Left.is(this)) return (Either.Left.is(container)) ? container : this;

  return container.fold({
    Left: _ => container,
    Right: _ => Either.of(container[$$value](this[$$value]))
  });
};

// map :: Either a b ~> (b -> c) -> Either a c
Either.prototype.map = function (composedFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => Either.of(composedFunction(this[$$value]))
  });
};

// chain :: Either a b ~> (b -> Either a c) -> Either a c
Either.prototype.chain = function (composedFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => composedFunction(this[$$value])
  });
};

Deno.test(
  "Either: #right",
  () =>
    assertIsEquivalent(Either.right(42), Either.Right(42))
);

Deno.test(
  "Either.Right: #alt",
  () =>
    assertIsEquivalent(
      Either.Right(42).alt(Either.Right(24)),
      Either.Right(42)
    )
);

Deno.test(
  "Either.Right: #ap - Composition",
  () => {
    const containerA = Either.Right(42);
    const containerB = Either.Right(x => x + 2);
    const containerC = Either.Right(x => x * 2);

    assertIsEquivalent(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))),
      containerA.ap(containerB).ap(containerC)
    );
  }
);

Deno.test(
  "Either.Right: #chain",
  () =>
    assertIsEquivalent(
      Either.Right(42).chain(x => Either.of(x * 2)),
      Either.Right(84)
    )
);

Deno.test(
  "Either.Right: #map",
  () =>
    assertIsEquivalent(
      Either.Right(42).map(x => x * 2),
      Either.Right(84)
    )
);

Deno.test(
  "Either.Right: #map - Identity",
  () => {
    const container = Either.Right(42);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Either.Right: #map - Composition",
  () => {
    const container = Either.Right(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

Deno.test(
  "Either.Left: #alt",
  () =>
    assertIsEquivalent(
      Either.Left(32).alt(Either.Right(42)),
      Either.Right(42)
    )
);

Deno.test(
  "Either.Left: #map",
  () =>
    assertIsEquivalent(
      Either.Left(32).map(x => x * 2),
      Either.Left(32)
    )
);

Deno.test(
  "Either.Left: #map - Identity",
  () => {
    const container = Either.Left(32);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Either.Left: #map - Composition",
  () => {
    const container = Either.Left(32);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

export default Either;
