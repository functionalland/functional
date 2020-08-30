import { factorizeType } from "./SumType.js";

export const IO = factorizeType("IO", [ "asyncFunction" ]);

IO.empty = _ => IO(_ => null);
IO.from = (composedFunction) => IO(composedFunction);
IO.of = value => IO(_ => value);

// ap :: IO a ~> IO (a -> b) -> IO b
IO.prototype.ap = function (container) {

  return container.map(unaryFunction => unaryFunction(this.asyncFunction()));
};

// chain :: IO a ~> (a -> IO b) -> IO b
IO.prototype.chain = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction())).run();
};

// map :: IO a ~> (a -> b) -> IO b
IO.prototype.map = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction()));
};

// run :: IO a ~> () -> b
IO.prototype.run = function () {

  return this.asyncFunction();
};

export default IO;