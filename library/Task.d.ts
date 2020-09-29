export interface TaskPrototype<Z> {
  ap<T extends TaskPrototype<Z>>(container: T): this;
  chain<T extends TaskPrototype<Z>, K>(unaryFunction: (value: K) => T): this;
  map<K, Y>(unaryFunction: (value: K) => Y): this;
  of<K>(value: K): this;
  run(): Promise<any>;
  toString(): string;
}

declare function Task<T extends TaskPrototype<Z>, Z>(asyncFunction: () => Z): T;
declare namespace Task {
  export function from<T extends TaskPrototype<Z>, Z>(unaryFunction: Z): T;
  export function is<Z>(container: Z): boolean;
  export function of<T extends TaskPrototype<Z>, Z, K>(value: K): T;
  export function wrap<T extends TaskPrototype<Z>, Z>(unaryFunction: Z): T;
}

export default Task;