import { $$type, $$value, $$valueList } from "./Symbols.js";

export interface BoxPrototype<X> {
  ap<Y>(C: BoxPrototype<(x: X) => Y>): BoxPrototype<Y>;
  chain<Y>(f: (x: X) => BoxPrototype<Y>): BoxPrototype<Y>;
  extend<Y>(f: (x: BoxPrototype<X>) => Y): BoxPrototype<Y>;
  extract(): X;
  map<Y>(f: (x: X) => Y): BoxPrototype<Y>;
  of<Y>(x: Y): BoxPrototype<Y>;
  toString(): string;
  [$$type]: "Box";
  [$$value]: X;
  [$$valueList]: unknown[];
}

declare function Box<X>(x: X): BoxPrototype<X>;
declare namespace Box {
  export function is<A>(C: A): boolean;
  export function of<X>(x: X):  BoxPrototype<X>;
}

export function factorizeBox<X>(x: X): BoxPrototype<X>;

export default Box;
