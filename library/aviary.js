// https://www.angelfire.com/tx4/cus/combinator/birds.html
// https://github.com/fantasyland/fantasy-birds
// https://docs.rs/aviary/0.1.1/aviary/
// http://hackage.haskell.org/package/data-aviary-0.4.0/docs/Data-Aviary-Birds.html

import { curry2, curry3, curryN } from "./curry.js";
import { assertIsFunction } from "./assertions.js";

/**
 * ## Aviary
 *
 * The Aviary is a collection of Higher Order Functions also known as combinators.
 * The name "Aviary" is a nod to the fact that most combinators were given bird's names in honour of one of its
 * inventor, who was an avid bird watcher.
 *
 * These functions are an essential part of Functional Programming and the tacit style of programming.
 */

/**
 * ### Essentials
 *
 * The "essential" combinators were, for most part, invented early on and can be used to derived all of the other combinators.
 */

/**
 * #### `ap`
 * `(a -> b -> c) -> (a -> b) -> a -> c`
 *
 * This combinator takes a binary function, a unary function and a value of any type. Like compose, it should be read
 * from right to left; the last value is applied to the last function. Then, the resulting value along with the original
 * value is passed to the remaining function.
 * It is known as the "starling" or, the `S` combinator.
 *
 * ```js
 * const x = ap(x => y => x + y, x => x * 2, 42);
 * assertEquals(x, 126);
 * ```
 *
 * The function also has overload to serve as the Applicative Functor combinator.
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { ap } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = ap(x => y => x + y);
 * const g = f(x => x * 2);
 * const x = g(42);
 * ```
 *
 * ```ts
 * export function ap <X, Y, Z>(f: (x: X) => (y: Y) => Z): (g: (x: X) => Y) => (x: X) => Z;
 * export function ap <X, Y, Z>(f: (x: X) => (y: Y) => Z, g: (x: X) => Y): (x: X) => Z;
 * export function ap <X, Y, Z>(f: (x: X) => (y: Y) => Z, g: (x: X) => Y, x: X): Z;
 * ```
 */
export const starling = curry3((f, g, x) => f(x)(g(x)));
export const ap = curry2(
  (f, g, ...a) =>
    (assertIsFunction(f["fantasy-land/ap"]) && assertIsFunction(g["fantasy-land/ap"]))
    || (assertIsFunction(f.ap) && assertIsFunction(g.ap))
      ? (g.ap || g["fantasy-land/ap"]).call(g, f)
      : a.length === 1 ? starling(f, g, a[0]) : x => starling(f, g, x)
);
export const S = starling;

/**
 * #### `apply`
 * `(a -> b) -> a -> b`
 *
 * This combinator takes an unary function and a value of any type. It simply applies the value to the function.
 * It doesn't have a fun bird name but is also known as the applicator or, `$`.
 * You might also find it as "idotstar".
 *
 * ```js
 * const x = apply(x => x * 2, 42);
 * assertEquals(x, 84);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { apply } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = apply(x => x * 2);
 * const x = f(42);
 * ```
 *
 * ```ts
 * export function apply <X, Y>(f: (x: X) => Y): (x: X) => Y;
 * export function apply <X, Y>(f: (x: X) => Y, x: X): Y;
 * ```
 */
export const applicator = curry2( (f, xs) => f.apply(null, (xs instanceof Array) ? xs : [xs]));
export const idiotStar = applicator;
export const apply = applicator;
export const $ = applicator;

/**
 * #### `applyTo`
 * `a -> (a -> b) -> b`
 *
 * This combinator is the reverse `apply`. It takes a value of any type and a function and returns the resulting value.
 * It is known as the "thrush" or, the `T` combinator.
 *
 * Other known alias is `CI`; because it can also be expressed as `flip(identity)`.
 *
 * ```js
 * const x = applyTo(42, x => x * 2);
 * assertEquals(84);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { applyTo } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = applyTo(42);
 * const x = f(x => x * 2);
 * ```
 *
 * ```ts
 * export function applyTo <X>(x: X): <Y>(f: (x: X) => Y) => Y;
 * export function applyTo <X, Y>(x: X, f: (x: X) => Y): Y;
 * ```
 */
