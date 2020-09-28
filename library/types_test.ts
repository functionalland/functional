// @deno-types="./Maybe.d.ts"
import Maybe from "./Maybe.js";
import type { MaybePrototype } from "./Maybe.d.ts";
// @deno-types="./Either.d.ts"
import Either from "./Either.js";
import type { EitherRightPrototype } from "./Either.d.ts";

Deno.test(
  "Maybe type check",
  () => {
    const containerA = Maybe.Just(42);
    const containerB = Maybe.Just((value: number) => value + 2);
    const containerC = Maybe.just(42);
    const f = (value: number) => Maybe.Just(value + 2);
    const g = (container: MaybePrototype<number|Function>) => container.extract() as number + 2;
    const h = (value: number) => value + 2;

    const containerD = containerA.ap(containerB);
    const containerE = containerA.chain(f);
    const containerF = containerD.extend(g);
    containerE.extract();
    const containerG = containerF.map(h);
    const containerH = containerG.of(42);
    Maybe.Just.is(containerC);
    Maybe.Just.is(containerH);

    const containerI = Maybe.Nothing;
    const containerJ = Maybe.nothing();
    const containerK = containerI.ap(containerB);
    const containerL = containerK.chain(f);
    const containerM = containerL.extend(g);
    const containerN = containerM.map(h);
    Maybe.Nothing.is(containerI);
    Maybe.Nothing.is(containerJ);

    const containerO = containerN.alt(containerH);
    Maybe.Just(containerO);
  }
);

Deno.test(
  "Either type check",
  () => {
    const containerA = Either.Right(42);
    const containerB = Either.Right((value: number) => value + 2);
    const f = (value: number) => Either.Right(value + 2);
    const g = (container: EitherRightPrototype<number|Function>) => container.extract() as number + 2;
    const h = (value: number) => value + 2;

    const containerC = containerA.ap(containerB);
    const containerD = containerA.chain(f);
    const containerE = containerC.extend(g);
    containerD.extract();
    const containerF = containerE.map(h);
    const containerG = containerF.of(42);
    Either.Right.is(containerG);

    const containerH = Either.Left(new Error("This is an error"));
    const containerI = containerH.ap(containerB);
    const containerJ = containerI.chain(f);
    const containerK = containerJ.extend(g);
    const containerL = containerK.map(h);
    const containerM = containerL.of(new Error("This is an error"));
    Either.Left.is(containerM);

    const containerN = containerM.alt(containerG);
    Either.Right.is(containerN);
  }
);
