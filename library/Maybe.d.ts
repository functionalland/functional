import { AlternativeFunctor } from "./algebraic.d.ts";
import { $$tag, $$type, $$value, $$valueList } from "./Symbols.js";

export interface MaybePrototype<X> {
  alt<A extends AlternativeFunctor<any>>(C: A): MaybePrototype<X>;
  ap<Y>(A: MaybePrototype<(x: X) => Y>): MaybePrototype<Y>;
  chain<Y>(f: (x: X) => MaybePrototype<Y>): MaybePrototype<Y>;
  extend<Y>(f: (x: MaybePrototype<X>) => Y): MaybePrototype<Y>;
  extract(): X;
  map<Y>(f: (x: X) => Y): MaybePrototype<Y>;
  of<Y>(value: Y): MaybePrototype<Y>;
  toString(): string;
  zero(): typeof Maybe.Nothing;
  [$$tag]: "Just";
  [$$type]: "Maybe";
  [$$value]: X;
  [$$valueList]: unknown[];
}

declare namespace Maybe {
  export function Just<X>(x: X): MaybePrototype<X>;
  export namespace Just {
    export function is<A>(C: A): boolean;
    export function of<X>(x: X): MaybePrototype<X>;
  }
  export namespace Nothing {
    export function is<A>(C: A): boolean;
    export function alt<A extends MaybePrototype<any>>(C: A): MaybePrototype<any>;
    export function ap<Y>(A: MaybePrototype<(x: any) => Y>): typeof Nothing;
    export function chain<Y>(f: (x: any) => MaybePrototype<Y>): typeof Nothing;
    export function extend<Y>(f: (x: MaybePrototype<any>) => Y): typeof Nothing;
    export function map<Y>(f: (x: any) => Y): typeof Nothing;
    export function toString(): string;
  }
  export function of<X>(x: X): MaybePrototype<X>;
  export function zero(): typeof Nothing;
}

export function factorizeMaybeFromNullable <X>(x: X): MaybePrototype<X>|typeof Maybe.Nothing;
export function factorizeMaybeJust <X>(x: X): MaybePrototype<X>;
export function factorizeMaybeNothing (): typeof Maybe.Nothing;

export default Maybe;