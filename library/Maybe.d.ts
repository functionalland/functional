import { $$value } from "./Symbols.js";
import Nothing = Maybe.Nothing;
import Nothing = Maybe.Nothing;
import Nothing = Maybe.Nothing;
import Nothing = Maybe.Nothing;

export interface MaybePrototype<X> {
  alt<A>(C: A): this;
  ap<Y>(A: MaybePrototype<(x: X) => Y>): MaybePrototype<Y>;
  chain<Y>(f: (x: X) => MaybePrototype<Y>): MaybePrototype<Y>;
  extend<Y>(f: (x: MaybePrototype<X>) => Y): MaybePrototype<Y>;
  extract(): X;
  map<Y>(f: (x: X) => Y): MaybePrototype<Y>;
  of<Y>(value: Y): MaybePrototype<Y>;
  toString(): string;
  zero(): typeof Maybe.Nothing;
  [$$value]: X;
}

declare namespace Maybe {
  export function Just<X>(x: X): MaybePrototype<X>;
  export namespace Just {
    export function is<A>(C: A): boolean;
    export function of<X>(x: X): MaybePrototype<X>;
  }
  export namespace Nothing {
    export function is<A>(C: A): boolean;
    export function alt<A>(C: A): A;
    export function ap<Y>(A: MaybePrototype<(x: any) => Y>): typeof Nothing;
    export function chain<Y>(f: (x: any) => MaybePrototype<Y>): typeof Nothing;
    export function extend<Y>(f: (x: MaybePrototype<any>) => Y): typeof Nothing;
    export function map<Y>(f: (x: any) => Y): typeof Nothing;
  }
  export function of<X>(x: X): MaybePrototype<X>;
  export function zero(): typeof Nothing;
}

export function factorizeMaybeFromNullable <X>(x: X): MaybePrototype<X>|Nothing;
export function factorizeMaybeJust <X>(x: X): MaybePrototype<X>;
export function factorizeMaybeNothing (): Nothing;

export default Maybe;