import { $$tag, $$type, $$value, $$valueList } from "./Symbols.js";

interface TypeContainer {
  [$$type]: string;
  [$$valueList]: unknown[];
}

interface SumTypeContainer {
  [$$tag]: string;
  [$$type]: string;
  [$$valueList]: unknown[];
}

interface Functor<X> extends TypeContainer {
  map<Y>(f: (x: X) => Y): Functor<Y>;
  [k: string]: any;
}

interface AlternativeFunctor<X> extends SumTypeContainer {
  alt<A extends AlternativeFunctor<any>>(C: A): AlternativeFunctor<unknown>;
  zero(): AlternativeFunctor<unknown>;
  [k: string]: any;
}

interface ApplicativeFunctor<X> extends TypeContainer {
  ap<Y>(C: ApplicativeFunctor<(x: X) => Y>): ApplicativeFunctor<Y>;
  of<Y>(x: Y): ApplicativeFunctor<Y>;
  [k: string]: any;
}

interface BiFunctor<W, X> extends TypeContainer {
  bimap<Y, Z>(
    unaryFunctionA: (value: W) => Y,
    unaryFunctionB: (value: X) => Z,
  ): BiFunctor<Y, Z>;
  [k: string]: any;
}

interface ChainableFunctor<X> extends Functor<X> {
  chain<Y>(f: (x: X) => ChainableFunctor<Y>): ChainableFunctor<Y>;
  [k: string]: any;
}

interface ExtendableFunctor<X> extends Functor<X> {
  extend<Y>(f: (x: ExtendableFunctor<X>) => Y): ExtendableFunctor<Y>;
  [$$value]: X;
  [k: string]: any;
}

interface ExtractableFunctor<X> extends Functor<X> {
  extract(): X;
  [k: string]: any;
}

export function alt <A extends AlternativeFunctor<any>>(C: A): <B extends AlternativeFunctor<any>>(M: B) => A & B;
export function alt <A extends AlternativeFunctor<any>, B extends AlternativeFunctor<any>>(C: A, M: B): A & B;
export function ap
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<(x: X) => Y>, C extends ApplicativeFunctor<Y>, X, Y>
  (C: B): (C: A) => C;
export function ap
  <A extends ApplicativeFunctor<X>, B extends ApplicativeFunctor<(x: X) => Y>, C extends ApplicativeFunctor<Y>, X, Y>
  (C: B, D: A): C;
export function bimap
  <A extends BiFunctor<W, X>, B extends BiFunctor<Y, Z>, W, X, Y, Z>
  (f: (w: W) => Y, g: (x: X) => Z): (C: A) => B;
export function bimap
  <A extends BiFunctor<W, X>, B extends BiFunctor<Y, Z>, W, X, Y, Z>
  (f: (w: W) => Y, g: (x: X) => Z, C: A): B;
export function chain <A extends ChainableFunctor<X>, B extends ChainableFunctor<Y>, X, Y>(f: (x: X) => B): (C: A) => B;
export function chain <A extends ChainableFunctor<X>, B extends ChainableFunctor<Y>, X, Y>(f: (x: X) => B, C: A): B;
export function extend
  <A extends ExtendableFunctor<X>, B extends ExtendableFunctor<Y>, X, Y>
  (f: (C: A) => Y): (C: A) => B;
export function extend
  <A extends ExtendableFunctor<X>, B extends ExtendableFunctor<Y>, X, Y>
  (f: (C: A) => Y, C: A): B;
export function extract <A extends ExtractableFunctor<X>, X>(C: A): X;
export function map <A extends Functor<X>, B extends Functor<Y>, X, Y>(f: (x: X) => Y): (C: A) => B;
export function map <A extends Functor<X>, B extends Functor<Y>, X, Y>(f: (x: X) => Y, C: A): B;