export const thrush = curry2( (x, f) => f(x));
export const applyTo = thrush;
export const T = thrush;
export const CI = thrush;

/**
 * #### `compose2`
 * `(b -> c) -> (a -> b) -> a -> c`
 *
 * This combinator takes two unary functions and a value of any type. The value will be executed from right to left,
 * passing the resulting value from one function to the next.
 * It is also known as the `bluebird` or, the `B` combinator.
 *
 * Other known alias is `o`; inspired by the character used to express composition in other languages like Haskell.
 *
 * ```js
 * const x = compose2(x => x * 2, x => x + 2, 42);
 * assertEquals(x, 88);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { compose2 } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = compose2(x => x * 2);
 * const g = f(x => x + 2);
 * const x = g(42);
 * ```
 *
 * ```ts
 * export function compose2 <Y, Z>(f: (y: Y) => Z): <X>(g: (x: X) => Y) => (x: X) => Z;
 * export function compose2 <X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y): (x: X) => Z;
 * export function compose2 <X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y, x: X): Z;
 * ```
 */
export const bluebird = curry3( (f, g, x) => f(g(x)));
export const compose2 = bluebird;
export const o = bluebird;
export const B = bluebird;

/**
 * #### `compose3`
 * `(c -> d) -> (b -> c) -> (a -> b) -> a -> d`
 *
 * This combinator takes three unary functions and a value of any type. The value will be executed from right to left,
 * passing the resulting value from one function to the next.
 * It is also known as the `becard` or, the `B3` combinator.
 *
 * ```js
 * const x = compose3(x => x - 2, x => x * 2, x => x + 2, 42);
 * assertEquals(x, 86);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { compose3 } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = compose3(x => x - 2);
 * const g = f(x => x * 2);
 * const h = g(x => x + 2);
 * const x = h(42);
 * ```
 *
 * ```ts
 * export function compose3 <Y, Z>(f: (y: Y) => Z): <X>(g: (x: X) => Y) => <W>(h: (w: W) => X) => (w: W) => Z;
 * export function compose3 <X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y): <W>(h: (w: W) => X) => (w: W) => Z;
 * export function compose3 <W, X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y, h: (w: W) => X, w: W): Z;
 * ```
 */
export const becard = curryN(4, (f, g, h, x) => f(g(h(x))));
export const compose3 = becard;
export const B3 = becard;

/**
 * #### `constant`
 * `a -> b -> a`
 *
 * This combinator takes two values and returns the first.
 * It is also known as the `kestrel` or, the `K` combinator.
 *
 * ```js
 * const x = constant(42, 24);
 * assertEquals(x, 42);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { constant } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = constant(42);
 * const x = f(24);
 * ```
 *
 * ```ts
 * export function constant <X, Y>(x: X): (y: Y) => X;
 * export function constant <X, Y>(x: X, y: Y): X;
 * ```
 */
export const kestrel = curry2( (x, _) => x);
export const constant = kestrel;
export const first = kestrel;
export const K = kestrel;

/**
 * #### `flip`
 * `(a -> b -> c) -> b -> a -> c`
 *
 * This combinator takes a binary function and two values of any type. The values order will be flipped when calling the
 * binary function.
 * It is also known as the `cardinal` or, the `C` combinator.
 *
 * ```js
 * const x => flip(x => y => x - y, 5, 10);
 * assertEquals(x, 5);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { flip } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const f = flip(x => y => x - y);
 * const g = f(24);
 * const x = g(42);
 * ```
 *
 * ```ts
 * export function flip <X, Y, Z>(f: (x: X) => (y: Y) => Z): (x: X) => (y: Y) => Z;
 * export function flip <X, Y, Z>(f: (x: X) => (y: Y) => Z, x: X, y: Y): Z;
 * ```
 */
