export interface IOPrototype<Z> {
  ap<T extends IOPrototype<Z>>(container: T): this;
  chain<T extends IOPrototype<Z>, K>(unaryFunction: (value: K) => T): this;
  map<K, Y>(unaryFunction: (value: K) => Y): this;
  of<K>(value: K): this;
  run<K>(): K;
  toString(): string;
}

declare function IO<T extends IOPrototype<Z>, Z>(asyncFunction: () => Z): T;
declare namespace IO {
  export function is<Z>(container: Z): boolean;
  export function of<T extends IOPrototype<Z>, Z, K>(value: K): T;
}

export default IO;