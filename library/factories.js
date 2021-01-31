// Inspired by fantasyland/daggy
// @see https://github.com/fantasyland/daggy/blob/master/src/daggy.js

import { map, reduce, toString } from "./algebraic.js";
import { apBinary, apply, compose2, identity } from "./aviary.js";
import { curry2, curry3, curryN } from "./curry.js";
import { complement, has, join, prop, zipObj } from "./other.js";

import { $$inspect, $$returnType, $$tag, $$tagList, $$type, $$valueList } from "./Symbols.js";

/**
 * ## Type factory
 *
 * The Type factory can be used to build complex data structure.
 *
 * ```js
 * import { factorizeType } from "https://deno.land/x/functional@v1.3.2/library/factories.js";
 *
 * const Coordinates = factorizeType("Coordinates", [ "x", "y" ]);
 * const vector = Coordinates(150, 200);
 * // vector.x === 150
 * // vector.y === 200
 * ```
 *
 * ### Type`.from`
 * `Type ~> Object -> t`
 *
 * Create an instance of Type using an object representation.
 *
 * ```js
 * const vector = Coordinates.from({ x: 150, y: 200 });
 * // vector.x === 150
 * // vector.y === 200
 * ```
 *
 * ### Type`.is`
 * `Type ~> Type t -> Boolean`
 *
 * Assert that an instance is of the same Type.
 *
 * ```js
 * Coordinates.is(vector);
 * // true
 * ```
 *
 * ### Type`.toString`
 * `Type ~> () -> String`
 *
 * Serialize the Type Representation into a string.
 *
 * ```js
 * Coordinates.toString();
 * // "Coordinates"
 * ```
 *
 * ### Type(a)`.toString`
 * `Type t => t ~> () -> String`
 *
 * Serialize the instance into a string.
 *
 * ```js
 * vector.toString();
 * // "Coordinates(150, 200)"
 * ```
 *
 * ## Sum Type factory
 *
 * ```js
 * import { factorizeSumType } from "https://deno.land/x/functional@v1.3.2/library/factories.js";
 *
 * const Shape = factorizeSumType(
 *   "Shape",
 *   {
 *     // Square :: (Coord, Coord) -> Shape
 *     Square: [ "topLeft", "bottomRight" ],
 *     // Circle :: (Coord, Number) -> Shape
 *     Circle: [ "center", "radius" ]
 *   }
 * );
 * ```
 *
 * ### SumType`.from`
 * `SumType ~> Object -> t`
 *
 * Create an instance of Type using an object representation.
 *
 * ```js
 * const oval = Shape.Circle.from(
 *   {
 *     center: Coordinates.from({ x: 150, y: 200 }),
 *     radius: 200
 *   }
 * );
 * // oval.center === Coordinates(150, 200)
 * // oval.radius === 200
 * ```
 *
 * ### SumType`.is`
 * `SumType ~> SumType t -> Boolean`
 *
 * Assert that an instance is of the same Sum Type.
 *
 * ```js
 * Shape.Circle.is(oval);
 * // true
 * ```
 *
 * ### SumType`#fold`
 *
 * ```js
 * Shape.prototype.translate = function (x, y, z) {
 *   return this.fold({
 *     Square: (topleft, bottomright) =>
 *       Shape.Square(
 *         topLeft.translate(x, y, z),
 *         bottomRight.translate(x, y, z)
 *       ),
 *
 *     Circle: (centre, radius) =>
 *       Shape.Circle(
 *         centre.translate(x, y, z),
 *         radius
 *       )
 *   })
 * };
 * ```
 *
 * ### SumType(a)`.toString`
 * ` SumType t => t ~> () -> String`
 *
 * Serialize the instance into a string.
 *
 * ```js
 * oval.toString();
 * // "Shape.Circle(Coordinates(150, 200), 200)"
 * ```
 */

// Prototype :: Object
// TypeRepresentation :: Object
// TypeSumInstance :: Object

