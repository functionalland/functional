// @deno-types="./Either.d.ts"
import Either from "./Either.js";
// @deno-types="./Task.d.ts"
import Task, { factorizeTask } from "./Task.js";
import { assert, assertEquals, assertEquivalent, test } from "./testing.ts";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";
// @deno-types="./utilities.d.ts"
import { evert } from "./utilities.js";

test ("Task: initialize")
  (() => {
    assert (Task (() => Promise.resolve(42)));
    assert (Task (() => 42));
    assert (Task (() => (x: number) => x * 2));
    assert (Task (() => Promise.resolve((x: number) => x * 2)));
  });

test ("Task: #ap")
  (async () => {
    assertEquivalent
      ("The Task's value is multiplied by two.")
      (await Task.of(42).ap(Task.of((x: number) => x * 2)).run())
      (await Task.of(84).run());
    assertEquivalent
      ("Composition law.")
      (await Task.of(42)
        .ap(Task.of((x: number) => x * 2).ap(Task.of((x: number) => x + 2).map(compose2))).run())
      (await Task.of(42).ap(Task.of((x: number) => x * 2)).ap(Task.of((x: number) => x + 2)).run());
  });

test ("Task: #chain")
  (async () => {
    assertEquivalent
      ("The Task's value is multiplied by two.")
      (await Task.of(42).chain((x: number) => Task.of(x * 2)).run())
      (await Task.of(84).run());
    assertEquivalent
      ("Associativity law.")
      (await Task.of(42).chain
        ((x: number) => Task.of(x * 2).chain((x: number) => Task.of(x + 2))).run())
      (await Task.of(42).chain
        ((x: number) => Task.of(x * 2)).chain((x: number) => Task.of(x + 2)).run());
  });

test ("Task: #map")
  (async () => {
    assertEquivalent
      ("The Task's value is multiplied by two.")
      (await Task.of(42).map((x: number) => x * 2).run())
      (await Task.of(84).run());
    assertEquivalent
      ("Identity law.")
      (await Task.of(42).map(identity).run())
      (await Task.of(42).run());
    assertEquivalent
      ("Composition law.")
      (await Task.of(42).map
        ((x: number) => compose2<number, number, number> ((x: number) => x + 2) ((x: number) => x * 2) (x)).run())
      (await Task.of(42).map((x: number) => x * 2).map((x: number) => x + 2).run());
  });

test ("Task: #of")
  (async () =>
    assertEquivalent
      ("A Task is factorized with the value.")
      (await Task.of(42).run())
      (Either.Right(42))
  );

test ("factorizeTask")
  (async () =>
    assertEquivalent
      ("A Task is factorized with the value.")
      (await factorizeTask (42).run())
      (await Task.of(42).run())
  );

test ("Task: #wrap")
  (() => {
    let count = 0;
    const containerA = Task.wrap(() => ++count && Promise.resolve(Either.Right(42)));
    assert(Task.is(containerA));

    const containerB = containerA.map(x => x + 2);
    const containerC = containerB.map(x => x * 2);

    assert(Task.is(containerB));
    assert(Task.is(containerC));
    assert(count === 0);

    const promiseA = containerB.run();
    const promiseB = containerC.run();
    const promiseC = containerC.run();

    assert(promiseA instanceof Promise);
    assert(promiseB instanceof Promise);
    assert(count === 1);

    return Promise.all([
      promiseA
        .then(container => assertEquivalent (container) (Either.Right(44))),
      promiseB
        .then(container => assertEquivalent (container) (Either.Right(88))),
      promiseC
        .then(container => assertEquivalent (container) (Either.Right(88)))
    ]);
  });

test ("Task: with evert")
  (async () => {
    assertEquivalent
      (await evert(Task, [ 42, 32, 23 ].map((x: number) => Task.of(x * 2))).run())
      (Either.Right([ 84, 64, 46 ]));
  });


test ("Task: debug")
  (async () => {
    assertEquals
      ("Simple function")
      (Task.wrap(() => Promise.resolve(42)).toString())
      ("Task(() => Promise.resolve(42))");
    assertEquals
      ("Truncated function")
      (Task.wrap(() => Promise.resolve(2 * 2 * 2 * 2 * 2)).toString())
      ("Task(() => Promise.resolve(2 *[...])");
    assertEquals
      ("Map")
      (Task.wrap(() => Promise.resolve(42)).map((x: number) => x * 2).toString())
      ("Task(() => Promise.resolve(42)).map((x) => x * 2)");
    assertEquals
      ("Chain")
      (Task.wrap(() => Promise.resolve(42)).chain((x: number) => Task.of(x * 2)).toString())
      ("Task(() => Promise.resolve(42)).chain((x) => Task.of(x * 2))");
    assertEquals
      ("Ap")
      (Task.wrap(() => Promise.resolve(42)).ap(Task.of((x: number) => x * 2)).toString())
      ("Task(() => Promise.resolve(42)).ap(Task((x) => x * 2))");
  });
