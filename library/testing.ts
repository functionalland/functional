import { assert as _assert, assertEquals as _assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";

import { identity } from "./aviary.js";
import { SumTypeContainer, TypeContainer } from "./algebraic.d.ts";
// @deno-types="./curry.d.ts"
import { curry2, curryN } from "./curry.js";
import { find, zipWith } from "./other.js";
import { $$tag, $$type, $$valueList } from "./Symbols.js";
import { assertIsString } from "./assertions.js";

type Container = Partial<SumTypeContainer> & TypeContainer & { [$$type]: string; };

const __executeAssertEquivalent = (A: Container, B: Container) =>
  A[$$type] === B[$$type]
    && A[$$tag] === B[$$tag]
    && (A[$$valueList] && B[$$valueList]
      ? zipWith(equals, A[$$valueList], B[$$valueList]).every(identity)
      : equals(A, B))

export const assert = <X, Y>(x: X|string, y?: Y) =>
  assertIsString(x) ? <Y01>(y: Y01) => _assert(y, x as string) : _assert(x);

export const assertEquals = <X, Y, Z>(x: X|string, y?: Y, z?: Z) =>
  assertIsString(x)
    ? y && z
      ? _assertEquals(y, z, x as string) as any
      : y
        ? z
          ? _assertEquals(y, z, x as string) as any
          : <Z01>(z: Z01) => _assertEquals(y, z, x as string) as any
        : <Y01, Z02>(y: Y01, z?: Z02) => z
          ? _assertEquals(y, z, x as string) as any
          : <Z03>(z: Z03) => _assertEquals(y, z, x as string) as any
    : x && y ? _assertEquals(x, y)  as any : <Y02>(y: Y02) => _assertEquals(x, y)  as any;

export const assertEquivalent = (x: Container|string, y?: Container|unknown, z?: Container|unknown) =>
  assertIsString(x)
    ? y && z
      ? _assert(__executeAssertEquivalent(y as Container, z as Container), x as string) as any
      : y
        ? z
          ? _assert(__executeAssertEquivalent(y as Container, z as Container), x as string) as any
          : (z: Container) => _assert(__executeAssertEquivalent(y as Container, z), x as string) as any
        : (y: Container, z?: Container|unknown) => z
          ? _assert(__executeAssertEquivalent(y, z as Container), x as string) as any
          : (z: Container|unknown) => _assert(__executeAssertEquivalent(y, z as Container), x as string) as any
    : x && y
      ? _assert(__executeAssertEquivalent(x as Container, y as Container), x as string) as any
      : (y: Container|unknown) => _assert(__executeAssertEquivalent(x as Container, y as Container), x as string) as any;

export const factorizeSpy = () => {
  const history: any[] = [];

  return [
    (n: number, f: Function) => curryN(n, (...xs: any[]) => history.push(xs) && f.call(null, ...xs)),
    {
      assertCalledWith: (...xs: any[]) => !!find(equals(xs), history),
      assertCallCount: (m: number) => m === history.length,
      get callCount() { return history.length },
      get history() { return history }
    }
  ]
};

export const test = curry2(
  (message: string, f: () => Promise<any>|any) => Deno.test(message, () => {
    const x = f();
    if (x instanceof Promise) return x.then(_ => {});
  })
);
