export interface PairPrototype<K, Z> {
  map<K, Y>(unaryFunction: (value: K) => Y): this;
  bimap<M, Y>(
    unaryFunctionA: (value: K) => M,
    unaryFunctionB: (value: Y) => Z,
  ): this;
  toString(): string;
}

declare function Pair<T extends PairPrototype<K, Z>, K, Z>(valueA: K, valueB: Z): T;
declare namespace Pair {
  export function is<T>(container: T): boolean;
}

export default Pair;