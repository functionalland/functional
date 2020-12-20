import { factorizeType } from "./factories.js";
import Either from "./Either.js";
import Pair from "./Pair.js";
import { Done, Loop } from "./Step.js";

import { $$debug, $$inspect } from "./Symbols.js";
import { chainLift } from "./utilities.js";

const concat = x => y => x.concat(y);

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
 * import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";
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

const serializeFunctionForDebug = asyncFunction =>
  (asyncFunction.name && asyncFunction.name !== "")
    ? asyncFunction.name
    : asyncFunction.toString().length > 25
      ? asyncFunction.toString()
        .slice(0, 25)
        .replace(/[\n\r]/g, "")
        .replace(/\s\s*/g, " ") + "[...]"
      : asyncFunction.toString()
        .replace(/[\n\r]/g, "")
        .replace(/\s\s*/g, " ")

Task.wrap = asyncFunction => {
  let promise;
  const proxyFunction = function (...argumentList) {
    promise = promise || asyncFunction.call(null, ...argumentList);

    return promise.then(
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
  };

  return Object.defineProperty(
    Task(
      Object.defineProperty(
        proxyFunction,
        'length',
        { value: asyncFunction.length }
      )
    ),
    $$debug,
    {
      writable: false,
      value: `Task(${serializeFunctionForDebug(asyncFunction)})`
    }
  );
};

Task.prototype.ap = Task.prototype["fantasy-land/ap"] = function (container) {

  return Object.defineProperty(
    Task(_ => {
      const maybePromiseValue = this.asyncFunction();
      const maybePromiseUnaryFunction = container.asyncFunction();

      return Promise.all([
        (maybePromiseUnaryFunction instanceof Promise)
          ? maybePromiseUnaryFunction
          : Promise.resolve(maybePromiseUnaryFunction),
        (maybePromiseValue instanceof Promise)
          ? maybePromiseValue
          : Promise.resolve(maybePromiseValue)
      ])
        .then(([ maybeApplicativeUnaryFunction, maybeContainerValue ]) => {

          return (
            (Reflect.getPrototypeOf(maybeContainerValue).ap)
              ? maybeContainerValue
              : Either.Right(maybeContainerValue)
          ).ap(
            (Reflect.getPrototypeOf(maybeApplicativeUnaryFunction).ap)
              ? maybeApplicativeUnaryFunction
              : Either.Right(maybeApplicativeUnaryFunction)
          );
        });
    }),
    $$debug,
    {
      writable: false,
      value: `${this[$$debug]}.ap(${container})`
    }
  );
};

Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return Object.defineProperty(
    Task(_ => {
      const maybePromise = this.asyncFunction();

      return (
        (maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise)
      )
        .then(maybeContainer =>
          (Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer))
            .chain(
              value => {
                const maybePromise = unaryFunction(value).run();

                return (
                  (maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise)
                )
                  .then(
                    maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
                    maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer),
                  )
              }),
          Either.Left
        );
    }),
    $$debug,
    {
      writable: false,
      value: `${this[$$debug]}.chain(${serializeFunctionForDebug(unaryFunction)})`
    }
  );
};

Task.prototype.chainRec = Task.prototype["fantasy-land/chainRec"] = function (ternaryFunction, initialCursor) {
  let accumulator = this;
  let result = Loop(Pair(initialCursor, null));

  while (!Done.is(result)) {
    result = ternaryFunction(Loop, Done, result.value.first);

    if (Loop.is(result)) {
      accumulator = chainLift(concat, accumulator, result.value.second);
    }
  }

  return accumulator;
};

Task.prototype.map = Task.prototype["fantasy-land/map"] = function (unaryFunction) {

  return Object.defineProperty(
    Task(_ => {
      const promise = this.asyncFunction();

      return promise.then(
        container => container.chain(
          value => {
            const maybeContainer = unaryFunction(value);

            return (Either.is(maybeContainer)) ? maybeContainer : Either.Right(maybeContainer);
          }
        ),
        Either.Left
      );
    }),
    $$debug,
    {
      writable: false,
      value: `${this[$$debug]}.map(${serializeFunctionForDebug(unaryFunction)})`
    }
  );
};

Task.of = Task.prototype.of = Task.prototype["fantasy-land/of"] = value =>
  Object.defineProperty(
    Task(_ => Promise.resolve(Either.Right(value))),
    $$debug,
    {
      writable: false,
      value: `Task(${serializeFunctionForDebug(value)})`
    }
  );

Task.prototype.run = async function () {
  const maybePromise = this.asyncFunction();

  return ((maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise))
    .then(
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
};

Task.prototype.toString = Task.prototype[$$inspect] = function () {

  return this[$$debug] || `Task("unknown")`
};

export default Task;
