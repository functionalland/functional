import { blue, gray, red } from "https://deno.land/std@0.76.0/fmt/colors.ts";
import { append, compose, curry, map, lift } from "https://x.nest.land/ramda@0.27.0/source/index.js";

const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();

export const assertIsRegex = pattern => pattern instanceof RegExp;

export const decodeRaw = $$decoder.decode.bind($$decoder);
export const encodeText = $$encoder.encode.bind($$encoder);

export const insideOut = curry(
  (T, list) => list.reduce(
    (accumulator, x) => lift(append)(x, accumulator),
    T.of([])
  )
);

// log :: String -> a -> a
export const log = message => x => console.debug(blue(message), x) || x;

export const mapBuffer = unaryFunction => map(compose(encodeText, unaryFunction, decodeRaw));

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
