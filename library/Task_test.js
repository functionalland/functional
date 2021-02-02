import Either from "./Either.js";
import Pair from "./Pair.js";
import Task from "./Task.js";
import { safeExtract } from "./utilities.js";
import { assert, assertEquals, assertEquivalent } from "./testing.ts";

const add = x => x + 2;
const multiply = x => x * 2;

Deno.test(
  "Task: #ap (promise)",
  () => {
    const containerA = Task.of(42);
    const containerB = Task.of(x => x * x);
    assert(Task.is(containerA));
    assert(Task.is(containerB));

    const containerC = containerA.ap(containerB);
    assert(Task.is(containerC));

    const promise = containerC.run();
    assert(promise instanceof Promise);

    return promise
      .then(container => assertEquivalent(container, Either.Right(1764)));
  }
);

Deno.test(
  "Task: #ap - Composition",
  async () => {
    const containerA = Task.of(42);
    const containerB = Task.of(add);
    const containerC = Task.of(multiply);
    assert(Task.is(containerA));
    assert(Task.is(containerB));
    assert(Task.is(containerC));

    const containerD = await containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).run();
    const containerE = await containerA.ap(containerB).ap(containerC).run();
    assert(Either.is(containerD));
    assert(Either.is(containerE));

    assertEquivalent(containerD, containerE);
  }
);

Deno.test(
  "Task: #ap with lift",
  async () => {
    const lift2 = (f, a, b) => b.ap(a.map(f));

    const containerA = Task.of(42);
    const containerB = Task.of(32);
    const containerC = Task.of(x => y => x * y);
    assert(Task.is(containerA));
    assert(Task.is(containerB));
    assert(Task.is(containerC));

    const containerD = await lift2(x => y => x * y, containerA, containerB).run();
    assert(Either.is(containerD));

    assertEquivalent(containerD, Either.Right(1344));
  }
);

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
        .then(container => assertEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertEquivalent(container, Either.Right(88)))
    ]);
  }
);

Deno.test(
  "Task: #map - Identity",
  async () => {
    const containerA = Task(_ => Promise.resolve(Either.Right(42)));

    const containerB = await containerA.map(value => value).run();
    const containerC = await containerA.run();

    assertEquivalent(containerB, containerC);
  }
);

Deno.test(
  "Task: #map - Composition",
  async () => {
    const containerA = Task(_ => Promise.resolve(Either.Right(42)));

    const containerB = await containerA.map(add).map(multiply).run();
    const containerC = await containerA.map(value => multiply(add(value))).run()

    assertEquivalent(containerB, containerC);
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
        .then(container => assertEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertEquivalent(container, Either.Right(88)))
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

    assertEquivalent(containerB, containerC);
  }
);

Deno.test(
  "Task: #chainRec",
  async () => {
    const container = Task.of([ 0 ]).chainRec(
      (Loop, Done, cursor) =>
        cursor === 10 ? Done(Pair(cursor, null)) : Loop(Pair(cursor + 1, Task.of([ 42 * (cursor + 1) ]))),
      0
    );

    assert(Task.is(container));

    const value = safeExtract("Failed.", await container.run());

    assertEquals(value, [ 0, 42, 84, 126, 168, 210, 252, 294, 336, 378, 420 ]);
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
        .then(container => assertEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertEquivalent(container, Either.Right(88)))
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
        .then(container => assertEquivalent(container, Either.Right(44))),
      promiseB
        .then(container => assertEquivalent(container, Either.Right(88))),
      promiseC
        .then(container => assertEquivalent(container, Either.Right(88)))
    ]);
  }
);

Deno.test(
  "Task: Parallel",
  async () => {
    const append = x => accumulator => [ ...accumulator, x ];
    const lift2 = (f, a, b) => b.ap(a.map(f));
    const insideOut = (T, list) => list.reduce(
      (accumulator, x) => lift2(append, x, accumulator),
      T.of([])
    );
    const f = x => Task(_ => Promise.resolve(Either.Right(x * 2)));

    const containerA = insideOut(Task, [ 42, 32, 23 ].map(f));

    assert(Task.is(containerA));

    const promise = containerA.run();

    assert(promise instanceof Promise);

    const containerB = await promise;

    assertEquivalent(containerB, Either.Right([ 84, 64, 46 ]))
  }
);

Deno.test(
  "Task: debug",
  () => {
    const containerA = Task.wrap(_ => Promise.resolve(42));
    assertEquals(
      containerA.toString(),
      "Task(_ => Promise.resolve(42))"
    );

    const containerB = Task.wrap(_ => Promise.resolve(2 * 2 * 2 * 2 * 2));
    assertEquals(
      containerB.toString(),
      "Task(_ => Promise.resolve(2 * [...])"
    );

    const containerC = Task.wrap(_ => Promise.resolve(42))
      .map(x => x * 2);
    assertEquals(
      containerC.toString(),
      "Task(_ => Promise.resolve(42)).map(x => x * 2)"
    );

    const containerD = Task.wrap(_ => Promise.resolve(42))
      .chain(x => Task.of(x * 2));
    assertEquals(
      containerD.toString(),
      "Task(_ => Promise.resolve(42)).chain(x => Task.of(x * 2))"
    );

    const containerE = Task.wrap(_ => Promise.resolve(42))
      .ap(Task.of(x => x * 2));
    assertEquals(
      containerE.toString(),
      "Task(_ => Promise.resolve(42)).ap(Task(x => x * 2))"
    );
  }
);
