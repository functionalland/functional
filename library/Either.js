import { factorizeSumType } from "./factories.js";

import { $$value } from "./Symbols.js";

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
 * ```js
 * import Either from "https://deno.land/x/functional@v1.3.0/library/Either.js";
 *
 * const containerA = Either.Right(42).map(x => x + 2);
 * const containerB = Either.Left(new Error("The value is not 42.")).map(x => x + 2);
 * const containerC = containerB.alt(containerA);
 *
 * assert(Either.Right.is(containerA));
 * assert(containerA.extract() === 44);
 * assert(Either.Left.is(containerB));
 * assert(Either.Right(containerC));
 * ```
 */

export const Either = factorizeSumType(
  "Either",
  {
    Left: [ $$value ],
    Right: [ $$value ]
  }
);

Either.fromNullable = value => !(typeof value  !== "undefined") || !value && typeof value === "object"
    ? Either.Left(value)
  : Either.Right(value);
Either.left = value => Either.Left(value);
Either.right = value => Either.Right(value);

Either.of = Either.prototype.of = Either.prototype["fantasy-land/of"] = value => Either.Right(value);

Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Left: _ => container,
    Right: _ => this
  });
};

Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function (container) {

  return this.fold({
    Left: _ => this,
    Right: value => Either.Right.is(container) ? Either.Right(container[$$value](value)) : container
  });
};

Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return this.fold({
    Left: _ => this,
    Right: value => unaryFunction(value)
  });
};

Either.prototype.extend = Either.prototype["fantasy-land/extend"] = function (unaryFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => Either.of(unaryFunction(this))
  });
};

Either.prototype.extract = Either.prototype["fantasy-land/extract"] = function () {

  return this.fold({
    Left: _ => this,
    Right: value => value
  });
};

Either.prototype.map = Either.prototype["fantasy-land/map"] = function (unaryFunction) {

  return this.fold({
    Left: _ => this,
    Right: value => Either.of(unaryFunction(value))
  });
};

Either.prototype.reduce = Either.prototype["fantasy-land/reduce"] = function (binaryFunction, accumulator) {

  return this.fold({
    Left: _ => accumulator,
    Right: value => binaryFunction(accumulator, value)
  });
};

Either.prototype.sequence = function (TypeRepresentation) {

  return this.traverse(TypeRepresentation, x => x);
};

Either.prototype.traverse = Either.prototype["fantasy-land/traverse"] = function (TypeRepresentation, unaryFunction) {

  return this.fold({
    Left: value => TypeRepresentation.of(Either.Left(value)),
    Right: value => unaryFunction(value).map(x => Either.Right(x))
  });
};

Either.zero = Either.prototype.zero = Either.prototype["fantasy-land/zero"] = () => Either.Left(null);

export default Either;
