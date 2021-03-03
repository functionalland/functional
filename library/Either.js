import { $$value } from "./Symbols.js";
import { assertIsNull, assertIsObject, assertIsUndefined } from "./assertions.js";
import { identity } from "./aviary.js";
import { factorizeSumType } from "./factories.js";

/**
 * ## Either
 *
 * The `Either` is a sum type similar to `Maybe`, but it differs in that a value can be of two possible types
 * (Left or Right). Commonly the Left type represents an error.
 *
 * The `Either` type implements the following algebras:
 * - [x] Alternative
 * - [x] Comonad
 * - [x] Monad
 *
 * ### Example
 *
 * ```ts
 * import { Either } from "https://deno.land/x/functional@v1.3.4/mod.ts";
 *
 * const containerA = Either.Right(42).map((x: number) => x + 2);
 * const containerB = Either.Left(new Error("The value is not 42.")).map((x: number) => x + 2);
 * const containerC = containerB.alt(containerA);
 *
 * assert(Either.Right.is(containerA));
 * assert(Either.Left.is(containerB));
 * assert(Either.Right.is(containerC));
 * ```
 */

export const Either = factorizeSumType(
  "Either",
  {
    Left: [ $$value ],
    Right: [ $$value ]
  }
);

/**
 * ### Either `.alt`
 * `Either.Right a ~> Either.Right b -> Either.Right a`
 * `Either.Left a ~> Either.Right b -> Either.Right b`
 *
 * This method takes a container of similar shape that will be returned if the context is of type `Either.Left`.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const containerA = Either.Right(24).alt(Either.Right(42));
 * const containerB = Either.Left("not 42").alt(Either.Right(42));
 *
 * assertEquivalent(containerA, Either.Right(24));
 * assertEquivalent(containerB, Either.Right(42));
 * ```
 */
Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function (A) {

  return this.fold({
    Left: _ => A,
    Right: _ => this
  });
};

/**
 * ### Either `.ap`
 * `Either.Right a ~> (Either.Right a -> b) -> Either.Right b`
 * `Either.Left a ~> (Either.Right a -> b) -> Either.Left a`
 *
 * This method takes a container of similar shape of a unary function and, applies it to its own value. The returned
 * container will be of the same type.
 * If the container is of type `Either.Left`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Either.Right(42).ap(Either.Right((x: number) => x * 2));
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function (A) {

  return this.fold({
    Left: _ => this,
    Right: x => Either.Right.is(A) ? Either.Right(A[$$value] (x)) : A
  });
};

/**
 * ### Either `.chain`
 * `Either.Right a ~> (a -> Either.Right b) -> Either.Right b`
 * `Either.Left a ~> (a -> Either.Right b) -> Either.Left a`
 *
 * This method takes a unary function that returns a container of similar shape.
 * If the container is of type `Either.Left`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Either.Right(42).chain((x: number) => Either.Right(x * 2));
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function (f) {

  return this.fold({
    Left: _ => this,
    Right: x => f (x)
  });
};

/**
 * ### Either `.extend`
 * `Either.Right a ~> ((Either.Right a) -> b) -> Either.Right b`
 * `Either.Left a ~> ((Either.Right a) -> b) -> Either.Left a`
 *
 * This method takes a unary function that accepts a container of similar shape and return a value. The returned
 * container will be of the same type.
 * If the container is of type `Either.Left`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Either.Right(42).extend((x: number) => x[$$value] * 2);
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Either.prototype.extend = Either.prototype["fantasy-land/extend"] = function (f) {

  return this.fold({
    Left: _ => this,
    Right: _ => Either.of(f (this))
  });
};

/**
 * ### Either `.extract`
 * `Either.Right a ~> () -> a`
 *
 * This method takes no argument and, return its own value.
 *
 * ```ts
 * const value = Either.Right(42).extract();
 *
 * assertEquals(value, 42);
 * ```
 */
Either.prototype.extract = Either.prototype["fantasy-land/extract"] = function () {

  return this.fold({
    Left: identity,
    Right: identity
  });
};

/**
 * ### Either `.map`
 * `Either.Right a ~> (a -> b) -> Either.Right b`
 * `Either.Left a ~> (a -> b) -> Either.Left a`
 *
 * This method takes a unary function that returns a value. The returned container will be of the same type.
 * If the container is of type `Either.Left`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Either.Right(42).map((x: number) => x * 2);
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
Either.prototype.map = Either.prototype["fantasy-land/map"] = function (f) {

  return this.fold({
    Left: _ => this,
    Right: x => Either.Right(f (x))
  });
};

/**
 * ### Either `.of`
 * `a -> Either.Right a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = Either.of(42);
 *
 * assertEquals(container, Either.Right(42));
 * ```
 */
Either.of = Either.prototype.of = Either.prototype["fantasy-land/of"] = x => Either.Right(x);

/**
 * ### Either `.zero`
 * `() -> Either.Left null`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = Either.zero();
 *
 * assertEquals(container, Either.Left(null));
 * ```
 */
Either.zero = Either.prototype.zero = Either.prototype["fantasy-land/zero"] = () => Either.Left(null);

/**
 * ### `factorizeEitherFromNullable`
 * `a -> Either a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const containerA = factorizeEitherFromNullable(42);
 * const containerB = factorizeEitherFromNullable(null);
 *
 * assertEquals(containerA, Either.Right(42));
 * assertEquals(containerB, Either.Left(null));
 * ```
 */
export const factorizeEitherFromNullable = x =>
  assertIsNull (x) || assertIsUndefined (x) || !x && assertIsObject (x)
    ? Either.Left(x)
    : Either.Right(x);

/**
 * ### `factorizeEitherRight`
 * `a -> Either.Right a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = factorizeEitherRight(42);
 *
 * assertEquals(container, Either.Right(42));
 * ```
 */
export const factorizeEitherRight = x => Either.Right(x);

/**
 * ### `factorizeEitherLeft`
 * `a -> Either.Left a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = factorizeEitherLeft(42);
 *
 * assertEquals(container, Either.Left(42));
 * ```
 */
export const factorizeEitherLeft = x => Either.Left(x);

Either.fromNullable = factorizeEitherFromNullable;
Either.left = factorizeEitherLeft;
Either.right = factorizeEitherRight;

export default Either;
