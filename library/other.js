import { compose2 } from "./aviary.js";
import { curry2, curry3, curryN } from "./curry.js";
import { assertIsObject } from "./assertions.js";

export const append = curry2((x, xs) => [ ...xs, x ]);
export const not = x => !x;
export const complement = compose2(not);

export const find = curry2((f, xs) => xs.find(f));

export const has = curry2((x, y) => assertIsObject(x) ? y.has(x) : !!y[x]);
export const join = curry2((x, y) => y.join(x));
export const lift2 = curry3((f, x, y) => y.ap(x.map(f)));
export const lift3 = curryN(4, (f, x, y, z) => z.ap(y.ap(x.map(f))));
export const prop = curry2((x, y) => y[x]);
export const set = curry3((s, x, o) => Object.defineProperty(o, s, { enumerable: true, value: x, writable: true }));
export const zip = curry2((xs, ys) => {
  let i = 0;
  let zs = [];
  for (; i < xs.length; i++) {
    zs[i] = [ xs[i], ys[i] ];
  }

  return zs;
});

export const zipObj = curry2((xs, ys) => {
  let i = 0;
  let zs = {};
  for (; i < xs.length; i++) {
    zs[xs[i]] = ys[i];
  }

  return zs;
});

export const zipWith = curry3((f, xs, ys) => {
  let i = 0;
  let zs = [];
  for (; i < xs.length; i++) {
    zs[i] = f(xs[i])(ys[i]);
  }

  return zs;
});
