import { curry2, curry3 } from "./curry.js";
import { assertIsString } from "./assertions.js";
import {assertIsFunction} from "./assertions.js";

/**
 * ### `alt`
 * `Alt a -> Alt b -> Alt a|b`
 *
 * This function takes a container of any type and, an Alternative Functor. It returns either the container or the
 * Alternative Functor.
 * It is a combinator in support of the [Alt algebra](https://github.com/fantasyland/fantasy-land#alt).
 *
 * ```js
 * import { alt } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = alt(Either.Right(42), Either.Left("Not the meaning of life"));
 *
 * assertEquivalent(container, Either.Right(42));
 * ```
 */
export const alt = curry2((x, y) => (y.alt || y["fantasy-land/alt"]).call(y, x));

/**
 * ### `ap`
 * `(Applicative a -> b) -> Applicative a -> Applicative b`
 *
 * This function takes an Applicative Functor of a unary function and a second Applicative Functor. It returns an
 * Applicative Functor of similar shape.
 * It is a combinator in support of the [Apply algebra](https://github.com/fantasyland/fantasy-land#ap).
 * This function also serves as the [S combinator](https://functional.land/core/aviary#ap) when overloaded.
 *
 * ```js
 * import { ap } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = ap(Either.Right(x => x * 2), Either.Right(42));
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
export { ap } from "./aviary.js";

/**
 * ### `bimap`
 * `(a -> b) -> (c -> d) -> Bifunctor a b -> Bifunctor c d`
 *
 * This function takes two unary functions and a Bifunctor. It returns a Bifunctor of a similar shape.
 * It is a combinator in support of the [Bifunctor algebra](https://github.com/fantasyland/fantasy-land#bifunctor).
 *
 * ```js
 * import { bimap } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = bimap(x => x * 2, x => x + 2, Pair(42, 24));
 *
 * assertEquivalent(container, Pair(84, 26));
 * ```
 */
export const bimap = curry3((f, g, x) => (x.bimap || x["fantasy-land/bimap"]).call(x, f, g));

/**
 * ### `chain`
 * `(a -> Chainable b) -> Chainable a -> Chainable b`
 *
 * This function takes a unary function and a Chainable Functor. It returns a Chainable Functor of a similar shape.
 * It is a combinator in support of the [Chain algebra](https://github.com/fantasyland/fantasy-land#chain).
 *
 * ```js
 * import { chain } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = chain(x => Either.Right(x * 2), Either.Right(42));
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
export const chain = curry2((f, x) => (x.chain || x["fantasy-land/chain"]).call(x, f));

export const chainLift = curry2(
  (binaryFunction, chainableFunctor, functor) => chainableFunctor.chain(x => functor.map(binaryFunction(x)))
);

/**
 * ### `chainRec`
 * `ChainRec r => ((a -> c, b -> c, a) -> r c) -> a -> r b`
 *
 * This function is a combinator for the [`chainRec` algebra](https://github.com/fantasyland/fantasy-land#chainrec).
 * It takes a ternary function, an initial value and, a chainable recursive functor.
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
 * import { chainRec } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const multiplyAll = curry((x, n) => chainRec(
 *   (Loop, Done, cursor) =>
 *     cursor === n ? Done(Pair(cursor, null)) : Loop(Pair(cursor + 1, Task.of([ x * (cursor + 1) ]))),
 *   0
 * ));
 *
 * const container = await multiplyAll(42, 10)(Task.of([ 0 ])).run();
 *
 * const value = safeExtract("Failed.", container);
 *
 * assertEquals(value, [ 0, 42, 84, 126, 168, 210, 252, 294, 336, 378, 420 ]);
 * ```
 */
export const chainRec = curry2(
  (ternaryFunction, initiator, chainableRecursiveFunctor) =>
    (chainableRecursiveFunctor.chainRec || chainableRecursiveFunctor["fantasy-land/chainRec"])
      .call(chainableRecursiveFunctor, ternaryFunction, initiator)
);

/**
 * ### `concat`
 * `Semigroup a -> Semigroup b -> Semigroup c`
 *
 * This function takes two Semigroup and, it returns a Semigroup. And yes, Arrays and Strings are valid Semigroups.
 * It is a combinator in support of the [Semigroup algebra](https://github.com/fantasyland/fantasy-land#semigroup).
 *
 * ```js
 * import { concat } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = concat([ 104, 111, 103, 101 ], [  102, 117, 103, 97 ]);
 *
 * assertEquals(container, [ 102, 117, 103, 97, 104, 111, 103, 101 ]);
 * ```
 */
export const concat = curry2((x, y) =>
  assertIsString(x) && assertIsString(y)
    ? x + y
    : (y.concat || y["fantasy-land/concat"]).call(y, x));

/**
 * ### `extend`
 * `Extendable a -> (Extendable a -> b) -> Extendable b`
 *
 * This function takes a unary function and an Extendable Functor. It returns a Extendable Functor of a similar shape.
 * It is a combinator in support of the [Monad algebra](https://github.com/fantasyland/fantasy-land#monad).
 *
 * ```js
 * import { extend } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const container = extend(x => x[$$value] * 2, Either.Right(42));
 *
 * assertEquivalent(container, Either.Right(84));
 * ```
 */
export const extend = curry2((f, x) => (x.extend || x["fantasy-land/extend"]).call(x, f));

/**
 * ### `extract`
 * `Extractable a -> a`
 *
 * This function takes an Extractable Functor and, it returns the value.
 * It is a combinator in support of the [Comonad algebra](https://github.com/fantasyland/fantasy-land#comonad).
 *
 * ```js
 * import { extract } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const value = extract(Either.Right(42));
 *
 * assertEquivalent(value, 42);
 * ```
 */
export const extract = x => (x.extract || x["fantasy-land/extract"]).call(x);

/**
 * ### `map`
 * `(a -> b) -> Functor a -> Functor b`
 *
 * This function takes a unary function and, a Functor. It returns a Functor of similar shape.
 * It is a combinator in support of the [Functor algebra](https://github.com/fantasyland/fantasy-land#functor).
 *
 * ```js
 * import { map } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const value = map(x => x * 2, Either.Right(42));
 *
 * assertEquivalent(value, 42);
 * ```
 */
export const map = curry2((f, x) => (x.map || x["fantasy-land/map"]).call(x, f));

/**
 * ### `reduce`
 * `(a -> b -> c) -> a -> FoldableFunctor b -> FoldableFunctor c`
 *
 * This function takes a binary function and, a Foldable Functor. It returns a Foldable Functor of similar shape.
 * It is a combinator in support of the [Foldable Functor algebra](https://github.com/fantasyland/fantasy-land#foldable).
 *
 * ```js
 * import { reduce } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const value = reduce(ys => x => ys + x, 0, [ 42, 24, 12 ]);
 *
 * assertEquals(value, 78);
 * ```
 */
export const reduce = curry3((f, xs, x) =>
  (x.reduce || x["fantasy-land/reduce"]).call(x, (ys, y, ...a) => f.length === 1 ? f(ys)(y) : f(ys, y, ...a), xs));

/**
 * ### `then`
 * `(a -> b) -> Promise a -> Promise b`
 *
 * This function takes a unary function and, a Promise. It returns a new Promise.
 *
 * ```js
 * import { then } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
 *
 * const value = then(x => x * 2, Promise.resolve(42));
 *
 * assertEquals(value, Promise(84));
 * ```
 */
export const then = curry2((f, $p) => assertIsFunction($p) ? $q => $q.then(f, $p) : $p.then(f));

export const toString = x => x && x.toString() || "";
