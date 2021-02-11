// @deno-types="./algebraic.d.ts"
import { alt, ap, bimap, chain, extend, extract, map } from "./algebraic.js";
import { assertEquals, assertEquivalent, test } from "./testing.ts";

// @deno-types="./Box.d.ts"
import Box from "./Box.js";
import { BoxPrototype } from "./Box.d.ts";
import Either from "./Either.js";
import Pair from "./Pair.js";
import { $$value } from "./Symbols.js";

// const accumulate = applyToFlip(append);

test ("Algebraic: alt")
  (() =>
    assertEquivalent
      ("The Right type is returned; target container is Left.")
      (alt (Either.Right(42)) (Either.Left("Not the meaning of life.")))
      (Either.Right(42)) ||
    assertEquivalent
      ("The Right type is returned; target container is Right")
      (alt (Either.Right(24)) (Either.Right(42)))
      (Either.Right(42))
  );

test ("Algebraic: ap")
  (() =>
    assertEquivalent
      ("The container's value is multiplied by two.")
      (ap (Box ((x: number) => x * 2)) (Box (42)))
      (Box (84))
  );

test ("Algebraic: bimap")
  (() =>
    assertEquivalent
      ("The container's values are morphed.")
      (bimap ((x: number) => x * 2, (x: number) => x + 2) (Pair (42, 24)))
      (Pair (84, 26))
  );

test ("Algebraic: chain")
  (() =>
    assertEquivalent
      ("The container's value is multiplied by two.")
      (chain ((x: number) => Box (x * 2)) (Box (42)))
      (Box (84))
  );

// test ("Algebraic: concat")
//   (() =>
//     assertEquivalent
//       ("The two container's values are concatenated.")
//       (concat ([ 104, 111, 103, 101 ]) ([  102, 117, 103, 97 ]))
//       ([ 102, 117, 103, 97, 104, 111, 103, 101 ])
//   );

test ("Algebraic: extend")
  (() =>
    assertEquivalent
      ("The container's value is multiplied by two.")
      (extend ((A: BoxPrototype<number>) => A[$$value] * 2) (Box (42)))
      (Box (84))
  );

test ("Algebraic: extract")
  (() =>
    assertEquals
      ("The value is extracted from the container.")
      (extract (Box (42)))
      (42)
  );

test ("Algebraic: map")
  (() =>
    assertEquivalent
      ("The container's value is multiplied by two.")
      (map ((x: number) => x * 2) (Box (42)))
      (Box (84))
  );