export const cardinal = curry3( (f, x, y) => f(y)(x));
export const flip = cardinal;
export const C = cardinal;

export const kite = curry2((x, y) => y);
export const second = kite;

/**
 * #### `identity`
 * `a -> a`
 *
 * The simplest combinator, it takes a value and return it.
 * It is also known as the `idiot` or, the `I` combinator.
 *
 * ```js
 * // @deno-types="https://deno.land/x/functional@v1.3.4/library/aviary.d.ts"
 * import { identity } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
 *
 * const x = identity(42);
 * assertEquals(x, 42);
 * ```
 *
 * ##### TypeScript
 *
 * ```ts
 * export function identity <X>(x: X): X;
 * ```
 */
export const idiot = x => x;
export const identity = idiot;
export const id = idiot;
export const I = idiot;

/**
 * #### `Derivations`
 *
 * What follow is a list of combinators that are derivation of the more common ones. They are often obscure and less
 * known. I took the liberty to name some of them.
 */

/**
 * #### `apBinary`
 * `(b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d`
 *
 * This combinator takes a binary function, two unary functions and a value. The value is applied to the two unary
 * functions. The resulting values are then applied in order to the binary function.
 * It is known as the "startling_" or, the `S_` combinator.
 *
 * ```js
 * const x = apBinary(x => y => x * y, x => x + 2, x => x * 2, 42);
 * assertEquals(3696);
 * ```
 */
export const starling_ = curryN(4, (f, g, h, x) => f(g(x))(h(x)));
export const apBinary = starling_;
export const S_ = starling_;

/**
 * #### `applyBinary`
 * `(a -> b -> c) -> a -> b -> c`
 *
 * This combinator takes a binary function and two values of any type. It applies the values to the function.
 * It is known as the "idiotstarstar" or, the `I$$` combinator.
 *
 * ```js
 * const x = applyBinary(x => y => x + y, 42, 24);
 * assertEquals(x, 66);
 * ```
 */
export const idiotStarStar = curry3((f, x, y) => f(x)(y));
export const applyBinary = idiotStarStar;
export const I$$ = idiotStarStar;

/**
 * #### `applyBinaryCompose`
 * `(a -> b -> d -> e) -> a -> b -> (c -> d) -> c -> e`
 *
 * This combinator takes a ternary function, two values of any type, a unary function and one last value. The first two
 * values are passed to the ternary function. The remaining function is then composed with the partially applied
 * function.
 * It is known as the "dickcissel" or, the "D1" combinator.
 *
 * I have named it "applyBinaryCompose" because it is related to `compose`. It can also be expressed as
 * `compose2(compose2(compose2))`.
 *
 * ```js
 * const x = dickcissel(x => y => z => x + y + z, 42, 24, x => x * 2, 12);
 * assertEquals(x, 90);
 * ```
 */
export const dickcissel = curryN(5, (f, x, y, g, z) => f(x)(y)(g(z)));
export const applyBinaryCompose = dickcissel;
export const D1 = dickcissel;

/**
 * #### `applyCompose`
 * `(a -> c -> d) -> a -> (b -> c) -> b -> d`
 *
 * This combinator takes a binary function, one value of any type, a unary function and one last value. The first
 * value is passed to the binary function. The remaining function is then composed with the partially applied
 * function.
 * It is known as the "dove" or, the "D" combinator.
 *
 * I have named it "applyCompose" because it is related to `compose`. It can also be expressed as
 * `compose2(compose2)`.
 *
 * ```js
 * const x = applyCompose(x => y => x + y, 42, x => x * 2, 24);
 * assertEquals(x, 90);
 * ```
 */
export const dove = curryN(4, (f, x, g, y) => f(x)(g(y)));
export const applyCompose = dove;
export const D = dove;

