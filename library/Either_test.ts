// @deno-types="./Either.d.ts"
import Either, { factorizeEitherFromNullable, factorizeEitherRight, factorizeEitherLeft } from "./Either.js";
import type { EitherRightPrototype } from "./Either.d.ts";
import { $$value } from "./Symbols.js";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";
import { lift3 } from "./other.js";
import { assert, assertEquals, assertEquivalent, test } from "./testing.ts";

test ("Either: initialize")
  (() => {
    assert (Either.Right(42));
    assert (Either.Right((x: number) => x * 2));
    assert (Either.Left(null));
  });

test ("Either: #ap")
  (() => {
    assertEquivalent
      ("The Either's value is multiplied by two.")
      (Either.Right(42).ap(Either.Right((x: number) => x * 2)))
      (Either.Right(84));
    assertEquivalent
      ("The container is not affected.")
      (Either.Left(null).ap(Either.Right((x: number) => x * 2)))
      (Either.Left(null));
    assertEquivalent
      ("Composition law.")
      (Either.Right(42).ap(Either.Right((x: number) => x * 2).ap(Either.Right((x: number) => x + 2).map(compose2))))
      (Either.Right(42).ap(Either.Right((x: number) => x * 2)).ap(Either.Right((x: number) => x + 2)));
    assertEquivalent
      ("With lift3.")
      (lift3 (compose2) (Either.Right((x: number) => x + 2)) (Either.Right((x: number) => x * 2)) (Either.Right(42)))
      (Either.Right(42).ap(Either.Right((x: number) => x * 2)).ap(Either.Right((x: number) => x + 2)));
  });

test ("Either: #chain")
  (() => {
    assertEquivalent
      ("The Either's value is multiplied by two.")
      (Either.Right(42).chain((x: number) => Either.Right(x * 2)))
      (Either.Right(84));
    assertEquivalent
      ("The container is not affected.")
      (Either.Left(null).chain((x: number) => Either.Right(x * 2)))
      (Either.Left(null));
    assertEquivalent
      ("Associativity law.")
      (Either.Right(42).chain((x: number) => Either.Right(x * 2).chain((x: number) => Either.Right(x + 2))))
      (Either.Right(42).chain((x: number) => Either.Right(x * 2)).chain((x: number) => Either.Right(x + 2)));
  });

test ("Either: #extend")
  (() => {
    assertEquivalent
      ("The Either's value is multiplied by two.")
      (Either.Right(42).extend((A: EitherRightPrototype<number>) => A[$$value] * 2))
      (Either.Right(84));
    assertEquivalent
      ("The container is not affected.")
      (Either.Left(null).extend((A: EitherRightPrototype<number>) => A[$$value] * 2))
      (Either.Left(null));
  });

test ("Either: #extract")
  (() => {
    assertEquals
      ("The value is extracted from the container.")
      (Either.Right(42).extract())
      (42);
    assertEquals
      ("The container is not affected.")
      (Either.Left(null).extract())
      (null);
  });

test ("Either: #map")
  (() => {
    assertEquivalent
      ("The Either's value is multiplied by two.")
      (Either.Right(42).map((x: number) => x * 2))
      (Either.Right(84));
    assertEquivalent
      ("The container is not affected.")
      (Either.Left(null).map((x: number) => x * 2))
      (Either.Left(null));
    assertEquivalent
      ("Identity law.")
      (Either.Right(42).map(identity))
      (Either.Right(42));
    assertEquivalent
      ("Composition law.")
      (Either.Right(42).map
        ((x: number) => compose2<number, number, number> ((x: number) => x + 2) ((x: number) => x * 2) (x)))
      (Either.Right(42).map((x: number) => x * 2).map((x: number) => x + 2));
  });

test ("Either: #of")
  (() =>
    assertEquivalent
      ("A Either is factorized with the value.")
      (Either.of(42))
      (Either.Right(42))
  );

test ("Either: factorizeEitherFromNullable")
  (() => {
    assertEquivalent
      ("A Either is factorized with the value.")
      (factorizeEitherFromNullable (42))
      (Either.Right(42));
    assertEquivalent
      ("A Either is factorized with the object.")
      (factorizeEitherFromNullable ({ "hoge": "piyo" }))
      (Either.Right({ "hoge": "piyo" }));
    assertEquivalent
      ("A Either.Left is factorized with `null`.")
      (factorizeEitherFromNullable (null))
      (Either.Left(null));
  });

test ("Either: factorizeEitherRight")
  (() =>
    assertEquivalent
      ("A Either is factorized with the value.")
      (factorizeEitherRight (42))
      (Either.Right(42))
  );

test ("Either: factorizeEitherLeft")
  (() =>
    assertEquivalent
      ("A Either is factorized with the value.")
      (factorizeEitherLeft (42))
      (Either.Left(42))
  );
