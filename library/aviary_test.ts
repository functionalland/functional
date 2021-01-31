// @deno-types="./aviary.d.ts"
import {
  ap,
  apply,
  applyTo,
  compose2,
  compose3,
  constant,
  flip,
  identity
} from "./aviary.js";

  // applyCompose,
  // applyComposeBinary,
  // applyTernaryFlip,
  // applyTo,
  // applyToBinary,
  // applyToFlip,
  // applyQuaternaryFlip,
  // compose3,
  // composeBinaryApBinary,
  // composeBinary,
  // composeTernary,
  // constant,
  // duplicate,
  // flip,
  // flipAp,
  // flipTernary,
  // flipQuaternary,
  // identity,
  // second,

import { curryN } from "./curry.js";

import { assertEquals, test } from "./testing.ts";

test ("Aviary: ap")
  (() => {
    assertEquals (ap ((x: number) => (y: number) => x + y, (x: number) => x * 2, 42)) (126);
    assertEquals ("Curried unary.") (ap<number, number, number> (x => y => x + y) (x => x * 2) (42)) (126);
    assertEquals ("Curried binary.") (ap<number, number, number> (x => y => x + y, x => x * 2) (42)) (126);
  });

// const f = (x: number) => true;
// const g = f(42) + 3;

// test ("Aviary: apBinary")
//   (() => {
//     assertEquals
//       (apBinary ((x: number) => (y: number) => x * y, (x: number) => x + 2, (x: number) => x * 2, 42))
//       (3696);
//     assertEquals
//       ("Curried.")
//       (apBinary ((x: number) => (y: number) => x * y) ((x: number) => x + 2) ((x: number) => x * 2) (42))
//       (3696);
//   });

test ("Aviary: apply")
  (() => {
    assertEquals (apply ((x: number) => x * 2, 42)) (84);
    assertEquals ("Curried unary.") (apply<number, number> (x => x * 2) (42)) (84);
  });

// test ("Aviary: apply2Compose")
//   (() => {
//     assertEquals
//       (apply2Compose
//         ((x: number) => (y: number) => x + y, (x: number) => x * 2, 42, (x: number) => x + 2, 24))
//       (110);
//     assertEquals
//       ("Curried.")
//       (apply2Compose
//         ((x: number) => (y: number) => x + y)
//         ((x: number) => x * 2)
//         (42)
//         ((x: number) => x + 2)
//         (24))
//       (110);
//     assertEquals
//       ("Derivation.")
//       (compose2(compose2, compose2(compose2))
//         ((x: number) => (y: number) => x + y) ((x: number) => x * 2) (42) ((x: number) => x + 2) (24))
//       (110);
//   });
//
// test ("Aviary: applyBinaryCompose")
//   (() => {
//     assertEquals
//       (applyBinaryCompose
//         ((x: number) => (y: number) => (z: number) => x + y + z, 42, 24, (x: number) => x * 2, 12))
//       (90);
//     assertEquals
//       ("Curried.")
//       (applyBinaryCompose
//         ((x: number) => (y: number) => (z: number) => x + y + z)
//         (42)
//         (24)
//         ((x: number) => x * 2)
//         (12))
//       (90);
//     assertEquals
//       ("Derivation.")
//       (compose2(compose2(compose2))
//         ((x: number) => (y: number) => (z: number) => x + y + z) (42) (24) ((x: number) => x * 2) (12))
//       (90);
//   });

test ("Aviary: compose2")
  (() => {
    assertEquals (compose2 ((x: number) => x * 2, (x: number) => x + 2, 42)) (88);
    assertEquals ("Curried unary.") (compose2<number, number, number> (x => x * 2) (x => x + 2) (42)) (88);
    assertEquals ("Curried binary.") (compose2<number, number, number> (x => x * 2, x => x + 2) (42)) (88);
  });

test ("Aviary: compose3")
  (() => {
    assertEquals (compose3 ((x: number) => x - 2, (x: number) => x * 2, (x: number) => x + 2, 42)) (86);
    assertEquals
      ("Curried unary.")
      (compose3<number, number, number, number> (x => x - 2) (x => x * 2) (x => x + 2) (42)) (86);
    assertEquals
      ("Curried binary.")
      (compose3<number, number, number, number> (x => x - 2,x => x * 2) (x => x + 2) (42)) (86);
  });

// test ("Aviary: applyCompose")
//   (() =>
//     assertEquals (applyCompose (x => y => x + y, 42, x => x * 2, 24)) (90) ||
//     assertEquals ("Curried.") (applyCompose (x => y => x + y) (42) (x => x * 2) (24)) (90) ||
//     assertEquals ("Derivation.") (compose2(compose2) (x => y => x + y) (42) (x => x * 2) (24)) (90)
//   );

// test ("Aviary: applyComposeBinary")
//   (() =>
//     assertEquals (applyComposeBinary (x => y => x + y, 42, x => y => x * y, 24, 12)) (330) ||
//     assertEquals ("Curried.") (applyComposeBinary (x => y => x + y) (42) (x => y => x * y) (24) (12)) (330) ||
//     assertEquals
//       ("Derivation.")
//       (compose2 (compose2 (compose2) (compose2)) (x => y => x + y) (42) (x => y => x * y) (24) (12))
//       (330)
//   );
//
// test ("Aviary: applyTernaryFlip")
//   (() =>
//     assertEquals (applyTernaryFlip (x => y => z => x - y - z, 12, 24, 42)) (6) ||
//     assertEquals ("Curried.") (applyTernaryFlip (x => y => z => x - y - z) (12) (24) (42)) (6)
//   );

