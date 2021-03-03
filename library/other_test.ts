// @deno-types="./Box.d.ts"
import Box from "./Box.js";
import { BoxPrototype } from "./Box.d.ts";

// @deno-types="./other.d.ts"
import { append, not, complement, find, has, join } from "./other.js";
import { assertEquals, test } from "./testing.ts";

test ("Other: append")
  (() => {
    assertEquals (append (1, [ 42, 24, 12 ])) ([ 42, 24, 12, 1 ]);
    assertEquals ("Curried.") (append (1) ([ 42, 24, 12 ])) ([ 42, 24, 12, 1 ]);
  });

test ("Other: not")
  (() => {
    assertEquals (not (true)) (false);
  });

test ("Other: complement")
  (() => {
    assertEquals (complement ((x: number) => x > 30, 42)) (false);
    assertEquals ("Curried.") (complement ((x: number) => x > 30) (42)) (false);
  });

test ("Other: find")
  (() => {
    assertEquals (find ((x: number) => x > 30, [ 42, 24, 12 ])) (42);
    assertEquals ("Curried.") (find ((x: number) => x > 30) ([ 42, 24, 12 ])) (42);
  });

test ("Other: has")
  (() => {
    assertEquals (has ("hoge", { hoge: "piyo" })) (true);
    assertEquals ("Curried.") (has ("hoge") ({ hoge: "piyo" })) (true);
  });

test ("Other: join")
  (() => {
    assertEquals (join (" + ", [ 42, 24, 12 ])) ("42 + 24 + 12");
    assertEquals ("Curried.") (join (" + ") ([ 42, 24, 12 ])) ("42 + 24 + 12");
  });
