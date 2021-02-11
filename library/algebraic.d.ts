import { $$value } from "./Symbols.js";

interface AlternativeFunctor<X> {
  alt<A>(C: A): AlternativeFunctor<X>|A;
  zero(): AlternativeFunctor<any>;
}

interface ApplicativeFunctor<X> {
  ap<Y>(C: ApplicativeFunctor<(x: X) => Y>): ApplicativeFunctor<Y>;
  of<Y>(x: Y): ApplicativeFunctor<Y>;
}

interface BiFunctor<W, X> {
  bimap<Y, Z>(
    unaryFunctionA: (value: W) => Y,
    unaryFunctionB: (value: X) => Z,
  ): BiFunctor<Y, Z>;
}

interface ChainableFunctor<X> {
  chain<Y>(f: (x: X) => ChainableFunctor<Y>): ChainableFunctor<Y>;
}

interface Functor<X> {
  map<Y>(f: (x: X) => Y): Functor<Y>;
}

interface ExtendableFunctor<X> {
  extend<Y>(f: (x: ExtendableFunctor<X>) => Y): ExtendableFunctor<Y>;
  [$$value]: X;
}

interface ExtractableFunctor<X> {
  extract(): X;
}

export function alt <A extends AlternativeFunctor<any>, B extends AlternativeFunctor<any>>(C: A): (M: B) => A|B;
export function ap
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<(x: X) => Y>, C extends ApplicativeFunctor<Y>, X, Y>
  (C: B): (C: A) => C;
export function bimap
  <A extends BiFunctor<W, X>, B extends BiFunctor<Y, Z>, W, X, Y, Z>
  (f: (w: W) => Y, g: (x: X) => Z): (C: A) => B;
export function chain <A extends ChainableFunctor<X>, B extends ChainableFunctor<any>, X>(f: (x: X) => B): (C: A) => B;
export function extend
  <A extends ExtendableFunctor<X>, B extends ExtendableFunctor<Y>, X, Y>
  (f: (C: A) => Y): (C: A) => B;
export function extract <A extends ExtractableFunctor<X>, X>(C: A): X;
export function map <A extends Functor<X>, B extends Functor<Y>, X, Y>(f: (x: X) => Y): (C: A) => B;
