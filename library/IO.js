import { factorizeType } from "./SumType.js";

export const IO = factorizeType("IO", [ "asyncFunction" ]);

IO.empty = _ => IO(_ => null);

IO.of = IO.prototype.of = IO.prototype["fantasy-land/of"] = value => IO(_ => value);

IO.prototype.ap = IO.prototype["fantasy-land/ap"] = function (container) {

  //   return IO.is(container) ? IO(_ => container.asyncFunction(this.asyncFunction())) : container
  return container.map(unaryFunction => unaryFunction(this.asyncFunction()));
};

IO.prototype.chain = IO.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction())).run();
};

IO.prototype.map = IO.prototype["fantasy-land/map"] = function (unaryFunction) {

  return IO(_ => unaryFunction(this.asyncFunction()));
};

IO.prototype.run = function () {

  return this.asyncFunction();
};

export default IO;