test ("Aviary: applyTo")
  (() => {
    assertEquals (applyTo (42, x => x * 2)) (84);
    assertEquals ("Curried unary.") (applyTo<number, number> (42) (x => x * 2)) (84);
    assertEquals
      ("Derivation.")
      (flip<number, (x: number) => number, number> (identity) (42) ((x: number) => x * 2)) (84);
  });

// test ("Aviary: applyToBinary")
//   (() =>
//     assertEquals (applyToBinary (42, 24, x => y => x * y)) (1008) ||
//     assertEquals ("Curried.") (applyToBinary (42) (24) (x => y => x * y)) (1008)
//   );
//
// test ("Aviary: applyToFlip")
//   (() =>
//     assertEquals (applyToFlip (24, 42, x => y => x - y)) (18) ||
//     assertEquals ("Curried.") (applyToFlip (24) (42) (x => y => x - y)) (18)
//   );
//
// test ("Aviary: applyQuaternaryFlip")
//   (() =>
//     assertEquals (applyQuaternaryFlip (w => x => y => z => w - x - y - z, 84, 24, 42, 12)) (6) ||
//     assertEquals ("Curried.") (applyQuaternaryFlip (w => x => y => z => w - x - y - z) (84) (24) (42) (12)) (6)
//   );
//
//
// test ("Aviary: compose3")
//   (() =>
//     assertEquals (compose3 (x => x - 2, x => x * 2, x => x + 2, 42)) (86) ||
//     assertEquals ("Curried.") (compose3 (x => x - 2) (x => x * 2) (x => x + 2) (42)) (86)
//   );
//
// test ("Aviary: composeBinary")
//   (() =>
//     assertEquals (composeBinary (x => x * 2, x => y => x + y, 42, 24)) (132) ||
//     assertEquals (composeBinary (x => x * 2, x => y => x + y) (42, 24)) (132) ||
//     assertEquals ("Curried.") (composeBinary (x => x * 2) (x => y => x + y) (42) (24)) (132) ||
//     assertEquals ("Derivation.") (compose2 (compose2) (compose2) (x => x * 2) (x => y => x + y) (42) (24)) (132)
//   );
//
// test ("Aviary: composeBinaryApBinary")
//   (() =>
//     assertEquals (composeBinaryApBinary (x => y => x + y, x => y => x * y, 42, 24, x => y => x * y, 12, 4)) (1056) ||
//     assertEquals
//       ("Curried.")
//       (composeBinaryApBinary (x => y => x + y) (x => y => x * y) (42) (24) (x => y => x * y) (12) (4))
//       (1056) ||
//     assertEquals
//       ("Derivation.")
//       (compose2 (compose2 (compose2) (compose2)) (compose2 (compose2 (compose2) (compose2)))
//       (x => y => x + y) (x => y => x * y) (42) (24) (x => y => x * y) (12) (4))
//       (1056)
//   );
//
// test ("Aviary: composeTernary")
//   (() =>
//     assertEquals (composeTernary (x => x * 2, x => y => z => x + y + z, 42, 24, 12)) (156) ||
//     assertEquals (composeTernary (x => x * 2, x => y => z => x + y + z) (42, 24, 12)) (156) ||
//     assertEquals ("Curried.") (composeTernary (x => x * 2) (x => y => z => x + y + z) (42) (24) (12)) (156) ||
//     assertEquals
//       ("Derivation.")
//       (compose2 ((compose2) (compose2) (compose2)) (compose2) (x => x * 2) (x => y => z => x + y + z) (42) (24) (12))
//       (156)
//   );

test ("Aviary: constant")
  (() => {
    assertEquals (constant (42, 24)) (42);
    assertEquals ("Curried.") (constant (42) (24)) (42);
  });

// test ("Aviary: duplicate")
// (() =>
//   assertEquals (duplicate (x => y => x * y, 42)) (1764) ||
//   assertEquals ("Curried.") (duplicate (x => y => x * y) (42)) (1764)
// );

test ("Aviary: flip")
  (() =>
    assertEquals (flip ((x: number) => (y: number) => x - y, 24, 42)) (18) ||
    assertEquals ("Curried unary.") (flip<number, number, number> (x => y => x - y) (24) (42)) (18) ||
    assertEquals (flip (curryN (2) ((x: number, y: number) => x - y)) (24) (42)) (18)
  );

// test ("Aviary: flipAp")
//   (() =>
//     assertEquals (flipAp (x => y => x - y, x => x * 2, 42, 24)) (6) ||
//     assertEquals ("Curried.") (flipAp (x => y => x - y) (x => x * 2) (42) (24)) (6)
//   );
//
// test ("Aviary: flipTernary")
//   (() =>
//     assertEquals (flipTernary (x => y => z => x + y - z, 42, 12, 24)) (54) ||
//     assertEquals (flipTernary (x => y => z => x + y - z) (42, 12, 24)) (54) ||
//     assertEquals ("Curried.") (flipTernary (x => y => z => x + y - z) (42) (12) (24)) (54) ||
//     assertEquals ("Derivation.") (compose2 (flip) (x => y => z => x + y - z) (42) (12) (24)) (54)
//   );
//
// test ("Aviary: flipQuaternary")
//   (() =>
//     assertEquals (flipQuaternary (w => x => y => z => w * x + y - z, 42, 24, 2, 12)) (1018) ||
//     assertEquals (flipQuaternary (w => x => y => z => w * x + y - z) (42, 24, 2, 12)) (1018) ||
//     assertEquals ("Curried.") (flipQuaternary (w => x => y => z => w * x + y - z) (42) (24) (2) (12)) (1018)
//   );
//
// test ("Aviary: second")
//   (() =>
//     assertEquals (second (42, 24)) (24) ||
//     assertEquals ("Curried.") (second (42) (24)) (24)
//   )

test ("Aviary: identity")
  (() => assertEquals (identity (42)) (42));


