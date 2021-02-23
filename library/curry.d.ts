type C2<X, Y, T> = <Y01>(x: X, y?: Y01) => Y01 extends Y ? T : (b: Y) => T;
type C3<X, Y, Z, T> = <Y01, Z01>(x: X, y?: Y01, z?: Z01) =>
  Y01 extends Y
    ? Z01 extends Z ? Z : (c: Z) => Z
    : C2<Y, Z, Z>;
type C4<W, X, Y, Z, T> = <X01, Y01, Z01>(w: W, x?: X01, y?: Y01, z?: Z01) =>
  X01 extends X
    ? Y01 extends Y ? Z01 extends Z ? Z : (d: Z) => Z : C2<Y, Z, Z>
    : C3<X, Y, Z, Z>;
type C5<V, W, X, Y, Z, T> = <W01, X01, Y01, Z01>(v: V, w?: W01, x?: X01, y?: Y01, z?: Z01) =>
  W01 extends W
    ? X01 extends X ? Y01 extends Y ? Z01 extends Z ? Z : (e: Z) => Z : C2<Y, Z, Z> : C3<X, Y, Z, Z>
    : C4<W, X, Y, Z, Z>;

export function curryN (n: number): <V, W, X, Y, Z, T>(f: (u: V, v: W, w: X, x: Y, y: Z) => T) => C5<V, W, X, Y, Z, T>;
export function curryN <V, W, X, Y, Z, T>(n: number, f: (u: V, v: W, w: X, x: Y, y: Z) => T): C5<V, W, X, Y, Z, T>;
export function curryN (n: number): <W, X, Y, Z, T>(f: (v: W, w: X, x: Y, y: Z) => T) => C4<W, X, Y, Z, T>;
export function curryN <W, X, Y, Z, T>(n: number, f: (v: W, w: X, x: Y, y: Z) => T): C4<W, X, Y, Z, T>;
export function curryN (n: number): <X, Y, Z, T>(f: (w: X, x: Y, y: Z) => T) => C3<X, Y, Z, T>;
export function curryN <X, Y, Z, T>(n: number, f: (w: X, x: Y, y: Z) => T): C3<X, Y, Z, T>;
export function curryN (n: number): <X, Y, T>(f: (x: X, y: Y) => T) => C2<X, Y, T>;
export function curryN <X, Y, T>(n: number, f: (x: X, y: Y) => T): C2<X, Y, T>;

export function curry2 <X, Y, T>(f: (x: X, y: Y) => T): C2<X, Y, T>;

export function curry3 <X, Y, Z, T>(f: (x: X, y: Y, z: Z) => T): C3<X, Y, Z, T>;