/**
 * #### `apply2Compose`
 * `(c -> d -> e) -> (a -> c) -> a -> (b -> d) -> b -> e`
 *
 * This combinator takes a binary function, a unary function, one value of any type, another unary function and one
 * last value. The first value is passed to the first unary function and, the second value to the second unary function.
 * The two resulting values are passed to the binary function.
 * It is known as the "dovekie" or, the "D2" combinator.
 *
 * I have named it "apply2Compose" because it is related to `compose`. It can also be expressed as
 * `compose2(compose2, compose2(compose2))`.
 *
 * ```js
 * const x = apply2Compose(x => y => x + y, 42, x => x * 2, 24);
 * assertEquals(x, 90);
 * ```
 */
export const dovekie = curryN(5, (f, g, x, h, y) => f(g(x))(h(y)));
export const apply2Compose = dovekie;
export const D2 = dovekie;

/**
 * #### `applyComposeBinary`
 * `(a -> d -> e) -> a -> (b -> c -> d) -> b -> c -> e`
 *
 * This combinator takes a binary function, a value of any type, a second binary function and, two values of any type.
 * The first value is passed to the first binary function and, the two other values are then passed to the second unary
 * function. The resulting value is then passed to the partially applied function.
 * It is known as the "eagle" or, the "E" combinator.
 *
 * I have named it "applyComposeBinary" because it is related to `compose`. It can also be expressed as
 * `compose2(compose2(compose2, compose2))`.
 *
 * ```js
 * const x = apply2Compose(x => y => x + y, 42, x => x * 2, 24);
 * assertEquals(x, 90);
 * ```
 */
export const eagle = curryN(5, (f, x, g, y, z) => f(x)(g(y)(z)));
export const applyComposeBinary = eagle;
export const E = eagle;

/**
 * #### `applyToFlip`
 * `a -> b -> (b -> a -> c) -> c`
 *
 * This combinator takes two values of any type and, a binary function. The values are flipped in order and, then
 * applied to the binary function.
 * It is known as the "finch" or, the "F" combinator.
 *
 * I have named it "applyToFlip" because it is similar to `applyTo` and `flip`.
 *
 * ```js
 * const x = applyToFlip(24, 42, x => y => x - y);
 * assertEquals(x, 18);
 * ```
 */
export const finch = curry3( (x, y, f) => f(y)(x));
export const applyToFlip = finch;
export const F = finch;

/**
 * #### `applyTernaryFlip`
 * `(c -> b -> a -> d) -> a -> b -> c -> d`
 *
 * This combinator takes a ternary function and, three values. The values are applied to the function in reverse order.
 * It is known as the "finchstar" or, the "F$" combinator.
 *
 * I have named it "applyTernaryFlip" because it is similar to `apply` and `flip`.
 *
 * ```js
 * const x = applyTernaryFlip(x => y => z => x - y - z, 12, 24, 42);
 * assertEquals(x, 6);
 * ```
 */
export const finchStar = curryN(4, (f, x, y, z) => f(z)(y)(x));
export const applyTernaryFlip = finchStar;
export const F$ = finchStar;

/**
 * #### `applyQuaternaryFlip`
 * `(a -> d -> c -> b -> e) -> a -> b -> c -> d -> e`
 *
 * This combinator takes a quaternary function and, four values. The values are applied to the function but the second
 * value and the fourth value are swapped.
 *
 * I have named it `applyQuaternaryFlip` because it is similar to `apply` and `flip` -- also for consistency.
 *
 * ```js
 * const x = applyQuaternaryFlip(w => x => y => z => w - x - y - z, 84, 24, 42, 12);
 * assertEquals(x, 6);
 * ```
 */
export const finchStarStar = curryN(5, (f, w, x, y, z) => f(w)(z)(y)(x));
export const applyQuaternaryFlip = finchStarStar;
export const F$$ = finchStarStar;

