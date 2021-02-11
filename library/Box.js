import { factorizeType } from "./factories.js";

import { $$value } from "./Symbols.js";

/**
 * ## Box
 *
 * The `Box` is the most generic type.
 *
 * The `Box` type implements the following algebras:
 *   - [x] Comonad
 *   - [x] Monad
 *
 * ```js
 * import Box from "https://deno.land/x/functional@v1.3.4/library/Box.js";
 *
 * const container = Box(42).map(x => x + 2);
 *
 * assert(Box.is(container));
 * ```
 */
export const Box = factorizeType ("Box") ([ $$value ]);

/**
 * ### Box `.ap`
 * `Box a ~> (Box a -> b) -> Box b`
 *
 * This method takes a container of similar shape of a unary function and, applies it to its own value. The returned
 * container will be of the same type.
 * It is interoperable with `Maybe` and, `Either`.
 *
 * ```js
 * const container = Box(42).ap(Box(x => x * 2));
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Box.prototype.ap = Box.prototype["fantasy-land/ap"] = function (A) {

  return Box (A[$$value] (this[$$value]));
};

/**
 * ### Box `.chain`
 * `Box a ~> (a -> Box b) -> Box b`
 *
 * This method takes a unary function that returns a container of similar shape.
 * It is interoperable with `Maybe` and, `Either`.
 *
 * ```js
 * const container = Box(42).chain(x => Box(x * 2));
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Box.prototype.chain = Box.prototype["fantasy-land/chain"] = function (f) {

  return f (this[$$value]);
};

/**
 * ### Box `.extend`
 * `Box a ~> ((Box a) -> b) -> Box b`
 *
 * This method takes a unary function that accepts a container of similar shape and return a value. The returned
 * container will be of the same type.
 * It is interoperable with `Maybe` and, `Either`.
 *
 * ```js
 * const container = Box(42).extend(x => x[$$value] * 2);
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Box.prototype.extend = Box.prototype["fantasy-land/extend"] = function (f) {

  return Box (f (this));
};

/**
 * ### Box `.extract`
 * `Box a ~> () -> a`
 *
 * This method takes no argument and, return its own value.
 *
 * ```js
 * const value = Box(42).extract();
 *
 * assertEquals(value, 42);
 * ```
 */
Box.prototype.extract = Box.prototype["fantasy-land/extract"] = function () {

  return this[$$value];
};

/**
 * ### Box `.map`
 * `Box a ~> (a -> b) -> Box b`
 *
 * This method takes a unary function that returns a value. The returned container will be of the same type.
 * It is interoperable with `Maybe` and, `Either`.
 *
 * ```js
 * const container = Box(42).map(x => x * 2);
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Box.prototype.map = Box.prototype["fantasy-land/map"] = function (f) {

  return Box (f (this[$$value]));
};

/**
 * ### Box `.of`
 * `a -> Box a`
 *
 * This method takes a value and, returns a container.
 *
 * ```js
 * const container = Box.of(42);
 *
 * assertEquals(container, Box(42));
 * ```
 */
Box.of = Box.prototype.of = Box.prototype["fantasy-land/of"] = function (x) {

  return Box (x);
};

/**
 * ### `factorizeBox`
 * `a -> Box a`
 *
 * This method takes a value and, returns a container.
 *
 * ```js
 * const container = factorizeBox(42);
 *
 * assertEquals(container, Box(42));
 * ```
 */
export const factorizeBox = Box.of;

export default Box;
