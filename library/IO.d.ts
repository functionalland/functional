export interface IOPrototype<Z> {
  ap<T extends IOPrototype<K>, K>(container: T): this;
  chain<T extends IOPrototype<K>, K>(unaryFunction: (value: Z) => T): this;
  extend<T extends IOPrototype<Z>, K>(unaryFunction: (container: T) => K): this;
  extract(): Z;
  map<K>(unaryFunction: (value: Z) => K): this;
  of<T extends IOPrototype<Z>>(value: Z): this;
  toString(): string;
}

declare function IO<T extends IOPrototype<Z>, Z>(buffer: Uint8Array): T;
declare function IO<T extends IOPrototype<Z>, Z>(unaryFunction: (buffer: Uint8Array) => Uint8Array): T;
declare namespace IO {
  export function empty<T extends IOPrototype<Z>, Z>(): T;
  export function of<T extends IOPrototype<Z>, Z>(value: Z): T;
  export function of<T extends IOPrototype<Z>, Z, K>(unaryFunction: (value: K) => Z): T;
}

export default IO;