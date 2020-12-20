import { factorizeType } from "./factories.js";

/**
 * ## IO
 *
 * The `IO` type represents a call to IO. Any Functional Programming purist would tell you that your functions has
 * to be pure... But in the real world, this is not very useful. Wrapping your call to IO with `IO` will enable you
 * to postpone the side-effect and keep your program (somewhat) pure.
 *
 * The `IO` type implements the following algebras:
 * - [x] Monad
 *
 * ### Example
 *
 * ```js
 * import IO from "https://deno.land/x/functional@v1.3.0/library/IO.js";
 *
 * const container = IO(_ => readFile(`${Deno.cwd()}/dump/hoge`))
 *   .map(promise => promise.then(text => text.split("\n")));
 * // File isn't being read yet. Still pure.
 *
 * assert(IO.is(containerA));
 *
 * const promise = container.run();
 * // Now, the file is being read.
 *
 * const lines = await promise;
 * ```
 */

export const IO = factorizeType("IO", [ "asyncFunction" ]);

IO.prototype.ap = IO.prototype["fantasy-land/ap"] = function (container) {

  //   return IO.is(container) ? IO(_ => container.asyncFunction(this.asyncFunction())) : container
  return container.map(unaryFunction => unaryFunction(this.asyncFunction()));
};

IO.prototype.chain = IO.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction())).run();
};

IO.prototype.map = IO.prototype["fantasy-land/map"] = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction()));
};

IO.prototype.run = function () {

  return this.asyncFunction();
};

IO.of = IO.prototype.of = IO.prototype["fantasy-land/of"] = value => IO(_ => value);

export default IO;
