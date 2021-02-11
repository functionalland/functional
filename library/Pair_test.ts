import Pair from "./Pair.js";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";
import {assert, assertEquivalent, test} from "./testing.ts";

test ("Pair: initialize")
  (() => {
    assert (Pair(42, 24));
  });

test ("Pair: #bimap")
(() => {
  assertEquivalent
    ("The Pair's values is multiplied by two.")
    (Pair (42, 24).bimap((x: number) => x * 2, (x: number) => x + 2))
    (Pair (84, 26));
});

test ("Pair: #map")
  (() => {
    assertEquivalent
      ("The Pair's value is multiplied by two.")
      (Pair (42, 24).map((x: number) => x * 2))
      (Pair (84, 24));
    assertEquivalent
      ("Identity law.")
      (Pair (42, 24).map(identity))
      (Pair (42, 24));
    assertEquivalent
      ("Composition law.")
      (Pair (42, 24).map
        ((x: number) => compose2<number, number, number> ((x: number) => x + 2) ((x: number) => x * 2) (x)))
      (Pair (42, 24).map((x: number) => x * 2).map((x: number) => x + 2));
  });

