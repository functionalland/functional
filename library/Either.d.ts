import { AlternativeFunctor } from "./algebraic.d.ts";
import { $$tag, $$type, $$value, $$valueList } from "./Symbols.js";

export interface EitherRightPrototype<X> {
  alt<A extends AlternativeFunctor<any>>(C: A): EitherRightPrototype<X>;
  ap<Y>(A: EitherRightPrototype<(x: X) => Y>): EitherRightPrototype<Y>;
  chain<Y>(f: (x: X) => EitherRightPrototype<Y>): EitherRightPrototype<Y>;
  extend<Y>(f: (x: EitherRightPrototype<X>) => Y): EitherRightPrototype<Y>;
  extract(): X;
  map<Y>(f: (x: X) => Y): EitherRightPrototype<Y>;
  of<Y>(value: Y): EitherRightPrototype<Y>;
  toString(): string;
  zero(): EitherLeftPrototype<null>;
  [$$tag]: "Right";
  [$$type]: "Either";
  [$$value]: X;
  [$$valueList]: unknown[];
}

export interface EitherLeftPrototype<X> {
  alt<A extends AlternativeFunctor<unknown>>(C: A): A;
  ap<Y>(A: EitherRightPrototype<(x: any) => Y>): EitherLeftPrototype<Y>;
  chain<Y>(f: (x: any) => EitherRightPrototype<Y>): EitherLeftPrototype<Y>;
  extend<Y>(f: (x: EitherRightPrototype<any>) => Y): EitherLeftPrototype<Y>;
  extract(): X;
  map<Y>(f: (x: any) => Y): EitherLeftPrototype<Y>;
  of<Y>(value: Y): EitherLeftPrototype<Y>;
  toString(): string;
  zero(): EitherLeftPrototype<null>;
  [$$tag]: "Left";
  [$$type]: "Either";
  [$$value]: X;
  [$$valueList]: unknown[];
}

export declare namespace Either {
  export function Right<X>(x: X): EitherRightPrototype<X>;
  export namespace Right {
    export function is<A>(C: A): boolean;
    export function of<X>(x: X): EitherRightPrototype<X>;
  }
  export function Left<X>(x: X): EitherLeftPrototype<X>;
  export namespace Left {
    export function is<A>(C: A): boolean;
    export function of<X>(x: X): EitherLeftPrototype<X>;
  }
  export function of<X>(x: X): EitherRightPrototype<X>;
  export function zero(): typeof Left;
}

export function factorizeEitherFromNullable <X>(x: X): EitherRightPrototype<X>|EitherLeftPrototype<X>;
export function factorizeEitherRight <X>(x: X): EitherRightPrototype<X>;
export function factorizeEitherLeft <X>(x: X): EitherLeftPrototype<X>;

export default Either;