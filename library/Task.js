import { factorizeType } from "./factories.js";
import Either from "./Either.js";
import Pair from "./Pair.js";
import { Done, Loop } from "./Step.js";

import { $$debug, $$inspect, $$value } from "./Symbols.js";
import { chain, chainLift, concat, then } from "./algebraic.js";
import { apply2Compose, compose2, compose3, flip } from "./aviary.js";
import { curry2, curry3 } from "./curry.js";
import {composeBinary} from "./aviary.js";
import {applyBinary} from "./aviary.js";
import {apply} from "./aviary.js";

const defineProperty = curry3((x, k, o) => Object.defineProperty(o, k, x));
const defineDebug = curry2((x, t) => Object.defineProperty(t, $$debug, { writable: false, value: x }))

/**
 * ## Task
 *
 * The `Task` type is similar in concept to `IO`; it helps keep your function pure when you are working with `IO`.
 * The biggest difference with `IO` is that this type considers Promise as first-class citizen. Also, it always resolves
 * to an instance of `Either`; `Either.Right` for a success, `Either.Left` for a failure.
 *
 * The `IO` type implements the following algebras:
 * - [x] Monad
 *
 * ### Example
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
 *
 * const containerA = Task(_ => readFile(`${Deno.cwd()}/dump/hoge`))
 *   .map(text => text.split("\n"));
 * // File isn't being read yet. Still pure.
 *
 * assert(Task.is(containerA));
 *
 * const containerB = await container.run();
 * // Now, the file is being read.
 *
 * assert(Either.Right.is(containerB));
 * // The call was successful!
 *
 * const lines = containerB.extract();
 * ```
 *
 * The `Task` factory comes with a special utility method called `wrap`. The result of any function called with `wrap`
 * will be memoized allowing for safe "logic-forks".
 *
 * Take the following example; `containerD` contains the raw text, `containerE` contains the text into lines and
 * `containerF` contains the lines in inverted order. Because `run` was called thrice, the file was read thrice. 😐
 *
 * ```js
 * let count = 0;
 * const containerA = Task(_ => ++count && readFile(`${Deno.cwd()}/dump/hoge`));
 * const containerB = containerA.map(text => text.split("\n"));
 * const containerC = containerB.map(lines => text.reverse());
 *
 * assert(Task.is(containerA));
 * assert(Task.is(containerB));
 * assert(Task.is(containerC));
 *
 * const containerD = await containerA.run();
 * const containerE = await containerB.run();
 * const containerF = await containerC.run();
 *
 * assert(count === 3);
 * ```
 *
 * Definitely not what we want... Simply wrap the function and bim bam boom - memoization magic! (The file will only be
 * read once) 🤩
 *
 * Please check-out [Functional IO](https://github.com/sebastienfilion/functional-deno-io) for more practical examples.
 */
export const Task = factorizeType("Task", [ "asyncFunction" ]);

const serializeFunctionForDebug = f =>
  (f.name && f.name !== "")
    ? f.name
    : f.toString().length > 25
      ? f.toString()
        .slice(0, 25)
        .replace(/[\n\r]/g, "")
        .replace(/\s\s*/g, " ") + "[...]"
      : f.toString()
        .replace(/[\n\r]/g, "")
        .replace(/\s\s*/g, " ")

Task.wrap = f => {
  let $p;
  const proxyFunction = (...xs) => {
    $p = $p || f.call(null, ...xs);

    return $p.then(
      A => Either.is(A) ? A : Either.Right(A),
      A => Either.is(A) ? A : Either.Left(A)
    );
  };

  return defineDebug
    (`Task(${serializeFunctionForDebug(f)})`)
    (Task (
      Object.defineProperty(
        proxyFunction,
        'length',
        { value: f.length }
      )
    ));
};

Task.prototype.ap = Task.prototype["fantasy-land/ap"] = function (A) {

  return defineDebug
    (`${this[$$debug]}.ap(${A})`)
    (Task (_ =>
      composeBinary
        (then
          (([ x, y ]) =>
            applyBinary
              (A => B => B.ap(A))
              ((Reflect.getPrototypeOf(x).ap) ? x : Either.Right(x))
              ((Reflect.getPrototypeOf(y).ap) ? y : Either.Right(y))))
        ($p => $q => Promise.all([
          ($q instanceof Promise) ? $q : Promise.resolve($q),
          ($p instanceof Promise) ? $p : Promise.resolve($p)
        ]))
        (this.asyncFunction())
        (A.asyncFunction())));
};

Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function (f) {

  return defineDebug
    (`${this[$$debug]}.chain(${serializeFunctionForDebug(f)})`)
    (Task (_ =>
      compose2
        (then
          (compose2
            (chain
              (compose3
                (then
                  (A => Either.is(A) ? A : Either.Right(A))
                  (A => Either.is(A) ? A : Either.Left(A)))
                ($q => ($q instanceof Promise) ? $q : Promise.resolve($q))
                (x => f(x).run())))
            (A => (Either.is(A) ? A : Either.Right(A)))))
        ($p => ($p instanceof Promise) ? $p : Promise.resolve($p))
        (this.asyncFunction())));
};

Task.prototype.chainRec = Task.prototype["fantasy-land/chainRec"] = function (ternaryFunction, i) {
  let A = this;
  let r = Loop(Pair(i, null));

  while (!Done.is(r)) {
    r = ternaryFunction(Loop, Done, r.value.first);

    if (Loop.is(r)) {
      A = chainLift(flip(concat), A, r.value.second);
    }
  }

  return A;
};

Task.prototype.map = Task.prototype["fantasy-land/map"] = Task.prototype.then = function (f) {

  return defineDebug
    (`${this[$$debug]}.map(${serializeFunctionForDebug(f)})`)
    (Task(_ =>
      apply
        (then
          (chain (compose2 (A => (Either.is(A)) ? A : Either.Right(A)) (f)))
          (Either.Left))
        (this.asyncFunction())));
};

Task.prototype.catch = function (f) {

  return defineDebug
    (`${this[$$debug]}.map(${serializeFunctionForDebug(f)})`)
    (Task (_ =>
      apply
        (then
          (A => Either.Left.is(A) ? Either.Right(f (A[$$value])) : A)
          (Either.Left))
        (this.asyncFunction())));
};

Task.of = Task.prototype.of = Task.prototype["fantasy-land/of"] = x =>
  defineDebug (`Task(${serializeFunctionForDebug (x)})`) (Task (_ => Promise.resolve(Either.Right(x))))

Task.prototype.run = async function () {

  return compose2
    (then
      (A => Either.is(A) ? A : Either.Right(A))
      (A => Either.is(A) ? A : Either.Left(A)))
    ($p => ($p instanceof Promise) ? $p : Promise.resolve($p))
    (this.asyncFunction());
};

Task.prototype.toString = Task.prototype[$$inspect] = function () {

  return this[$$debug] || `Task("unknown")`
};

export const factorizeTask = x => Task.of(x);

export default Task;