/**
 * #### `composeBinary`
 * `(c -> d) -> (a -> b -> c) -> a -> b -> d`
 *
 * This combinator is similar to `compose2`, the difference being that the second argument should be a binary function.
 * It is also known as the `blackbird` or, the `B1` combinator.
 *
 * Other known alias is `oo`; because `composeBinary` is also `compose2(compose2, compose2)`.
 *
 * ```js
 * const x = composeBinary(x => x * 2, x => y => x + y, 42, 24);
 * assertEquals(x, 132);
 * ```
 */
export const blackbird = curryN(4, (f, g, x, y) => f(g(x)(y)));
export const composeBinary = blackbird;
export const oo = blackbird;
export const B1 = blackbird;

/**
 * #### `composeBinaryApBinary`
 * `(e -> f -> g) -> (a -> b -> e) -> a -> b -> (c -> d -> f) -> c -> d -> g`
 *
 * This combinator takes two binary functions, two values of any type, a second binary function and, two more values of
 * any type. The first two values are passed to the second binary function and, the last two values are then passed to
 * the third binary function. Finally, the two resulting values are applied to the first binary function.
 * It is known as the "eaglebald" or, the "Ê" combinator.
 *
 * I have named it "composeBinaryApBinary" because it is related to `compose` reminds me of `ap` in a way.
 * It can also be expressed as
 * `compose2 (compose2 (compose2) (compose2)) (compose2 (compose2 (compose2) (compose2))`... Yeah...
 *
 * ```js
 * const x = composeBinaryApBinary(x => y => x + y, x => y => x * y, 42, 24, x => y => x * y, 12, 4);
 * assertEquals(x, 1056);
 * ```
 */
export const eaglebald = curryN(7, (f, g, w, x, h, y, z) => f(g(w)(x))(h(y)(z)));
export const composeBinaryApBinary = eaglebald;
export const E_ = eaglebald;

/**
 * #### `composeTernary`
 * `(d -> e) -> (a -> b -> c -> d) -> a -> b -> c -> e`
 *
 * This combinator is similar to `compose2`, the difference being that the second argument should be a ternary function.
 * It is also known as the `bunting` or, the `B2` combinator.
 *
 * Other known alias is `ooo`; because the `composeTernary` is also `compose2(compose2, compose2, compose2)(compose2)`.
 *
 * ```js
 * const x => composeTernary(x => x * 2, x => y => z => x + y + z, 42, 24, 12);
 * assertEquals(x, 156);
 * ```
 */
export const bunting = curryN(5, (f, g, x, y, z) => f(g(x)(y)(z)));
export const composeTernary = bunting;
export const ooo = bunting;
export const B2 = bunting;

/**
 * #### `composeFlip`
 * `(b -> c -> d) -> (a -> c) -> a -> b -> d`
 *
 */
export const goldfinch = curryN(4, (f, g, x, y) => f(y)(g(x)));
export const composeFlip = goldfinch;
export const G = goldfinch;

/**
 * #### `duplicateTernary`
 * `(a -> b -> a -> c) -> a -> b -> c`
 */
export const hummingbird = curry3( (f, x, y) => f(x)(y)(x));
export const H = hummingbird;


/**
 * #### `flipAp`
 * `(c -> a -> d) -> (b -> c) -> a -> b -> d`
 *
 * This combinator takes a binary function, an unary function and, two values of any type.
 * Like compose, it should be read from right to left; the last value is applied to the last function. Then, the
 * resulting value is passed to the remaining function with the remaining value but unlike `ap`, the arguments are
 * flipped.
 * It is known as the "cardinal prime", `cardinal_` or, the `C_` combinator; I call it `flipAp` because it's similar to
 * `ap` and is related to `flip`...
 *
 * ```js
 * const x = flipAp(x => y => x * y, x => x + 2, 42, 24);
 * assertEquals(x, 1092);
 * ```
 */
export const cardinal_ = curryN(4, (f, g, x, y) => f(g(y))(x));
export const flipAp = cardinal_;
export const C_ = cardinal_;

