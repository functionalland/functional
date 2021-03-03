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
export const assertIsArray = x => x instanceof Array;
export const assertIsBoolean = x => x === true || x === false;
export const assertIsFunction = x => x instanceof Function;
export const assertIsInstance = curry2((T, x) => x instanceof T);
export const assertIsNull = x => x === null;
export const assertIsNumber = x => typeof x === "number";
export const assertIsObject = x => typeof x === "object" && !(x instanceof Array);
export const assertIsRegex = x => x instanceof RegExp;
export const assertIsString = x => typeof x === "string";
export const assertIsUndefined = x => x === undefined;