// assertIsUnit :: TypeSumInstance -> TypeSumInstance -> Boolean
const assertIsUnit = curry2(
  (instance, value) =>
    instance === value
    || !!value
      && instance[$$tag] === value[$$tag]
      && instance.constructor[$$type] === value.constructor[$$type]
);

// assertIsTypeRepresentation :: String -> TypeSumInstance -> Boolean
const assertIsTypeRepresentation = curry2(
  (typeName, value) => value !== undefined && value !== null && typeName === value.constructor[$$type]
);

// assertIsTypeRepresentation :: TypeRepresentation -> TypeSumInstance -> Boolean
const assertIsVariant = curry2(
  (instance, value) =>
    !!value
    && instance[$$tag] === value[$$tag]
    && instance[$$returnType] === value.constructor[$$type]
);

// serializeConstructorType :: String -> String -> String
const serializeConstructorType = curry2((typeName, tag) => `${typeName}.${tag}`);

const serializeConstructorTypeBound = function () {

  return serializeConstructorType(this[$$returnType], this[$$tag]);
}

// serializeList :: [*] -> String
const serializeList = compose2(join(", "), map(toString));

// serializeTypeInstance :: String -> [*] -> String
const serializeTypeInstance = curry2((typeName, valueList) => `${typeName}(${serializeList(valueList)})`);

// serializeTypeInstanceWithTag :: String -> String -> [*] -> String
const serializeTypeInstanceWithTag = curry3(
  (typeName, tagName, valueList) =>
    (valueList.length > 0)
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

  return apply(functionByTag[instanceTag]);
};

const factorizeFoldBound = function (functionByTag) {

  return factorizeFold(functionByTag, this[$$tag], this.constructor[$$tagList])(this[$$valueList]);
};

// factorizeType :: (String, [String]) -> Function
export const factorizeType = curry2(
  (typeName, propertyNameList) => {
    let prototypeAccumulator = {
      toString: serializeTypeInstanceBound,
      [$$inspect]: serializeTypeInstanceBound,
      [$$type]: typeName
    };

    const typeRepresentationConstructor = factorizeConstructor(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$inspect] = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$type] = typeName;

    prototypeAccumulator.constructor = typeRepresentationConstructor;

    return typeRepresentationConstructor
  }
);

// factorizeSumType :: String -> { String: [String]] } -> Function
export const factorizeSumType = curry2(
  (typeName, propertyNameListByTag) => {
    let prototypeAccumulator = {
      fold: factorizeFoldBound,
      toString: serializeTypeInstanceBound,
      [$$inspect]: serializeTypeInstanceBound
    };
    const tagList = Object.keys(propertyNameListByTag);

    const typeRepresentation = prototypeAccumulator.constructor = {
      is: assertIsTypeRepresentation(typeName),
      prototype: prototypeAccumulator,
      toString: serializeTypeRepresentationBound,
      [$$inspect]: serializeTypeRepresentationBound,
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
      typeRepresentation[tag][$$inspect] = serializeConstructorTypeBound;
      typeRepresentation[tag][$$returnType] = typeName;
      typeRepresentation[tag][$$tag] = tag;
      typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
    }

    return typeRepresentation
  }
);

// factorizeValue :: [String] -> Prototype -> [*] -> Number -> Prototype
const factorizeValue = curryN(
  4,
  (propertyNameList, prototype, propertyValueList, argumentCount) => {
    if (argumentCount !== propertyNameList.length) {
      throw new TypeError (`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }

    return Object.assign(
      Object.create(prototype),
      {
        ...zipObj(
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
  compose2(
    apBinary(factorizeValue(propertyNameList, prototype), identity, prop("length")),
    (blueprintObject) => reduce(
      (accumulator, propertyName) => {
        if (complement(has)(propertyName, blueprintObject)) {
          throw new TypeError (`Missing field: ${propertyName}`);
        }

        return [ ...accumulator, blueprintObject[propertyName] ];
      },
      [],
      propertyNameList
    )
  );
