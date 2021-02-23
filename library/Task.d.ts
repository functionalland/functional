import { EitherRightPrototype, EitherLeftPrototype } from "./Either.d.ts";
import { $$type, $$value, $$valueList } from "./Symbols.js";

type extractPromise<T> = T extends Promise<infer X> ? X : never|T;
type extractEither<T> = T extends EitherRightPrototype<infer X> ? X : never|T;

export interface TaskPrototype<F extends () => any> {
  ap<H extends () => any>
  (C: TaskPrototype<() => Promise<EitherRightPrototype<(x: extractEither<extractPromise<ReturnType<F>>>) => ReturnType<H>>>>):
    TaskPrototype<() => Promise<EitherRightPrototype<extractEither<extractPromise<ReturnType<H>>>>>>;
  chain<H extends () => any>(f: (x: extractEither<extractPromise<ReturnType<F>>>) => TaskPrototype<H>):
    TaskPrototype<H>;
  map<Y>(f: (x: extractEither<extractPromise<ReturnType<F>>>) => Y):
    TaskPrototype<() => Promise<EitherRightPrototype<Y>>>;
  of<X>(value: X): TaskPrototype<() => Promise<EitherRightPrototype<X>>>;
  run(): Promise<EitherRightPrototype<ReturnType<F>>|EitherLeftPrototype<ReturnType<F>>>;
  toString(): string;
  [$$type]: "Task";
  [$$valueList]: unknown[];
}

declare function Task<X>(f: () => Promise<X>|X): TaskPrototype<() => Promise<X>|X>;
declare namespace Task {
  export function is<A>(C: A): boolean;
  export function of<X>(x: X): TaskPrototype<() => Promise<EitherRightPrototype<X>>>;
  export function wrap<F extends () => any>(f: F): TaskPrototype<F>;
}

export function factorizeTask<X>(x: X): TaskPrototype<() => Promise<EitherRightPrototype<X>>>;

export default Task;