/**
 * #### `flipTernary`
 * `(a -> c -> b -> d) -> a -> b -> c -> d`
 *
 * This combinator takes a ternary function, and three values of any type.
 * The first value is applied to the ternary function and, the two other values are flipped than passed to the partially
 * applied function.
 * It is known as the "cardinal once removed", the "cardinal star" (cardinal*) or, the `C*` combinator.
 *
 * Other known alias is `BC`; because it can also be expressed as `compose2(flip)`.
 *
 * ```js
 * const x = flipTernary(x => y => z => x + y - z, 42, 12, 24);
 * assertEquals(x, 54);
 * ```
 */
export const cardinalStar = curryN(4, (f, x, y, z) => f(x)(z)(y));
export const flipTernary = cardinalStar;
export const C$ = cardinalStar;
export const BC = cardinalStar;

/**
 * #### `flipQuaternary`
 * `(a -> b -> d -> c -> e) -> a -> b -> c -> d -> e`
 *
 * This combinator takes a quaternary function, and four values of any type.
 * The first two values are applied to the quaternary function and, the two other values are flipped than passed to the
 * partially applied function.
 * It is known as the "cardinal twice removed", the "cardinal star star" (cardinal**) or, the `C**` combinator.
 *
 * ```js
 * const x = flipQuaternary(w => x => y => z => w * x + y - z, 42, 24, 2, 12);
 * assertEquals(x, 1018);
 * ```
 */
export const cardinalStarStar = curryN(5, (f, w, x, y, z) => f(w)(x)(z)(y));
export const flipQuaternary = cardinalStarStar;
export const C$$ = cardinalStarStar;

/**
 * #### `thunk`
 * `(a -> c) -> a -> b -> c`
 */
export const jalt = curry3((f, x, _) => f(x));

/**
 * #### `thunkBinary`
 * `(a -> b -> d) -> a -> b -> c -> d`
 */
export const jalt_ = curryN(4, (f, x, y, _) => f(x)(y));

/**
 * #### `selfApply`
 * `(a -> b -> b) -> a -> b -> a -> b`
 *
 *
 */
export const jay = curryN(4, (f, x, y, z) => f(x)(f(z)(y)));

// I'm not good enough at meta mathematics to give a good use case for that one...
export const owl = curry2((f, g) => g(f(g)));

export const phoenix = curryN(4, (f, g, h, x) => f(g(x))(h(x)));

export const psi = curryN(4, (f, g, x, y) => f(g(x))(g(y)));

export const quacky = curry3((x, f, g) => g(f(x)));
export const applyToPipe = quacky;

export const queer = curry3((f, g, x) => g(f(x)));
export const pipe = queer;

export const quirky = curry3((f, x, g) => g(f(x)));
export const applyPipe = quirky;

export const quixotic = curry3((f, x, g) => f(g(x)));

export const quizzical = curry3((x, f, g) => f(g(x)));

export const robin = curry3((x, f, y) => f(y)(x));

export const robinstar = curryN(4, (f, x, y, z) => f(y)(z)(x));

export const robinstarstar = curryN(5, (f, w, x, y, z) => f(w)(y)(z)(x));

/**
 * ## `applyToBinary`
 * `a -> b -> (a -> b -> c) -> c`
 */
export const vireo = curry3((x, y, f) => f(x)(y));
export const applyToBinary = vireo;
export const V = vireo;

export const vireostar = curryN(4, (f, x, y, z) => f(y)(x)(z));

export const vireostarstar = curryN(5, (f, w, x, y, z) => f(w)(z)(x)(y));

/**
 * #### `duplicate`
 * `(a -> a -> b) -> a -> b`
 *
 */
export const warbler = curry2((f, x) => f(x)(x));
export const duplicate = warbler;
export const W = warbler;

export const warbler_ = curry2((x, f) => f(x)(x));

export const warblerstar = curry3((f, x, y) => f(x)(y)(y));

export const warblerstarstar = curryN(4, (f, x, y, z) => f(x)(y)(z)(z));
