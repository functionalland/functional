export interface MaybePrototype<Z> {
  alt<T extends MaybePrototype<Z>>(container: T): this;
  ap<T extends MaybePrototype<K>, K>(container: T): this;
  chain<T extends MaybePrototype<K>, K>(unaryFunction: (value: Z) => T): this;
  extend<T extends MaybePrototype<Z>, K>(unaryFunction: (container: T) => K): this;
  extract(): Z;
  map<K>(unaryFunction: (value: Z) => K): this;
  of<T extends MaybePrototype<Z>>(value: Z): this;
  toString(): string;
  zero(): typeof Maybe.Nothing;
}

declare namespace Maybe {
  export function Just<T extends MaybePrototype<Z>, Z>(value: Z): T;
  export function Just<T extends MaybePrototype<Z>, Z, K>(unaryFunction: (value: K) => Z): T;
  export namespace Just {
    export function is<Z>(container: Z): boolean;
  }
  export namespace Nothing {
    export function is<Z>(container: Z): boolean;
    export function alt<T extends MaybePrototype<Z>, Z>(container: T): T;
    export function ap<T extends MaybePrototype<Z>, Z>(container: T): typeof Nothing;
    export function chain<T extends MaybePrototype<Z>, Z, K>(
      unaryFunction: (value: K) => T
    ): typeof Nothing;
    export function extend<T extends MaybePrototype<Z>, Z, K>(
      unaryFunction: (container: T) => K
    ): typeof Nothing;
    export function map<Z, K>(unaryFunction: (value: Z) => K): typeof Nothing;
  }
  export function fromNullable<T extends MaybePrototype<Z>, Z>(value: Z): T;
  export function just<T extends MaybePrototype<Z>, Z>(value: Z): T;
  export function nothing<T extends MaybePrototype<Z>, Z = any>(): T;
  export function of<T extends MaybePrototype<Z>, Z>(value: Z): T;
  export function of<T extends MaybePrototype<Z>, Z>(unaryFunction: (value: Z) => Z): T;
  export function zero(): typeof Nothing;
}

export default Maybe;