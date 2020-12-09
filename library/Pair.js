import { curry } from "https://x.nest.land/ramda@0.27.0/source/index.js";

import { factorizeType } from "./factories.js";

/**
 * The `Pair` type represents two values.
 *
 * The `Pair` type implements the following algebras:
 * - [x] Bifunctor
 * - [x] Functor
 *
 * ### Example
 *
 * ```js
 * const pair = Pair(42, 42)
 *   .bimap(
 *     x => x * 2,
 *     x => x + 2
 *   );
 *
 * assert(Pair.is(pair));
 * assert(pair.first === 84);
 * assert(pair.first === 44);
 * ```
 */

export const Pair = factorizeType("Pair", [ "first", "second" ]);

Pair.prototype.bimap = Pair.prototype["fantasy-land/bimap"] = function (unaryFunctionA, unaryFunctionB) {

  return Pair(unaryFunctionA(this.first), unaryFunctionB(this.second));
};

Pair.prototype.map = Pair.prototype["fantasy-land/map"] = function (unaryFunction) {

  return Pair(unaryFunction(this.first), this.second);
};

export const factorizePair = curry(Pair);

export default Pair;
