import { factorizeSumType } from "./SumType.js";

import { $$value } from "./Symbols.js";

/**
 * The `Maybe` is the most common sum type; it represents the possibility of a value being `null` or `undefined`.
 *
 * The `Maybe` type implements the following algebras:
 * - [x] Alternative
 * - [x] Comonad
 * - [x] Monad
 *
 * ## Example
 *
 * ```js
 * const containerA = Maybe.Just(42).map(x => x + 2);
 * const containerB = Maybe.Nothing.map(x => x + 2);
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

Maybe.fromNullable = value => !(typeof value  !== "undefined") || !value && typeof value === "object"
  ? Maybe.nothing()
  : Maybe.just(value);
Maybe.just = value => Maybe.Just(value);
Maybe.nothing = () => Maybe.Nothing;

Maybe.of = Maybe.prototype.of = Maybe.prototype["fantasy-land/of"] = value => Maybe.Just(value);

Maybe.prototype.alt = Maybe.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Nothing: _ => container,
    Just: _ => this
  });
};

Maybe.prototype.ap = Maybe.prototype["fantasy-land/ap"] = function (container) {
  if (Maybe.Nothing.is(this)) return this;

  return Maybe.Just.is(container) ? Maybe.of(container[$$value](this[$$value])) : container;
};

Maybe.prototype.chain = Maybe.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return this.fold({
    Nothing: _ => Maybe.Nothing,
    Just: value => unaryFunction(value)
  });
};

Maybe.prototype.extend = Maybe.prototype["fantasy-land/extend"] = function (unaryFunction) {

  return this.fold({
    Nothing: _ => Maybe.Nothing,
    Just: _ => Maybe.of(unaryFunction(this))
  });
};

Maybe.prototype.extract = Maybe.prototype["fantasy-land/extract"] = function () {

  return this.fold({
    Nothing: _ => Maybe.Nothing,
    Just: value => value
  });
};

Maybe.prototype.filter = Maybe.prototype["fantasy-land/filter"] = function (predicate) {

  return this.fold({
    Nothing: _ => this,
    Just: value => predicate(value) ? this : Maybe.Nothing
  });
};

Maybe.prototype.map = Maybe.prototype["fantasy-land/map"] = function (unaryFunction) {

  return this.fold({
    Nothing: _ => this,
    Just: value => Maybe.of(unaryFunction(value))
  });
};

Maybe.prototype.reduce = Maybe.prototype["fantasy-land/reduce"] = function (binaryFunction, accumulator) {

  return this.fold({
    Nothing: _ => accumulator,
    Just: value => binaryFunction(accumulator, value)
  });
};

Maybe.prototype.sequence = function (TypeRepresentation) {

  return this.traverse(TypeRepresentation, x => x);
};

Maybe.prototype.traverse = Maybe.prototype["fantasy-land/traverse"] = function (TypeRepresentation, unaryFunction) {

  return this.fold({
    Nothing: _ => TypeRepresentation.of(Maybe.Nothing),
    Just: value =>
      unaryFunction(value).map(x => Maybe.Just(x))
  });
};

Maybe.zero = Maybe.prototype.zero = Maybe.prototype["fantasy-land/zero"] = () => Maybe.Nothing;

export default Maybe;
