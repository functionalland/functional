import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { assertIsDefined, assertIsEquivalent, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";

const $$value = Symbol.for("TypeValue");

export const Maybe = factorizeSumType(
  "Maybe",
  {
    Nothing: [],
    Just: [ $$value ]
  }
);

Maybe.fromNullable = value => !assertIsDefined(value) || assertIsNone(value) ? Maybe.nothing() : Maybe.just(value);
Maybe.just = value => Maybe.Just(value);
Maybe.nothing = () => Maybe.Nothing;
Maybe.of = value => Maybe.Just(value);

// filter :: Maybe a => a ~> (a -> Boolean) -> a
Maybe.prototype.filter = function (composedFunction) {

  return Maybe.fromNullable(composedFunction(this[$$value]) ? this[$$value] : null)[$$value] || null;
};

// map :: Maybe a => a ~> (a -> b) -> Maybe b
Maybe.prototype.map = function (composedFunction) {

  return (Maybe.Just.is(this)) ? Maybe.Just(composedFunction(this[$$value])) : this;
};

Deno.test(
  "Maybe: #just",
  () =>
      assertIsEquivalent(Maybe.just(42), Maybe.Just(42))
);

Deno.test(
  "Maybe.Just: #map",
  () =>
    assertIsEquivalent(
      Maybe.Just(42).map(x => x * 2),
      Maybe.Just(84)
    )
);

Deno.test(
  "Maybe.Just: #map - Identity",
  () => {
    const container = Maybe.Just(42);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Maybe.Just: #map - Composition",
  () => {
    const container = Maybe.Just(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

Deno.test(
  "Maybe.Nothing: #map",
  () =>
    assertIsEquivalent(
      Maybe.Nothing.map(x => x * 2),
      Maybe.Nothing
    )
);

Deno.test(
  "Maybe.Nothing: #map - Identity",
  () => {
    const container = Maybe.Nothing;

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Maybe.Nothing: #map - Composition",
  () => {
    const container = Maybe.Nothing;
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

Deno.test(
  "Maybe.Just: #filter",
  () => {
    assertEquals(
      Maybe.Just(42).filter(x => x % 2 === 0),
      42
    );
    assertEquals(
      Maybe.Just(9).filter(x => x % 2 === 0),
      null
    );
  }
);

Deno.test(
  "Maybe.Nothing: #filter",
  () =>
    assertEquals(
      Maybe.Nothing.filter(x => x % 2 === 0),
      null
    )
);

Deno.test(
  "Maybe: Test #fold",
  () => {
    const serialize = (container) =>
      container.fold({
        Nothing: () => "There is no value.",
        Just: (value) => `The value is ${value}.`
      });
    const container = Maybe.Just(42);

    assertEquals(
      serialize(container),
      "The value is 42."
    );
  }
);

export default Maybe;
