import { $$value } from "./Symbols.js";

export interface BoxPrototype<X> {
  ap<Y>(A: BoxPrototype<(x: X) => Y>): BoxPrototype<Y>;
  chain<A extends BoxPrototype<Y>, Y>(f: (x: X) => A): A;
  extend<Y>(f: (x: BoxPrototype<X>) => Y): BoxPrototype<Y>;
  extract(): X;
  map<Y>(f: (x: X) => Y): BoxPrototype<Y>;
  of<Y>(x: Y): BoxPrototype<Y>;
  toString(): string;
  [$$value]: X;
}

declare function Box<X>(x: X): BoxPrototype<X>;
declare namespace Box {
  export function is<A>(container: A): boolean;
  export function of<A extends BoxPrototype<X>, X>(value: X): A;
}

export function factorizeBox <X>(x: X): BoxPrototype<X>;

export default Box;
