import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { assertIsDefined, assertIsEquivalent, assertIsNone } from "./asserts.js";
import { factorizeSumType } from "./SumType.js";

export const IO = factorizeSumType(
  "IO",
  {
    Nothing: [],
    Just: [ "asyncFunction" ]
  }
);

IO.from = (composedFunction) => IO(composedFunction);
IO.of = value => IO(() => value);

// chain :: IO a => a ~> (a -> b) -> b
IO.prototype.chain = function (composedFunction) {

  return composedFunction(this.asyncFunction);
};

// map :: IO a => a ~> (a -> b) -> IO b
IO.prototype.map = function (composedFunction) {

  // Have to handle #catch, ideally without entangle with Response.`error`
  return IO(() => composedFunction(this.asyncFunction()));
};

// run :: IO a => a ~> () -> Promise b
IO.prototype.run = function () {

  return this.asyncFunction();
};