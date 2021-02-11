import { ApplicativeFunctor } from "./algebraic.d.ts";

export function find <X>(f: (x: X) => boolean): (xs: Array<X>) => X;
export function find <X>(f: (x: X) => boolean, xs: Array<X>): X;

export function lift2
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<Y>, X, Y, Z>
  (f: (w: X) => (x: X) => (y: Y) => Z): (C1: A) => (C2: B) => Z;
export function lift2
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<Y>, X, Y, Z>
  (f: (w: X) => (x: X) => (y: Y) => Z, C1: A): (C2: B) => Z;
export function lift2
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<Y>, X, Y, Z>
  (f: (w: X) => (x: X) => (y: Y) => Z, C1: A, C2: B): Z;
export function lift2 (f: Function, x?: any, y?: any): any;

export function lift3
  <A extends ApplicativeFunctor<W>, B extends ApplicativeFunctor<X>, C extends ApplicativeFunctor<Y>, W, X, Y, Z>
  (f: (w: W) => (x: X) => (y: Y) => Z): (C1: A) => (C2: B) => (C3: C) => Z;
export function lift3
  <A extends ApplicativeFunctor<W>, B extends ApplicativeFunctor<X>, C extends ApplicativeFunctor<Y>, W, X, Y, Z>
  (f: (w: W) => (x: X) => (y: Y) => Z, C1: A): (C2: B) => (C3: C) => Z;
export function lift3
  <A extends ApplicativeFunctor<W>, B extends ApplicativeFunctor<X>, C extends ApplicativeFunctor<Y>, W, X, Y, Z>
  (f: (w: W) => (x: X) => (y: Y) => Z, C1: A, C2: B): (C3: C) => Z;
export function lift3
  <A extends ApplicativeFunctor<W>, B extends ApplicativeFunctor<X>, C extends ApplicativeFunctor<Y>, W, X, Y, Z>
  (f: (w: W) => (x: X) => (y: Y) => Z, C1: A, C2: B, C3: C): Z;
export function lift3 (f: Function, x?: any, y?: any, z?: any): any;

export function zipWith <X, Y, Z>(f: (x: X) => (y: Y) => Array<Z>): (xs: Array<X>) => (ys: Array<Y>) => Array<Z>;
export function zipWith <X, Y, Z>(f: (x: X) => (y: Y) => Array<Z>, xs: Array<X>): (ys: Array<Y>) => Array<Z>;
export function zipWith <X, Y, Z>(f: (x: X) => (y: Y) => Array<Z>, xs: Array<X>, ys: Array<Y>): Array<Z>;
export function zipWith <X, Y, Z>(f: Function, xs: Array<X>, ys: Array<Y>): Array<Z>;
