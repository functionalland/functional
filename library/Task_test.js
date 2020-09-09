import { assert } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { assertIsEquivalent } from "./asserts.js";
import Either from "./Either.js";
import Task from "./Task.js";

const add = x => x + 2;
const multiply = x => x * 2;

Deno.test(
  "Task: #map (promise)",
  () => {
    let count = 0;
    const containerA = Task(_ => ++count && Promise.resolve(Either.Right(42)));
    assert(Task.is(containerA));

    const containerB = containerA.map(add);
    const containerC = containerB.map(multiply);

    assert(Task.is(containerB));
    assert(Task.is(containerC));
    assert(count === 0);

    const promiseA = containerB.run();
    const promiseB = containerC.run();
    const promiseC = containerC.run();

    assert(promiseA instanceof Promise);
    assert(promiseB instanceof Promise);
    assert(count === 3);

    return Promise.all([
      promiseA
        .then(container => assertIsEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertIsEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertIsEquivalent(container, Either.Right(88)))
    ]);
  }
);

Deno.test(
  "Task: #map - Identity",
  async () => {
    const containerA = Task(_ => Promise.resolve(Either.Right(42)));

    const containerB = await containerA.map(value => value).run();
    const containerC = await containerA.run();

    assertIsEquivalent(containerB, containerC);
  }
);

Deno.test(
  "Task: #map - Composition",
  async () => {
    const containerA = Task(_ => Promise.resolve(Either.Right(42)));

    const containerB = await containerA.map(add).map(multiply).run();
    const containerC = await containerA.map(value => multiply(add(value))).run()

    assertIsEquivalent(containerB, containerC);
  }
);

Deno.test(
  "Task: #chain (promise)",
  () => {
    let count = 0;
    const containerA = Task(_ => ++count && Promise.resolve(Either.Right(42)));
    assert(Task.is(containerA));

    const containerB = containerA.chain(value => Task(_ => add(value)));
    const containerC = containerB.chain(value => Task(_ => multiply(value)));

    assert(Task.is(containerB));
    assert(Task.is(containerC));
    assert(count === 0);

    const promiseA = containerB.run();
    const promiseB = containerC.run();
    const promiseC = containerC.run();

    assert(promiseA instanceof Promise);
    assert(promiseB instanceof Promise);
    assert(promiseC instanceof Promise);
    assert(count === 3);

    return Promise.all([
      promiseA
        .then(container => assertIsEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertIsEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertIsEquivalent(container, Either.Right(88)))
    ]);
  }
);

Deno.test(
  "Task: #chain - Associativity",
  async () => {
    const containerA = Task(_ => Promise.resolve(Either.Right(42)));
    const chainAdd = value => Task(_ => add(value));
    const chainMultiply = value => Task(_ => multiply(value));

    const containerB = await containerA.chain(chainAdd).chain(chainMultiply).run();
    const containerC = await containerA.chain(value => chainAdd(value).chain(chainMultiply)).run()

    assertIsEquivalent(containerB, containerC);
  }
);

Deno.test(
  "Task: #wrap",
  () => {
    let count = 0;
    const containerA = Task.wrap(_ => ++count && Promise.resolve(Either.Right(42)));
    assert(Task.is(containerA));

    const containerB = containerA.map(add);
    const containerC = containerB.map(multiply);

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
        .then(container => assertIsEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertIsEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertIsEquivalent(container, Either.Right(88)))
    ]);
  }
);

Deno.test(
  "Task: #wrap (no container)",
  () => {
    let count = 0;
    const containerA = Task.wrap(_ => ++count && Promise.resolve(42));
    assert(Task.is(containerA));

    const containerB = containerA.map(add);
    const containerC = containerB.map(multiply);

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
        .then(container => assertIsEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertIsEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertIsEquivalent(container, Either.Right(88)))
    ]);
  }
);