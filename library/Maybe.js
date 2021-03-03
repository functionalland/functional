import { $$value } from "./Symbols.js";

import { assertIsNull, assertIsUndefined, assertIsObject } from "./assertions.js";
import { factorizeSumType } from "./factories.js";

/**
 * ## Maybe
 *
 * The `Maybe` is the most common sum type; it represents the possibility of a value being `null` or `undefined`.
 *
 * The `Maybe` type implements the following algebras:
 * - [x] Alternative
 * - [x] Comonad
 * - [x] Monad
 *
 * ### Example
 *
 * ```ts
 * import Maybe from "https://deno.land/x/functional@v1.3.2/library/Maybe.js";
 *
 * const containerA = Maybe.Just(42).map((x: number) => x + 2);
 * const containerB = Maybe.Nothing.map((x: number) => x + 2);
 *
 * assert(Maybe.Just.is(containerA));
 * assert(containerA.extract() === 44);
 * assert(Maybe.Nothing.is(containerB));
 * ```
 */
export const Maybe = factorizeSumType(
  "Maybe",
  {
    Nothing: [],
    Just: [ $$value ]
  }
);

/**
 * ### Maybe `.alt`
 * `Maybe.Just a ~> Maybe.Just b -> Maybe.Just a`
 * `Maybe.Nothing ~> Maybe.Just b -> Maybe.Just b`
 *
 * This method takes a container of similar shape that will be returned if the context is of type `Maybe.Nothing`.
 * It is interoperable with `Box` and, `Either`.
 *
 * ```ts
 * const containerA = Maybe.Just(24).alt(Maybe.Just(42));
 * const containerB = Maybe.Nothing.alt(Maybe.Just(42));
 *
 * assertEquivalent(containerA, Maybe.Just(24));
 * assertEquivalent(containerB, Maybe.Just(42));
 * ```
 */
Maybe.prototype.alt = Maybe.prototype["fantasy-land/alt"] = function (A) {

  return this.fold({
    Nothing: _ => A,
    Just: _ => this
  });
};

/**
 * ### Maybe `.ap`
 * `Maybe.Just a ~> (Maybe.Just a -> b) -> Maybe.Just b`
 * `Maybe.Nothing ~> (Maybe.Just a -> b) -> Maybe.Nothing`
 *
 * This method takes a container of similar shape of a unary function and, applies it to its own value. The returned
 * container will be of the same type.
 * If the container is of type `Maybe.Nothing`, nothing happens.
 * It is interoperable with `Box` and, `Either`.
 *
 * ```ts
 * const container = Maybe.Just(42).ap(Maybe.Just((x: number) => x * 2));
 *
 * assertEquivalent(container, Maybe.Just(84));
 * ```
 */
Maybe.prototype.ap = Maybe.prototype["fantasy-land/ap"] = function (A) {
  if (Maybe.Nothing.is(this)) return this;

  return Maybe.Just.is(A) ? Maybe.of(A[$$value] (this[$$value])) : A;
};

/**
 * ### Maybe `.chain`
 * `Maybe.Just a ~> (a -> Maybe.Just b) -> Maybe.Just b`
 * `Maybe.Nothing ~> (a -> Maybe.Just b) -> Maybe.Nothing`
 *
 * This method takes a unary function that returns a container of similar shape.
 * If the container is of type `Maybe.Nothing`, nothing happens.
 * It is interoperable with `Box` and, `Either`.
 *
 * ```ts
 * const container = Maybe.Just(42).chain((x: number) => Maybe.Just(x * 2));
 *
 * assertEquivalent(container, Maybe.Just(84));
 * ```
 */
Maybe.prototype.chain = Maybe.prototype["fantasy-land/chain"] = function (f) {

  return this.fold( {
    Nothing: _ => Maybe.Nothing,
    Just: value => f (value)
  });
};

