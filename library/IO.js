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
 * import IO from "https://deno.land/x/functional@v1.3.2/library/IO.js";
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

/**
 * ### IO `.ap`
 * `IO (() -> a) ~> (IO a -> b) -> IO (() -> b)`
 *
 * This method takes a container of similar shape of a unary function and, applies it to its own value. The returned
 * container will be of the same type.
 *
 * ```js
 * const container = IO(_ => 42).ap(IO(x => x * 2));
 *
 * assertEquivalent(container.run(), IO(_ => 84).run());
 * ```
 */
IO.prototype.ap = IO.prototype["fantasy-land/ap"] = function (C) {

  //   return IO.is(container) ? IO(_ => container.asyncFunction(this.asyncFunction())) : container
  return C.map(f => f (this.asyncFunction()));
};

/**
 * ### IO `.chain`
 * `IO (() -> a) ~> (a -> IO (() -> b)) -> IO (() -> b)`
 *
 * This method takes a unary function that returns a container of similar shape.
 *
 * ```js
 * const container = IO(_ => 42).chain(x => IO(_ => x * 2));
 *
 * assertEquivalent(container.run(), IO(_ => 84).run());
 * ```
 */
IO.prototype.chain = IO.prototype["fantasy-land/chain"] = function (f) {

  return IO (_ => f (this.asyncFunction())).run();
};

/**
 * ### IO `.map`
 * `IO (() -> a) ~> (a -> b) -> IO (() -> b)`
 *
 * This method takes a unary function that returns a value. The returned container will be of the same type.
 *
 * ```js
 * const container = IO(_ => 42).map(x => x * 2);
 *
 * assertEquivalent(container.run(), IO(_ => 84).run());
 * ```
 */
IO.prototype.map = IO.prototype["fantasy-land/map"] = function (f) {

  return IO (_ => f (this.asyncFunction()));
};

/**
 * ### IO `.run`
 * `IO (() -> a) ~> () -> a`
 *
 * This method takes a value and, returns container of a unit function.
 *
 * ```js
 * const container = IO.of(42);
 *
 * assertEquals(container.run(), IO(_ => 42));
 * ```
 */
IO.prototype.run = function () {

  return this.asyncFunction();
};

/**
 * ### IO `.of`
 * `a -> IO (() -> a)`
 *
 * This method takes a value and, returns container of a unit function.
 *
 * ```js
 * const container = IO.of(42);
 *
 * assertEquals(container.run(), IO(_ => 42));
 * ```
 */
IO.of = IO.prototype.of = IO.prototype["fantasy-land/of"] = x => IO (_ => x);

export const factorizeIO = f => IO(f);

export default IO;
