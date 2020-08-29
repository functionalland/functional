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

// ap :: Maybe a ~> m (a -> b) -> Maybe b
Maybe.prototype.ap = Maybe.prototype["fantasy-land/ap"] = function (container) {
  if (Maybe.Nothing.is(this)) return this;

  return container.fold({
    Just: _ => Maybe.of(container[$$value](this[$$value])),
    Nothing: _ => container
  });
};

// chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
Maybe.prototype.chain = Maybe.prototype["fantasy-land/chain"] = function (composedFunction) {

  return this.fold({
    Just: value => composedFunction(value),
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
Maybe.prototype.map = Maybe.prototype["fantasy-land/map"] = function (composedFunction) {

  // return this.chain(container => Maybe.of(composedFunction(container)));
  return this.fold({
    Just: _ => Maybe.of(composedFunction(this[$$value])),
    Nothing: _ => this
  });
};

// reduce :: Maybe a ~> ((b, a) -> b, b) -> b
Maybe.prototype.reduce = Maybe.prototype["fantasy-land/reduce"] = function (composedFunction, accumulator) {

  return this.fold({
    Just: _ => composedFunction(accumulator, this[$$value]),
    Nothing: _ => accumulator
  });
};

Maybe.prototype.sequence = Maybe.prototype["fantasy-land/sequence"] = function (TypeRep) {

  return this.traverse(TypeRep, x => x);
};

// traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
Maybe.prototype.traverse = function (TypeRep, composedFunction) {

  return this.fold({
    Just: _ => composedFunction(this[$$value]).map(Maybe.of),
    Nothing: _ => TypeRep.of(this)
  });
};

export default Maybe;