/**
 * ### Maybe `.extend`
 * `Maybe.Just a ~> ((Maybe.Just a) -> b) -> Maybe.Just b`
 * `Maybe.Nothing ~> ((Maybe.Just a) -> b) -> Maybe.Nothing`
 *
 * This method takes a unary function that accepts a container of similar shape and return a value. The returned
 * container will be of the same type.
 * If the container is of type `Maybe.Nothing`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Maybe.Just(42).extend((x: number) => x[$$value] * 2);
 *
 * assertEquivalent(container, Box(84));
 * ```
 */
Maybe.prototype.extend = Maybe.prototype["fantasy-land/extend"] = function (f) {

  return this.fold({
    Nothing: _ => Maybe.Nothing,
    Just: _ => Maybe.of(f (this))
  });
};

/**
 * ### Maybe `.extract`
 * `Maybe.Just a ~> () -> a`
 *
 * This method takes no argument and, return its own value.
 *
 * ```ts
 * const value = Maybe.Just(42).extract();
 *
 * assertEquals(value, 42);
 * ```
 */
Maybe.prototype.extract = Maybe.prototype["fantasy-land/extract"] = function () {

  return this.fold({
    Nothing: _ => Maybe.Nothing,
    Just: value => value
  });
};

/**
 * ### Maybe `.map`
 * `Maybe.Just a ~> (a -> b) -> Maybe.Just b`
 * `Maybe.Nothing ~> (a -> b) -> Maybe.Nothing`
 *
 * This method takes a unary function that returns a value. The returned container will be of the same type.
 * If the container is of type `Maybe.Nothing`, nothing happens.
 * It is interoperable with `Box` and, `Maybe`.
 *
 * ```ts
 * const container = Maybe.Just(42).map((x: number) => x * 2);
 *
 * assertEquivalent(container, Maybe.Just(84));
 * ```
 */
Maybe.prototype.map = Maybe.prototype["fantasy-land/map"] = function (f) {

  return this.fold({
    Nothing: _ => this,
    Just: value => Maybe.of(f (value))
  });
};

/**
 * ### Maybe `.of`
 * `a -> Maybe.Just a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = Maybe.of(42);
 *
 * assertEquals(container, Maybe.Just(42));
 * ```
 */
Maybe.of = Maybe.prototype.of = Maybe.prototype["fantasy-land/of"] = x => Maybe.Just(x);

/**
 * ### Maybe `.zero`
 * `() -> Maybe.Nothing`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = Maybe.zero();
 *
 * assertEquals(container, Maybe.Nothing);
 * ```
 */
Maybe.zero = Maybe.prototype.zero = Maybe.prototype["fantasy-land/zero"] = () => Maybe.Nothing;

/**
 * ### `factorizeMaybeFromNullable`
 * `a -> Maybe a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const containerA = factorizeMaybeFromNullable(42);
 * const containerB = factorizeMaybeFromNullable(null);
 *
 * assertEquals(containerA, Maybe.Just(42));
 * assertEquals(containerB, Maybe.Nothing);
 * ```
 */
export const factorizeMaybeFromNullable = x =>
  assertIsNull (x) || assertIsUndefined (x) || !x && assertIsObject (x)
    ? Maybe.Nothing
    : Maybe.Just(x);

/**
 * ### `factorizeMaybeJust`
 * `a -> Maybe.Just a`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = factorizeMaybeJust(42);
 *
 * assertEquals(container, Maybe.Just(42));
 * ```
 */
export const factorizeMaybeJust = x => Maybe.Just(x);

/**
 * ### `factorizeMaybeNothing`
 * `a -> Maybe.Nothing`
 *
 * This method takes a value and, returns a container.
 *
 * ```ts
 * const container = factorizeMaybeNothing(42);
 *
 * assertEquals(container, Maybe.Nothing);
 * ```
 */
export const factorizeMaybeNothing = () => Maybe.Nothing;

Maybe.fromNullable = factorizeMaybeFromNullable;
Maybe.just = factorizeMaybeJust;
Maybe.nothing = factorizeMaybeNothing;

export default Maybe;
