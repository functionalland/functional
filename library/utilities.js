import { blue, gray, red } from "https://deno.land/std@0.79.0/fmt/colors.ts";

import { append, curry, lift, reduce } from "https://x.nest.land/ramda@0.27.0/source/index.js";

const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();

export const assertIsArray = value => value instanceof Array;
export const assertIsBoolean = value => value === true || value === false;
export const assertIsInstance = curry((T, value) => value instanceof T);
export const assertIsNull = value => value === null;
export const assertIsNumber = value => typeof value === "number";
export const assertIsObject = value => typeof value === "object" && !(value instanceof Array);
export const assertIsRegex = value => value instanceof RegExp;
export const assertIsString = value => typeof value === "string";
export const assertIsUndefined = value => value === undefined;

export const decodeRaw = $$decoder.decode.bind($$decoder);
export const encodeText = $$encoder.encode.bind($$encoder);

// chainLift :: (a -> b -> c) -> Task a -> Task b -> Task c
export const chainLift = curry(
  (binaryFunction, chainableFunctor, functor) => chainableFunctor.chain(x => functor.map(binaryFunction(x)))
);

// chainRec :: (a -> c, b -> c, a) -> a -> Task b -> Task c
export const chainRec = curry(
  (ternaryFunction, initiator, task) => task.chainRec(ternaryFunction, initiator)
);

// insideOut :: Applicative a => a -> a[] -> a
export const insideOut = curry(
  (T, list) => list.reduce(
    (accumulator, x) => lift(append)(x, accumulator),
    T.of([])
  )
);

// log :: String -> a -> a
export const log = message => x => console.debug(blue(message), x) || x;

// runSequentially :: (...Task) -> Task
export const runSequentially = (initialTask, ...taskList) => reduce(
  (accumulator, task) => accumulator.chain(_ => task),
  initialTask,
  taskList
);

// safeExtract :: String -> Either a -> a
export const safeExtract = curry(
  (message, container) => container.fold({
    Left: error => {
      throw new Error(`${message} Error: ${
        (error.hasOwnProperty('raw'))
          ? new TextDecoder().decode(error.raw)
          : `${red(error.message)}\n${gray(error.stack)}`
      }`)
    },
    Right: value => value
  })
);

// stream :: ((a, b) -> a) -> a -> AsyncIterable b -> a
export const stream = curry(
  async (composedFunction, accumulator, iterator) => {
    for await (const data of iterator) {
      accumulator = composedFunction(accumulator, data);
    }

    return accumulator;
  }
);
