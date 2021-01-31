import { $$valueList } from "./Symbols.js";

interface Functor<X> {
  map<Y>(f: (x: X) => Y): Functor<Y>;
}


export function alt <X, Y extends X>(f: (a: X) => Y): (a: X) => X|Y;
export function ap <X, Y, A, B extends A>(f: (a: X) => Y): (C: A) => B;
export function bimap <A, B extends A, W, X, Y, Z>(f: (w: W) => X): (g: (y: Y) => Z) => (C: A) => B;
export function chain <A, B extends A, X>(f: (x: X) => B): (C: A) => B;
export function extend <X, Y, Z extends X>(f: (a: X) => Y): (a: X) => Z;
export function extract <A, X>(C: A): X;
export function map <X, A extends Functor<X>, B extends A, Y>(f: (x: X) => Y): (C: A) => B;
