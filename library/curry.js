const _arity = (n, fn) => {
  if (n >= 0 && n <= 10) return Object.defineProperty(
    (...xs) => fn.apply(null, xs),
    "length",
    { enumerable: true, value: n }
  );
  else throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
};

const _curry1 = (f) => {
  return function f1(_) {
    return arguments.length === 0 ? f1 : f.apply(this, arguments);
  };
};

const _curry2 = (f) => {
  return function f2(x, y) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _curry1(function(z) { return f(x, z); });
      default:
        return f(x, y);
    }
  };
};

const _curryN = (n, xs, f) =>
  (...zs) => {
    const ys = [];
    let i = 0;
    let l = n;
    let xi = 0;

    while (xi < xs.length || i < zs.length) {
      let x;
      if (xi < xs.length || i >= zs.length) {
        x = xs[xi];
      } else {
        x = zs[i];
        i += 1;
      }
      ys[xi] = x;
      l -= 1;
      xi += 1;
    }

    return l <= 0 ? f.apply(this, ys) : _arity(l, _curryN(n, ys, f));
  }

/**
 * ## Curry
 *
 * Currying is the process of making a function of any arity (the number of argument) to a unary (one argument) function.
 * Curried functions are essentials to write combinatory logic and to write in the tacit style of programming.
 * The following utility functions can make a function of any arity a curried function.
 *
 * ### `curryN`
 *
 * This utility function takes a number, a function of any arity and, returns a curried function.
 *
 * ⚠️ This utility function's type are currently limited at 5 arguments. If this causes any issue; maybe break down your functions.
 * Joking aside, please submit an [issue on Github](https://github.com/functionalland/functional/issues).
 *
 * ```ts
 * import { curryN } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const f = curryN(2, (x, y) => x + y);
 * const g = f(42);
 * const x = g(24);
 *
 * assertEquals(x, 66);
 * ```
 *
 * ### `curry2`
 *
 * This utility function takes a binary function and, returns a curried function.
 *
 * ```ts
 * import { curry2 } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const f = curry2((x, y) => x + y);
 * const g = f(42);
 * const x = g(24);
 *
 * assertEquals(x, 66);
 * ```
 *
 * ### `curry3`
 *
 * This utility function takes a ternary function and, returns a curried function.
 *
 * ```ts
 * import { curry3 } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const f = curry3((x, y, z) => x + y + z);
 * const g = f(42);
 * const h = g(24);
 * const x = h(12);
 *
 * assertEquals(x, 78);
 * ```
 */
export const curryN = _curry2((n, f) => n === 1 ? _curry1(f) : _arity(n, _curryN(n, [], f)));
export const curry2 = curryN(2);
export const curry3 = curryN(3);
