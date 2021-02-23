// @deno-types="./Box.d.ts"
import Box, { factorizeBox } from "./Box.js";
import type { BoxPrototype } from "./Box.d.ts";
import { $$value } from "./Symbols.js";
import { assert, assertEquivalent, test } from "./testing.ts";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";
// @deno-types="./other.d.ts"
import { lift3 } from "./other.js";

test ("Box: initialize")
  (() => {
    assert (Box (42));
    assert (Box ((x: number) => x * 2));
  });

test ("Box: #ap")
  (() => {
    assertEquivalent
      ("The Box's value is multiplied by two.")
      (Box (42).ap(Box ((x: number) => x * 2)))
      (Box (84));
    assertEquivalent
      ("Composition law.")
      (Box (42).ap(Box ((x: number) => x * 2).ap(Box ((x: number) => x + 2).map(compose2))))
      (Box (42).ap(Box ((x: number) => x * 2)).ap(Box ((x: number) => x + 2)));
    assertEquivalent
      ("With lift3.")
      (lift3 (compose2) (Box ((x: number) => x + 2)) (Box ((x: number) => x * 2)) (Box (42)))
      (Box (42).ap(Box ((x: number) => x * 2)).ap(Box ((x: number) => x + 2)));
  });

test ("Box: #chain")
  (() => {
    assertEquivalent
      ("The Box's value is multiplied by two.")
      (Box (42).chain((x: number) => Box (x * 2)))
      (Box (84));
    assertEquivalent
      ("Associativity law.")
      (Box (42).chain((x: number) => Box (x * 2).chain((x: number) => Box (x + 2))))
      (Box (42).chain((x: number) => Box (x * 2)).chain((x: number) => Box (x + 2)));
  });

test ("Box: #extend")
  (() =>
    assertEquivalent
      ("The Box's value is multiplied by two.")
      (Box (42).extend((A: BoxPrototype<number>) => A[$$value] * 2))
      (Box (84))
  );

test ("Box: #extract")
  (() =>
    assertEquivalent
      ("The value is extracted from the container.")
      (Box (42).extract())
      (42)
  );

test ("Box: #map")
  (() => {
    assertEquivalent
      ("The Box's value is multiplied by two.")
      (Box (42).map((x: number) => x * 2))
      (Box (84));
    assertEquivalent
      ("Identity law.")
      (Box (42).map(identity))
      (Box (42));
    assertEquivalent
      ("Composition law.")
      (Box (42).map
        ((x: number) => compose2 ((x: number) => x + 2) ((x: number) => x * 2) (x)))
      (Box (42).map((x: number) => x * 2).map((x: number) => x + 2));
  });

test ("Box: #of")
  (() =>
    assertEquivalent
      ("A Box is factorized with the value.")
      (Box.of(42))
      (Box (42))
  );

test ("factorizeBox")
  (() =>
    assertEquivalent
      ("A Box is factorized with the value.")
      (factorizeBox (42))
      (Box (42))
  );