export interface EitherRightPrototype<Z> {
  alt<Y>(container: Y): this;
  ap<T extends EitherRightPrototype<K>, K>(container: T): this;
  chain<T extends EitherRightPrototype<K>, K>(unaryFunction: (value: Z) => T): this;
  extend<T extends EitherRightPrototype<Z>, K>(unaryFunction: (container: T) => K): this;
  extract(): Z;
  map<K>(unaryFunction: (value: Z) => K): this;
  of<T extends EitherRightPrototype<Z>>(value: Z): this;
  toString(): string;
  zero(): typeof Either.Left;
}

export interface EitherLeftPrototype<Z> {
  alt<T extends EitherRightPrototype<K>, K, Y>(container: Y): T;
  ap<T extends EitherRightPrototype<K>, K>(container: T): this;
  chain<T extends EitherRightPrototype<Y>, K, Y>(unaryFunction: (value: K) => T): this;
  extend<T extends EitherRightPrototype<Y>, K, Y>(unaryFunction: (container: T) => K): this;
  map<K, Y>(unaryFunction: (value: Y) => K): this;
  of<T extends EitherLeftPrototype<Z>>(value: Z): T;
  toString(): string;
  zero(): typeof Either.Left;
}

declare namespace Either {
  export function Right<T extends EitherRightPrototype<Z>, Z>(value: Z): T;
  export function Right<T extends EitherRightPrototype<Z>, Z, K>(unaryFunction: (value: K) => Z): T;
  export namespace Right {
    export function is<Z>(container: Z): boolean;
    export function of<T extends EitherRightPrototype<Z>, Z>(value: Z): T;
    export function of<T extends EitherRightPrototype<Z>, Z, K>(unaryFunction: (value: K) => Z): T;
  }
  export function Left<T extends EitherLeftPrototype<E>, E>(value: E): T;
  export function Left<T extends EitherLeftPrototype<E>, E, Z>(unaryFunction: (value: Z) => E): T;
  export namespace Left {
    export function is<Z>(container: Z): boolean;
    export function of<T extends EitherLeftPrototype<E>, E>(value: E): T;
    export function of<T extends EitherLeftPrototype<E>, E, Z>(unaryFunction: (value: Z) => E): T;
  }
  export function of<T extends EitherRightPrototype<Z>, Z>(value: Z): T;
  export function of<T extends EitherRightPrototype<Z>, Z, K>(unaryFunction: (value: K) => Z): T;
  export function zero(): typeof Left;
}

export default Either;