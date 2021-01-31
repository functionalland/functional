import { curry2 } from "./curry.js";

/**
 * ## Utilities
 *
 * ### `assertIsArray`
 * `* -> Boolean`
 *
 * ### `assertIsBoolean`
 * `* -> Boolean`
 *
 * ### `assertIsFunction`
 * `* -> Boolean`
 *
 * ### `assertIsInstance`
 * `* -> Boolean`
 *
 * ### `assertIsNull`
 * `* -> Boolean`
 *
 * ### `assertIsNumber`
 * `* -> Boolean`
 *
 * ### `assertIsObject`
 * `* -> Boolean`
 *
 * ### `assertIsRegex`
 * `* -> Boolean`
 *
 * ### `assertIsString`
 * `* -> Boolean`
 *
 * ### `assertIsUndefined`
 * `* -> Boolean`
 *
 * ### `decodeRaw`
 * `Uint8Array -> String`
 *
 * ### `encodeText`
 * `String -> Uint8Array`
 */
export const assertIsArray = value => value instanceof Array;
export const assertIsBoolean = value => value === true || value === false;
export const assertIsFunction = value => value instanceof Function;
export const assertIsInstance = curry2((T, value) => value instanceof T);
export const assertIsNull = value => value === null;
export const assertIsNumber = value => typeof value === "number";
export const assertIsObject = value => typeof value === "object" && !(value instanceof Array);
export const assertIsRegex = value => value instanceof RegExp;
export const assertIsString = value => typeof value === "string";
export const assertIsUndefined = value => value === undefined;
