// Inspired by fantasyland/daggy
// @see https://github.com/fantasyland/daggy/blob/master/src/daggy.js

import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";
import { assert, assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

// Prototype :: Object
// TypeRepresentation :: Object
// TypeSumInstance :: Object

const $$tag = Symbol.for("Tag");
const $$tagList = Symbol.for("TagList");
const $$valueList = Symbol.for("ValueList");
const $$type = Symbol.for("Type");
const $$returnType = Symbol.for("ReturnType");

// assertIsUnit :: TypeSumInstance -> TypeSumInstance -> Boolean
const assertIsUnit = R.curry(
  (instance, value) =>
    instance === value
    || !!value
      && instance[$$tag] === value[$$tag]
      && instance.constructor[$$type] === value.constructor[$$type]
);

// assertIsTypeRepresentation :: String -> TypeSumInstance -> Boolean
const assertIsTypeRepresentation = R.curry(
  (typeName, value) => typeName === value.constructor[$$type]
);

// assertIsTypeRepresentation :: TypeRepresentation -> TypeSumInstance -> Boolean
const assertIsVariant = R.curry(
  (instance, value) =>
    !!value
    && instance[$$tag] === value[$$tag]
    && instance[$$returnType] === value.constructor[$$type]
);

// serializeConstructorType :: String -> String -> String
const serializeConstructorType = R.curry(
  (typeName, tag) => `${typeName}.${tag}`
);

const serializeConstructorTypeBound = function () {

  return serializeConstructorType(this[$$returnType], this[$$tag]);
}

// serializeList :: [*] -> String
const serializeList = R.compose(R.join(", "), R.map(R.toString));

// serializeTypeInstance :: String -> [*] -> String
const serializeTypeInstance = R.curry(
  (typeName, valueList) => `${typeName}(${serializeList(valueList)})`
);

// serializeTypeInstanceWithTag :: String -> String -> [*] -> String
const serializeTypeInstanceWithTag = R.curry(
  (typeName, tagName, valueList) => (valueList.length > 0)
    ? `${typeName}.${tagName}(${serializeList(valueList)})`
    : `${typeName}.${tagName}`
);

const serializeTypeInstanceBound = function () {

  return (Object.getPrototypeOf(this).hasOwnProperty($$tag))
    ? serializeTypeInstanceWithTag(this.constructor[$$type], this[$$tag], this[$$valueList])
    : serializeTypeInstance(this.constructor[$$type], this[$$valueList]);
};

// serializeTypeRepresentation :: String a -> String a
const serializeTypeRepresentation = typeName => typeName;

const serializeTypeRepresentationBound = function () {

  return serializeTypeRepresentation(this[$$type]);
};

// factorizeFold :: { String: Function } -> String -> [String] -> Function
const factorizeFold = (functionByTag, instanceTag, constructorTagList) => {
  for (const tag of constructorTagList) {
    if (!functionByTag[tag]) {
      throw new TypeError (`Constructors given to fold didn't include: ${tag}`);
    }
  }

  return R.apply(functionByTag[instanceTag]);
};

const factorizeFoldBound = function (functionByTag) {

  return factorizeFold(functionByTag, this[$$tag], this.constructor[$$tagList])(this[$$valueList]);
};

/**
 * @function
 * @name factorizeType
 * @module functional/SumType
 *
 * @description Factorize a Type Representation.
 * @param {String} typeName
 * @param {String[]} propertyNameList
 * @return {Function}
 *
 * @example
 * const Coordinates = factorizeType("Coordinates", [ "x", "y" ]);
 * const vector = Coordinates(150, 200);
 * // vector.x === 150
 * // vector.y === 200
 */

// factorizeType :: (String, [String]) -> Function
export const factorizeType = (typeName, propertyNameList) => {
  let prototypeAccumulator = {
    toString: serializeTypeInstanceBound
  };

  const typeRepresentationConstructor = factorizeConstructor(propertyNameList, prototypeAccumulator);
  typeRepresentationConstructor.from = factorizeConstructorFromObject(propertyNameList, prototypeAccumulator);
  typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
  typeRepresentationConstructor.prototype = prototypeAccumulator;
  typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
  typeRepresentationConstructor[$$type] = typeName;

  prototypeAccumulator.constructor = typeRepresentationConstructor;

  return typeRepresentationConstructor
};

Deno.test(
  "SumType #factorizeType: Tuple",
  () => {
    const Tuple = factorizeType("Tuple", [ "_1", "_2" ]);
    const instanceCollection = [
      [
        "Constructor",
        Tuple(42, 24)
      ],
      [
        "#from",
        Tuple.from({ _1: 42, _2: 24 })
      ]
    ];

    assertEquals(Tuple.toString(), `Tuple`, `A Type factory can be serialized.`);
    assert(!Tuple.is({}));

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals($$instance.toString(), `Tuple(42, 24)`, `${instanceName}: An instance can be serialized.`);
      assertEquals($$instance._1, 42, `${instanceName}: An instance has properties.`);
      assertEquals($$instance._2, 24, `${instanceName}: An instance has properties.`);
      assertEquals($$instance.constructor, Tuple, `${instanceName}: An instance constructor is the Type factory.`);
      assert(Tuple.is($$instance));
      assert(Tuple.prototype.isPrototypeOf($$instance))
    }
  }
);

