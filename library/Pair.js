import { curryN } from "./curry.js";

import { factorizeType } from "./factories.js";

/**
 * ## Pair
 *
 * The `Pair` type represents two values.
 *
 * The `Pair` type implements the following algebras:
 * - [x] Bifunctor
 * - [x] Functor
 *
 * ### Example
 *
 * ```js
 * import Pair from "https://deno.land/x/functional@v1.3.2/library/Pair.js";
 *
 * const pair = Pair(42, 42)
 *   .bimap(x => x * 2, x => x + 2);
 *
 * assert(Pair.is(pair));
 * ```
 */

export const Pair = factorizeType("Pair", [ "first", "second" ]);

Pair.prototype.bimap = Pair.prototype["fantasy-land/bimap"] = function (unaryFunctionA, unaryFunctionB) {

  return Pair(unaryFunctionA(this.first), unaryFunctionB(this.second));
};

Pair.prototype.map = Pair.prototype["fantasy-land/map"] = function (unaryFunction) {

  return Pair(unaryFunction(this.first), this.second);
};

export const factorizePair = curryN(2, Pair);

export default Pair;
