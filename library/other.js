import { compose2 } from "./aviary.js";
import { curry2, curry3, curryN } from "./curry.js";
import { assertIsObject } from "./assertions.js";

/**
 * ### `append`
 *
 * This function takes a value of any type, an iterable and return a new iterable of same type including the value at the last position.
 *
 * ```ts
 * import { append } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = append(1, [ 42, 24, 12 ]);
 *
 * assertEquals(x, [ 42, 24, 12, 1 ]);
 * ```
 */
export const append = curry2((x, xs) => [ ...xs, x ]);

/**
 * ### `not`
 *
 * This function takes a value that can be coerced to a boolean and, returns the logical complement.
 *
 * ```ts
 * import { not } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = not(true);
 *
 * assertEquals(x, false);
 * ```
 */
export const not = x => !x;

/**
 * ### `complement`
 *
 * This function takes a predicate, a value of any type and, returns a boolean.
 *
 * ```ts
 * import { complement } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = complement((x: number) => x > 30, 42);
 *
 * assertEquals(x, false);
 * ```
 */
export const complement = compose2(not);

/**
 * ### `find`
 *
 * This function takes a predicate, an iterable of any type and, returns the first value that passes the predicate's test.
 *
 * ```ts
 * import { find } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = find((x: number) => x > 30, [ 42, 24, 12 ]);
 *
 * assertEquals(x, 42);
 * ```
 */
export const find = curry2((f, xs) => xs.find(f));

/**
 * ### `has`
 *
 * This function takes a key, an object and, returns a boolean.
 *
 * ```ts
 * import { has } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = has("hoge", { hoge: "piyo" });
 *
 * assertEquals(x, true);
 * ```
 */
export const has = curry2((k, o) => assertIsObject(k) ? o.has(k) : !!o[k]);

/**
 * ### `join`
 *
 * This function takes a separator string, an array and, returns a string.
 *
 * ```ts
 * import { join } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const x = join(" + ", [ 42, 24, 12 ]);
 *
 * assertEquals(x, "42 + 24 + 12");
 * ```
 */
export const join = curry2((x, ys) => ys.join(x));
export const lift2 = curry3((f, x, y) => y.ap(x.map(f)));
export const lift3 = curryN(4, (f, x, y, z) => z.ap(y.ap(x.map(f))));
export const prop = curry2((x, y) => y[x]);
export const get = prop;
export const set = curry3((k, x, o) => Object.defineProperty(o, k, { enumerable: true, value: x, writable: true }));

/**
 * ### `zip`
 *
 *
 */
export const zip = curry2((xs, ys) => {
  const zs = [];
  for (let i = 0; i < xs.length; i++) {
    zs[i] = [ xs[i], ys[i] ];
  }

  return zs;
});

export const zipObj = curry2((xs, ys) => {
  const zs = {};
  for (let i = 0; i < xs.length; i++) {
    zs[xs[i]] = ys[i];
  }

  return zs;
});

export const zipWith = curry3((f, xs, ys) => {
  const zs = [];
  for (let i = 0; i < xs.length; i++) {
    zs[i] = f(xs[i])(ys[i]);
  }

  return zs;
});
