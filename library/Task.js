import { factorizeType } from "./SumType.js";
import Either from "./Either.js";

const $$value = Symbol.for("TypeValue");

export const Task = factorizeType("Task", [ "asyncFunction" ]);

Task.empty = _ => Task(_ => null);
Task.from = (composedFunction) => Task(composedFunction);
Task.of = value => Task(_ => value);
// wrap :: Task => (* -> Promise a) -> Task e Promise a
Task.wrap = asyncFunction => {
  let promise;
  const proxyFunction = function (...argumentList) {
    promise = promise || asyncFunction.call(null, ...argumentList);

    return promise.then(
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
  };

  return Task(
    Object.defineProperty(
      proxyFunction,
      'length',
      { value: asyncFunction.length }
    )
  );
};

Task.prototype.alt = Task.prototype["fantasy-land/alt"] = function (container) {

  return Task(_ => {

    return thatContainer.fold({
      Left: _ => container,
      Right: _ => this
    });
  });
};

// ap :: Task a ~> Task (a -> b) -> Task b
Task.prototype.ap = Task.prototype["fantasy-land/ap"] = function (container) {

  return container.chain(unaryFunction => this.map(unaryFunction));

  // return container.map(unaryFunction => {
  //   const promise = this.asyncFunction();
  //
  //   return (promise instanceof Promise)
  //     ? promise.then(value => Either.Right(unaryFunction(value)), Either.Left)
  //     : unaryFunction(promise);
  // });
};

// chain :: Task e a ~> (a -> Task b) -> Task e b
Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function (unaryFunction) {

  return Task(_ => {
    const maybePromise = this.asyncFunction();

    return (
      (maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise)
    )
      .then(maybeContainer =>
        (Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer))
          .chain(
            value => {
              const maybePromise = unaryFunction(value).run();

              return (
                (maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise)
              )
                .then(
                  maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
                  maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer),
                )
            })
      )
      .catch(Either.Left);
  });
};

// map :: Task e a ~> (a -> b) -> Task e b
Task.prototype.map = Task.prototype["fantasy-land/map"] = function (unaryFunction) {

  return Task(_ => {
    const promise = this.asyncFunction();

    return promise.then(
      container => container.chain(
        value => {
          const maybeContainer = unaryFunction(value);

          return (Either.is(maybeContainer)) ? maybeContainer : Either.Right(maybeContainer);
        }
      ),
      Either.Left
    );
  });
};

Task.prototype.then = function (unaryFunction) {

  return Task(_ => {
    const promise = this.asyncFunction();

    return (promise instanceof Promise)
      ? promise.then(
        container => Either.Right(container.fold({
          Right: unaryFunction,
          Left: _ => container
        })),
        Either.Left.of
      )
      : unaryFunction(promise);
  });
};

Task.prototype.catch = function (unaryFunction) {

  return Task(_ => {
    const value = this.asyncFunction();

    return (value instanceof Promise)
      ? value.then(
        Either.Right.of,
        container => (
          Either.Left.is(container) ? container : Either.Left(container)
        ).fold({
          Right: _ => container,
          Left: unaryFunction
        }),

      )
      : unaryFunction(value);
  });
};

// run :: Task a ~> () -> Promise b
Task.prototype.run = async function () {
  const maybePromise = this.asyncFunction();

  return ((maybePromise instanceof Promise) ? maybePromise : Promise.resolve(maybePromise))
    .then(
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer),
      maybeContainer => Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
};

export default Task;