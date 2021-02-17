import { ApplicativeFunctor } from "./algebraic.d.ts";

export function evert <A extends (...as: any[]) => ApplicativeFunctor<X[]>, B extends ApplicativeFunctor<X>, X>(C: A, xs: B[]):
  ReturnType<A>;
export function evert <A extends (...as: any[]) => ApplicativeFunctor<X[]>, B extends ApplicativeFunctor<X>, X>(C: A):
  (xs: B[]) => ReturnType<A>;