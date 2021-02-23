// @deno-types="./curry.d.ts"
import { curry2, curry3, curryN } from "./curry.js";
import { assertEquals, test } from "./testing.ts";

test ("curry2")
  (() => {
    const f = curry2 ((x: number, y: number) => x + y);
    assertEquals (f (42, 24)) (66);
    assertEquals (f (42) (24)) (66);
  });

test ("curry3")
  (() => {
    const f = curry3 ((x: number, y: number, z: number) => x + y + z);
    assertEquals (f (42, 24, 12)) (78);
    assertEquals (f (42, 24) (12)) (78);
    assertEquals (f (42) (24) (12)) (78);
  });

test ("curryN")
  (() => {
    const f = curryN (2) ((x: number, y: number) => x + y);
    assertEquals (f (42, 24)) (66);
    assertEquals (f (42) (24)) (66);

    const g = curryN (2, (x: number, y: number) => x + y);
    assertEquals (g (42, 24)) (66);
    assertEquals (g (42) (24)) (66);

    const h = curryN (3) ((x: number, y: number, z: number) => x + y + z);
    assertEquals (h (42, 24, 12)) (78);
    assertEquals (h (42, 24) (12)) (78);
    assertEquals (h (42) (24) (12)) (78);

    const i = curryN (3, (x: number, y: number, z: number) => x + y + z);
    assertEquals (i (42, 24, 12)) (78);
    assertEquals (i (42, 24) (12)) (78);
    assertEquals (i (42) (24) (12)) (78);

    const j = curryN (4)
      ((w: number, x: number, y: number, z: number) => w + x + y + z);
    assertEquals (j (42, 24, 12, 1)) (79);
    assertEquals (j (42, 24, 12) (1)) (79);
    assertEquals (j (42, 24) (12) (1)) (79);
    assertEquals (j (42) (24) (12) (1)) (79);

    const k = curryN (
      4,
      (w: number, x: number, y: number, z: number) => w + x + y + z
    );
    assertEquals (k (42, 24, 12, 1)) (79);
    assertEquals (k (42, 24, 12) (1)) (79);
    assertEquals (k (42, 24) (12) (1)) (79);
    assertEquals (k (42) (24) (12) (1)) (79);

    const l = curryN (5) ((v: number, w: number, x: number, y: number, z: number) => v + w + x + y + z);
    assertEquals (l (42, 33, 24, 12, 1)) (112);
    assertEquals (l (42, 33, 24, 12) (1)) (112);
    assertEquals (l (42, 33, 24) (12) (1)) (112);
    assertEquals (l (42, 33) (24) (12) (1)) (112);
    assertEquals (l (42) (33) (24) (12) (1)) (112);
  });

