// @deno-types="./Maybe.d.ts"
import Maybe, { factorizeMaybeFromNullable, factorizeMaybeJust, factorizeMaybeNothing } from "./Maybe.js";
import type { MaybePrototype } from "./Maybe.d.ts";
import { $$value } from "./Symbols.js";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";
// @deno-types="./other.d.ts"
import { lift3 } from "./other.js";
import { assert, assertEquivalent, test } from "./testing.ts";

test ("Maybe: initialize")
  (() => {
    assert (Maybe.Just(42));
    assert (Maybe.Just((x: number) => x * 2));
    assert (Maybe.Nothing);
  });

test ("Maybe: #ap")
  (() => {
    assertEquivalent
      ("The Maybe's value is multiplied by two.")
      (Maybe.Just(42).ap(Maybe.Just((x: number) => x * 2)))
      (Maybe.Just(84));
    assertEquivalent
      ("The container is not affected.")
      (Maybe.Nothing.ap(Maybe.Just((x: number) => x * 2)))
      (Maybe.Nothing);
    assertEquivalent
      ("Composition law.")
      (Maybe.Just(42).ap(Maybe.Just((x: number) => x * 2).ap(Maybe.Just((x: number) => x + 2).map(compose2))))
      (Maybe.Just(42).ap(Maybe.Just((x: number) => x * 2)).ap(Maybe.Just((x: number) => x + 2)));
    assertEquivalent
      ("With lift3.")
      (lift3 (compose2) (Maybe.Just((x: number) => x + 2)) (Maybe.Just((x: number) => x * 2)) (Maybe.Just(42)))
      (Maybe.Just(42).ap(Maybe.Just((x: number) => x * 2)).ap(Maybe.Just((x: number) => x + 2)));
  });

test ("Maybe: #chain")
  (() => {
    assertEquivalent
      ("The Maybe's value is multiplied by two.")
      (Maybe.Just(42).chain((x: number) => Maybe.Just(x * 2)))
      (Maybe.Just(84));
    assertEquivalent
      ("The container is not affected.")
      (Maybe.Nothing.chain((x: number) => Maybe.Just(x * 2)))
      (Maybe.Nothing);
    assertEquivalent
      ("Associativity law.")
      (Maybe.Just(42).chain((x: number) => Maybe.Just(x * 2).chain((x: number) => Maybe.Just(x + 2))))
      (Maybe.Just(42).chain((x: number) => Maybe.Just(x * 2)).chain((x: number) => Maybe.Just(x + 2)));
  });

test ("Maybe: #extend")
  (() => {
    assertEquivalent
      ("The Maybe's value is multiplied by two.")
      (Maybe.Just(42).extend((A: MaybePrototype<number>) => A[$$value] * 2))
      (Maybe.Just(84));
    assertEquivalent
      ("The container is not affected.")
      (Maybe.Nothing.extend((A: MaybePrototype<number>) => A[$$value] * 2))
      (Maybe.Nothing);
  });


test ("Maybe: #extract")
  (() =>
    assertEquivalent
      ("The value is extracted from the container.")
      (Maybe.Just(42).extract())
      (42)
  );

test ("Maybe: #map")
  (() => {
    assertEquivalent
      ("The Maybe's value is multiplied by two.")
      (Maybe.Just(42).map((x: number) => x * 2))
      (Maybe.Just(84));
    assertEquivalent
      ("The container is not affected.")
      (Maybe.Nothing.map((x: number) => x * 2))
      (Maybe.Nothing);
    assertEquivalent
      ("Identity law.")
      (Maybe.Just(42).map(identity))
      (Maybe.Just(42));
    assertEquivalent
      ("Composition law.")
      (Maybe.Just(42).map
        ((x: number) => compose2 ((x: number) => x + 2) ((x: number) => x * 2) (x)))
      (Maybe.Just(42).map((x: number) => x * 2).map((x: number) => x + 2));
  });

test ("Maybe: #of")
  (() =>
    assertEquivalent
      ("A Maybe is factorized with the value.")
      (Maybe.of(42))
      (Maybe.Just(42))
  );

test ("Maybe: factorizeMaybeFromNullable")
  (() => {
    assertEquivalent
      ("A Maybe is factorized with the value.")
      (factorizeMaybeFromNullable (42))
      (Maybe.Just(42));
    assertEquivalent
      ("A Maybe is factorized with the object.")
      (factorizeMaybeFromNullable ({ "hoge": "piyo" }))
      (Maybe.Just({ "hoge": "piyo" }));
    assertEquivalent
      ("A Maybe.Nothing is factorized with `null`.")
      (factorizeMaybeFromNullable (null))
      (Maybe.Nothing);
  });

test ("Maybe: factorizeMaybeJust")
  (() =>
    assertEquivalent
      ("A Maybe is factorized with the value.")
      (factorizeMaybeJust (42))
      (Maybe.Just(42))
  );

test ("Maybe: factorizeMaybeNothing")
  (() =>
    assertEquivalent
      ("A Maybe is factorized with the value.")
      (factorizeMaybeNothing ())
      (Maybe.Nothing)
  );
