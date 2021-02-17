import { assert as _assert, assertEquals as _assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";

// @deno-types="./aviary.d.ts"
import { identity } from "./aviary.js";
// @deno-types="./curry.d.ts"
import { curry2, curryN } from "./curry.js";
// @deno-types="./other.d.ts"
import { find, zipWith } from "./other.js";
import { $$tag, $$type, $$valueList } from "./Symbols.js";
import { assertIsString } from "./assertions.js";

interface Container {
  [$$type]: string;
  [$$tag]: string;
  [$$valueList]: any[];
}

/**
 * ## Testing
 *
 *
 */
const __executeAssertEquivalent = (A: Container, B: Container) =>
  A[$$type] === B[$$type]
    && A[$$tag] === B[$$tag]
    && (A[$$valueList] && B[$$valueList]
      ? zipWith(equals, A[$$valueList], B[$$valueList]).every(identity)
      : equals(A, B))

export const assert = <X>(message: String|X) =>
  assertIsString(message) ? (x: X) => _assert(x, message as string) : _assert(message);

export const assertEquals = curry2(
  <X, Y>(x: string|X, y?: X|Y, ...a: (X|Y)[]) =>
    assertIsString(x) && (!assertIsString(y)  || x !== y)
      ? a.length === 1
        ? _assertEquals(y as X, a[0] as Y, x as string)
        : (z: Y) => _assertEquals(y as X, z as Y, x as string)
      : _assertEquals(x as X, y as Y)
);

export const assertEquivalent = curry2(
  (x: string|Container, y: Container, ...a: Container[]) =>
    assertIsString(x) && (!assertIsString(y)  || x !== y)
      ? a.length === 1
        ? _assert(__executeAssertEquivalent(y, a[0]), x as string)
        : (z: Container) => _assert(__executeAssertEquivalent(y, z), x as string)
      : assert(__executeAssertEquivalent(x as Container, y))
);

export const factorizeSpy = () => {
  const history: any[] = [];

  return [
    (n: number, f: Function) =>
      curryN(
        n,
        function (...argumentList: any[]) {
          // @ts-ignore
          return history.push(argumentList) && f.call(this, ...argumentList)
        }
      ),
    {
      assertCalledWith: (...argumentList: any[]) => {
        // @ts-ignore
        return !!find(equals(argumentList), history)
      },
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

