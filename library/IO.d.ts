export interface IOPrototype<F extends () => any> {
  ap<H extends () => any>(C: IOPrototype<() => (x: ReturnType<F>) => ReturnType<H>>): IOPrototype<H>;
  chain<H extends () => any>(f: (x: ReturnType<F>) => IOPrototype<H>): IOPrototype<H>;
  map<Y>(f: (x: ReturnType<F>) => Y): IOPrototype<() => Y>;
  of<X>(x: X): IOPrototype<() => X>;
  run(): ReturnType<F>;
  toString(): string;
}

export declare function IO<X>(f: () => X): IOPrototype<() => X>;
export declare namespace IO {
  export function is<A>(C: A): boolean;
  export function of<X>(x: X): IOPrototype<() => X>;
}

export function factorizeIO<F extends () => any>(f: F): IOPrototype<F>;

export default IO;