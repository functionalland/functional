import { curry } from "https://x.nest.land/ramda@0.27.0/source/index.js";

// stream :: ((a, b) -> a) -> a -> AsyncIterable b -> a
export const stream = curry(
  async (composedFunction, accumulator, iterator) => {
    for await (const data of iterator) {
      accumulator = composedFunction(accumulator, data);
    }

    return accumulator;
  }
);