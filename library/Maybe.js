import { factorizeSumType } from "./SumType.js";

import { $$value } from "./Symbols.js";

// NOTE: Fix broken tests of IO

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

Maybe.of = value => Maybe.Just(value);

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

export default Maybe;
