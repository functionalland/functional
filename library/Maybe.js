import { assertIsDefined, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";

const $$value = Symbol.for("TypeValue");

export const Maybe = factorizeSumType(
  "Maybe",
  {
    Nothing: [],
    Just: [ $$value ]
  }
);

Maybe.fromNullable = value => !assertIsDefined(value) || assertIsNone(value) ? Maybe.nothing() : Maybe.just(value);
Maybe.just = value => Maybe.Just(value);
Maybe.nothing = () => Maybe.Nothing;
Maybe.of = value => Maybe.Just(value);

// alt :: Maybe a ~> Maybe a -> Maybe a
Maybe.prototype.alt = Maybe.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Just: _ => this,
    Nothing: _ => container
  });
};

// ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
Maybe.prototype.ap = Maybe.prototype["fantasy-land/ap"] = function (container) {
  if (Maybe.Nothing.is(this)) return this;

  return Maybe.Just.is(container) ? Maybe.of(container[$$value](this[$$value])) : container;
};

// chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
Maybe.prototype.chain = Maybe.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return this.fold({
    Just: value => unaryFunction(value),
    Nothing: _ => Maybe.Nothing
  });
};

// filter :: Maybe a ~> (a -> Boolean) -> Maybe a
Maybe.prototype.filter = Maybe.prototype["fantasy-land/filter"] = function (predicate) {

  return this.fold({
    Just: _ => predicate(this[$$value]) ? this : Maybe.Nothing,
    Nothing: _ => this
  });
};

// map :: Maybe a ~> (a -> b) -> Maybe b
Maybe.prototype.map = Maybe.prototype["fantasy-land/map"] = function (unaryFunction) {

  return this.fold({
    Just: _ => Maybe.of(unaryFunction(this[$$value])),
    Nothing: _ => this
  });
};

// reduce :: Maybe a ~> ((b, a) -> b, b) -> b
Maybe.prototype.reduce = Maybe.prototype["fantasy-land/reduce"] = function (binaryFunction, accumulator) {

  return this.fold({
    Just: _ => binaryFunction(accumulator, this[$$value]),
    Nothing: _ => accumulator
  });
};

Maybe.prototype.sequence = Maybe.prototype["fantasy-land/sequence"] = function (TypeRep) {

  return this.traverse(TypeRep, x => x);
};

// traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
Maybe.prototype.traverse = function (TypeRep, unaryFunction) {

  return this.fold({
    Just: _ => unaryFunction(this[$$value]).map(Maybe.of),
    Nothing: _ => TypeRep.of(this)
  });
};

export default Maybe;
