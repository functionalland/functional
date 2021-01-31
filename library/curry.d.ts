export function curryN (n: number): (f: Function) => Function;
export function curryN (n: number, f: Function): Function;

export function curry2 <X, Y>(f: Function): (x: X) => (y: Y) => Function;
export function curry2 <X, Y>(f: Function): (x: X, y: Y) => Function;

export function curry3 <X, Y, Z>(f: Function): (x: X) => (y: Y) => (z: Z) => Function;
export function curry3 <X, Y, Z>(f: Function): (x: X) => (y: Y, z: Z) => Function;
export function curry3 <X, Y, Z>(f: Function): (x: X, y: Y, z: Z) => Function;
