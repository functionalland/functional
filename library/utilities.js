import lift from "https://deno.land/x/ramda@v0.27.2/source/lift.js";

import { curry2, curry3 } from "./curry.js";
import { reduce } from "./algebraic.js";
import { append, find } from "./other.js";

const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();

export const decodeRaw = $$decoder.decode.bind($$decoder);
export const encodeText = $$encoder.encode.bind($$encoder);

/**
 * ### `evert`
 * `Applicative a => a -> a[] -> a`
 *
 * This function takes a type constructor and, a list of Applicative functor and evert it; effectively making an Applicative
 * functor of a list of value.
 *
 * ```js
 * import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
 * import { evert } from "https://deno.land/x/functional@v1.3.4/library/utilities.js";
 *
 * const container = await evert(Task, [ Task.of(42), Task.of(32), Task.of(24) ]).run();
 *
 * const list = safeExtract("Failed.", container);
 *
 * assertEquals(list, [ 42, 32, 24 ]);
 * ```
 */
export const evert = curry2(
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
 * import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
 * import { runSequentially } from "https://deno.land/x/functional@v1.3.4/library/utilities.js";
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
export const safeExtract = curry2(
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
export const stream = curry3(
  async (binaryFunction, accumulator, iterator) => {
    for await (const data of iterator) {
      accumulator = binaryFunction(accumulator, data);
    }

    return accumulator;
  }
);


