import { assertIsDefined, assertIsEquivalent, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";

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
Either.prototype.ap = function (container) {
  if (Either.Left.is(this)) return (Either.Left.is(container)) ? container : this;

  return container.fold({
    Left: _ => container,
    Right: _ => Either.of(container[$$value](this[$$value]))
  });
};

// map :: Either a b ~> (b -> c) -> Either a c
Either.prototype.map = function (composedFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => Either.of(composedFunction(this[$$value]))
  });
};

// chain :: Either a b ~> (b -> Either a c) -> Either a c
Either.prototype.chain = function (composedFunction) {

  return this.fold({
    Left: _ => this,
    Right: _ => composedFunction(this[$$value])
  });
};

export default Either;
