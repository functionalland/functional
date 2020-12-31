import append from "https://deno.land/x/ramda@v0.27.2/source/append.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import lift from "https://deno.land/x/ramda@v0.27.2/source/lift.js";
import reduce from "https://deno.land/x/ramda@v0.27.2/source/reduce.js";

const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();

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
export const assertIsInstance = curry((T, value) => value instanceof T);
export const assertIsNull = value => value === null;
export const assertIsNumber = value => typeof value === "number";
export const assertIsObject = value => typeof value === "object" && !(value instanceof Array);
export const assertIsRegex = value => value instanceof RegExp;
export const assertIsString = value => typeof value === "string";
export const assertIsUndefined = value => value === undefined;

export const decodeRaw = $$decoder.decode.bind($$decoder);
export const encodeText = $$encoder.encode.bind($$encoder);

/**
 * ### `alt`
 * `Alt a -> Alt b -> Alt a|b`
 *
 * This function takes a container of any type and, an Alternative functor. Then it returns either the container or the
 * alternative functor.
 * The function is in support of the [Alt algebra](https://github.com/fantasyland/fantasy-land#alt).
 *
 * ```js
 * import Either from "https://deno.land/x/functional@v1.3.2/library/Either.js";
 * import { alt } from "https://deno.land/x/functional@v1.3.2/library/utilities.js";
 *
 * const container = alt(Either.Right(42), Either.Left("Not the meaning of life"));
 *
 * assertEquals(container.extract(), 42);
 * ```
 */
export const alt = curry(
  (container, alternativeFunctor) =>
    (alternativeFunctor.alt || alternativeFunctor["fantasy-land/alt"]).call(alternativeFunctor, container)
);

/**
 * ### `chainLift`
 * `(a -> b -> c) -> Chainable a -> Functor b -> Chainable c`
 *
 * This function is similar to [`lift`](https://ramdajs.com/docs/#lift) but is chainable.
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.2/library/Task.js";
 * import { chainLift } from "https://deno.land/x/functional@v1.3.2/library/utilities.js";
 *
 * const hogeFuga = useWith(
 *   chainLift(curry((x, y) => Task.of(x * y))),
 *   [
 *     x => Task.of(x),
 *     x => Task.of(x)
 *   ]
 * );
 *
 * const container = await hogeFuga(42, 24).run();
 *
 * const value = safeExtract("Failed.", container);
 *
 * assertEquals(value, 1008);
 * ```
 */
export const chainLift = curry(
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
 * import Task from "https://deno.land/x/functional@v1.3.2/library/Task.js";
 * import { chainRec } from "https://deno.land/x/functional@v1.3.2/library/utilities.js";
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
export const chainRec = curry(
  (ternaryFunction, initiator, chainableRecursiveFunctor) =>
    (chainableRecursiveFunctor.chainRec || chainableRecursiveFunctor["fantasy-land/chainRec"])
      .call(chainableRecursiveFunctor, ternaryFunction, initiator)
);

/**
 * ### `evert`
 * `Applicative a => a -> a[] -> a`
 *
 * This function takes a type constructor and, a list of Applicative functor and evert it; effectively making an Applicative
 * functor of a list of value.
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.2/library/Task.js";
 * import { evert } from "https://deno.land/x/functional@v1.3.2/library/utilities.js";
 *
 * const container = await evert(Task, [ Task.of(42), Task.of(32), Task.of(24) ]).run();
 *
 * const list = safeExtract("Failed.", container);
 *
 * assertEquals(list, [ 42, 32, 24 ]);
 * ```
 */
export const evert = curry(
  (T, list) => list.reduce(
    (accumulator, x) => lift(append)(x, accumulator),
    T.of([])
  )
);

export const insideOut = evert;

/**
 * ### `log`
 * `String -> a -> a`
 *
 * This function is a composable `console.debug`. It takes a message, a value and, return the value.
 */
export const log = message => x => console.debug(message, x) || x;

/**
 * ### `runSequentially`
 * `Chain c => (...c) -> c`
 *
 * This function takes n Chainable functor and chain them automatically.
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.2/library/Task.js";
 * import { runSequentially } from "https://deno.land/x/functional@v1.3.2/library/utilities.js";
 *
 * const fuga = converge(
 *   runSequentially,
 *   [
 *     x => Task.of(x * 2),
 *     x => Task.of(x + 2)
 *   ]
 * );
 *
 * const container = await fuga(42).run();
 *
 * const value = safeExtract("Failed.", container);
 *
 * assertEquals(value, 44);
 * ```
 */
export const runSequentially = (initialChainableFunctor, ...chainableFunctorList) => reduce(
  (accumulator, chainableFunctor) => accumulator.chain(_ => chainableFunctor),
  initialChainableFunctor,
  chainableFunctorList
);

/**
 * ### `safeExtract`
 * `String -> Either a -> a`
 *
 * This function takes a message and an Either container; if the container is `Either.Right`, the value will be
 * returned. But if the container is `Either.Left`, it will throw an error with the message passed.
 */
export const safeExtract = curry(
  (message, container) => container.fold({
    Left: error => {
      throw new Error(`${message} Error: ${
        (error.hasOwnProperty('raw'))
          ? decodeRaw(error.raw)
          : `${error.message}\n${error.stack}`
      }`)
    },
    Right: value => value
  })
);

/**
 * ### `stream`
 * `((a, b) -> a) -> a -> AsyncIterable b -> a`
 */
export const stream = curry(
  async (composedFunction, accumulator, iterator) => {
    for await (const data of iterator) {
      accumulator = composedFunction(accumulator, data);
    }

    return accumulator;
  }
);
