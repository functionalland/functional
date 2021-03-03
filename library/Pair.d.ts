import { $$type, $$valueList } from "./Symbols.js";

export interface PairPrototype<W, X> {
  map<Y>(f: (x: W) => Y): PairPrototype<Y, null>;
  bimap<Y, Z>(
    f: (x: W) => Y,
    h: (x: X) => Z
  ): PairPrototype<Y, Z>;
  toString(): string;
  [$$type]: "Pair";
  [$$valueList]: unknown[];
}

export declare function Pair<A extends PairPrototype<W, X>, W, X>(w: W, x: X): A;
export declare namespace Pair {
  export function is<A>(C: A): boolean;
}

export default Pair;