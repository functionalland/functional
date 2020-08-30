import { assertIsDefined, assertIsEquivalent, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";
import Maybe from "./Maybe";

const $$value = Symbol.for("TypeValue");

export const Either = factorizeSumType(
  "Either",
  {
    Left: [ $$value ],
    Right: [ $$value ]
  }
);

Either.fromNullable = value =>
  !assertIsDefined(value) || assertIsNone(value) ? Either.Left(value) : Either.Right(value);
Either.left = value => Either.Left(value);
Either.right = value => Either.Right(value);
Either.of = value => Either.Right(value);

// alt :: Either a b ~> Either a b -> Either a b
Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Left: _ => container,
    Right: _ => this
  });
};

// ap :: Either a b ~> Either a (b -> c) -> Either a c
Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function (container) {
  if (Either.Left.is(this)) return (Either.Left.is(container)) ? container : this;

  return Either.Right.is(container) ? Either.of(container[$$value](this[$$value])) : container;
};

// map :: Either a b ~> (b -> c) -> Either a c
Either.prototype.map = Either.prototype["fantasy-land/map"] = function (unaryFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => Either.of(unaryFunction(this[$$value]))
  });
};

// chain :: Either a b ~> (b -> Either a c) -> Either a c
Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => unaryFunction(this[$$value])
  });
};

export default Either;
