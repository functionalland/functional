// @deno-types="./Maybe.d.ts"
import Maybe from "./Maybe.js";
import type { MaybePrototype } from "./Maybe.d.ts";
// @deno-types="./Either.d.ts"
import Either from "./Either.js";
import type { EitherRightPrototype } from "./Either.d.ts";
// @deno-types="./IO.d.ts"
import IO from "./IO.js";
// @deno-types="./Task.d.ts"
import Task from "./Task.js";
// @deno-types="./Pair.d.ts"
import Pair from "./Pair.js";

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

Deno.test(
  "IO type check",
  () => {
    const containerA = IO(() => 42);
    const containerB = IO(() => (value: number) => value + 2);
    const f = (value: number) => IO(() => value + 2);
    const g = (value: number) => value + 2;

    const containerC = containerA.ap(containerB);
    const containerD = containerC.chain(f);
    const containerE = containerD.map(g);
    IO.is(containerE);
    containerE.run();
  }
);

Deno.test(
  "Pair type check",
  () => {
    const containerA = Pair(42, 24);
    const f = (value: number) => value + 2;
    const g = (value: number) => value + 2;

    const containerB = containerA.map(f);
    const containerC = containerB.bimap(f, g);
    Pair.is(containerC);
  }
);

Deno.test(
  "Task type check",
  () => {
    const containerA = Task(() => Promise.resolve(42));
    const containerB = Task.wrap(() => Promise.resolve(42));
    const containerC = Task.of(42);
    const containerD = Task.of((value: number) => value + 2);
    const f = (value: number) => Task(() => value + 2);
    const g = (value: number) => value + 2;

    const containerE = containerA.ap(containerD);
    const containerF = containerE.chain(f)
    const containerG = containerF.map(g);
    const containerH = containerB.map(g);
    const containerI = containerC.map(g);
    Task.is(containerG);
    Task.is(containerH);
    Task.is(containerI);

    containerG.run();
    containerH.run();
    containerI.run();
  }
);
