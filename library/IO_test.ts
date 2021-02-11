// @deno-types="./IO.d.ts"
import IO, {factorizeIO} from "./IO.js";
import { assert, assertEquals, assertEquivalent, test } from "./testing.ts";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";

test ("IO: initialize")
  (() => {
    assert (IO (() => 42));
    assert (IO (() => (x: number) => x * 2));
  });

test ("IO: #ap - Composition")
  (() => {
    assertEquals
      ("The IO's value is multiplied by two.")
      (IO (() => 42).ap(IO (() => (x: number) => x * 2)).run())
      (IO (() => 84).run());
    assertEquals
      ("Composition law.")
      (IO (() =>42)
        .ap(IO (() => (x: number) => x * 2).ap(IO (() => (x: number) => x + 2).map(compose2))).run())
      (IO (() => 42).ap(IO (() => (x: number) => x * 2)).ap(IO (() => (x: number) => x + 2)).run());
  });

test ("IO: #chain")
  (() => {
    assertEquals
      ("The IO's value is multiplied by two.")
      (IO (() => 42).chain((x: number) => IO (() => x * 2)).run())
      (IO (() => 84).run());
    assertEquals
      ("Associativity law.")
      (IO (() => 42).chain((x: number) => IO (() => x * 2).chain((x: number) => IO (() => x + 2))).run())
      (IO (() => 42).chain((x: number) => IO (() => x * 2)).chain((x: number) => IO (() => x + 2)).run());
  });

test ("IO: #map")
  (() => {
    assertEquals
      ("The IO's value is multiplied by two.")
      (IO (() => 42).map((x: number) => x * 2).run())
      (IO (() => 84).run());
    assertEquals
      ("Identity law.")
      (IO (() => 42).map(identity).run())
      (IO (() => 42).run());
    assertEquals
      ("Composition law.")
      (IO (() => 42).map
        ((x: number) => compose2<number, number, number> ((x: number) => x + 2) ((x: number) => x * 2) (x)).run())
      (IO (() => 42).map((x: number) => x * 2).map((x: number) => x + 2).run());
  });

test ("IO: #of")
  (() =>
    assertEquivalent
      ("A IO is factorized with the value.")
      (IO.of(42).run())
      (IO (() => 42).run())
);

test ("factorizeBox")
  (() =>
    assertEquivalent
      ("A Box is factorized with the value.")
      (factorizeIO (() => 42).run())
      (IO (() => 42).run())
  );