// factorizeSumType :: String -> { String: [String]] } -> Function
export const factorizeSumType = (typeName, propertyNameListByTag) => {
  let prototypeAccumulator = { toString: serializeTypeInstanceBound, fold: factorizeFoldBound };
  const tagList = Object.keys(propertyNameListByTag);

  const typeRepresentation = prototypeAccumulator.constructor = {
    is: assertIsTypeRepresentation(typeName),
    prototype: prototypeAccumulator,
    toString: serializeTypeRepresentationBound,
    [$$tagList]: tagList,
    [$$type]: typeName
  };

  for (const [ tag, propertyNameList ] of Object.entries(propertyNameListByTag)) {
    const tagPrototypeAccumulator = Object.assign(Object.create(prototypeAccumulator), { [$$tag]: tag });

    if (propertyNameList.length === 0) {
      typeRepresentation[tag] = factorizeValue(propertyNameList, tagPrototypeAccumulator, [], 0);
      typeRepresentation[tag].is = assertIsUnit(typeRepresentation[tag]);
      continue;
    }

    typeRepresentation[tag] = factorizeConstructor(propertyNameList, tagPrototypeAccumulator);
    typeRepresentation[tag].from = factorizeConstructorFromObject(propertyNameList, tagPrototypeAccumulator);
    typeRepresentation[tag].toString = serializeConstructorTypeBound;
    typeRepresentation[tag][$$returnType] = typeName;
    typeRepresentation[tag][$$tag] = tag;
    typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
  }

  return typeRepresentation
};

Deno.test(
  "SumType #factorizeSumType: List",
  () => {
    const List = factorizeSumType(
      "List",
      {
        Cons: [ "x", "xs" ],
        Nil: []
      }
    );

    List.prototype.iterate = "Dummy";

    const instanceCollection = [
      [
        "Constructor",
        List.Cons(42, List.Nil)
      ],
      [
        "#from",
        List.Cons.from({ x: 42, xs: List.Nil })
      ]
    ];

    assertEquals(List.toString(), `List`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assertEquals(List.Cons.toString(), `List.Cons`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assertEquals(List.Nil.toString(), `List.Nil`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assert(!List.is({}))

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals($$instance.toString(), `List.Cons(42, List.Nil)`, `${instanceName}: An instance can be serialized.`);
      assertEquals($$instance.x, 42,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals($$instance.xs, List.Nil,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals($$instance.xs.constructor, List,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals(
        $$instance.fold({
          Cons: (x, xs) => [ x, xs ],
          Nil: () => []
        }),
        [ 42, List.Nil ]
      );
      assert(List.is($$instance));
      assert(List.Cons.is($$instance));
      assert(!List.Cons.is($$instance.xs));
      assert(List.Nil.is($$instance.xs));
      assert(!List.Nil.is($$instance));
      assert(List.prototype.isPrototypeOf($$instance));
      assert(!!$$instance.iterate);
    }
  }
);

// factorizeValue :: [String] -> Prototype -> [*] -> Number -> Prototype
const factorizeValue = R.curry(
  (propertyNameList, prototype, propertyValueList, argumentCount) => {
    if (argumentCount !== propertyNameList.length) {
      throw new TypeError (`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }

    return Object.assign(
      Object.create(prototype),
      {
        ...R.zipObj(
          propertyNameList,
          propertyValueList
        ),
        [$$valueList]: propertyValueList
      }
    );
  }
);

// factorizeConstructor :: ([String], Prototype) -> Function
const factorizeConstructor = (propertyNameList, prototype) => {
  switch (propertyNameList.length) {
    case  1: return function (a) { return factorizeValue(propertyNameList, prototype, [a], arguments.length); };
    case  2: return function (a, b) { return factorizeValue(propertyNameList, prototype, [a, b], arguments.length); };
    case  3: return function (a, b, c) { return factorizeValue(propertyNameList, prototype, [a, b, c], arguments.length); };
    case  4: return function (a, b, c, d) { return factorizeValue(propertyNameList, prototype, [a, b, c, d], arguments.length); };
    case  5: return function (a, b, c, d, e) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e], arguments.length); };
    case  6: return function (a, b, c, d, e, f) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e, f], arguments.length); };
    case  7: return function (a, b, c, d, e, f, g) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e, f, g], arguments.length); };
    case  8: return function (a, b, c, d, e, f, g, h) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e, f, g, h], arguments.length); };
    case  9: return function (a, b, c, d, e, f, g, h, i) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e, f, g, h, i], arguments.length); };
    case 10: return function (a, b, c, d, e, f, g, h, i, j) { return factorizeValue(propertyNameList, prototype, [a, b, c, d, e, f, g, h, i, j], arguments.length); };

    default: return Object.defineProperty(
      function() {
        return factorizeValue(propertyNameList, prototype, arguments, arguments.length);
      },
      'length',
      { value: propertyNameList.length }
    );
  }
};

// factorizeConstructorFromObject :: ([String], Prototype) -> Object -> a
const factorizeConstructorFromObject = (propertyNameList, prototype) =>
  R.compose(
    R.converge(
      factorizeValue(
        propertyNameList,
        prototype
      ),
      [
        R.identity,
        R.prop("length")
      ]
    ),
    (blueprintObject) => R.reduce(
      (accumulator, propertyName) => {
        if (R.complement(R.has)(propertyName, blueprintObject)) {
          throw new TypeError (`Missing field: ${propertyName}`);
        }

        return [ ...accumulator, blueprintObject[propertyName] ];
      },
      [],
      propertyNameList
    )
  );
