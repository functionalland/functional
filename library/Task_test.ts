// @deno-types="./Either.d.ts"
import Either from "./Either.js";
// @deno-types="./Task.d.ts"
import Task, { factorizeTask } from "./Task.js";
import { assert, assertEquals, assertEquivalent, test } from "./testing.ts";
// @deno-types="./aviary.d.ts"
import { compose2, identity } from "./aviary.js";

test ("Task: initialize")
  (() => {
    assert (Task (() => Promise.resolve(42)));
    assert (Task (() => 42));
    assert (Task (() => (x: number) => x * 2));
    assert (Task (() => Promise.resolve((x: number) => x * 2)));
  });

// test ("Task: #ap")
//   (async () => {
//     assertEquivalent
//       ("The Task's value is multiplied by two.")
//       (await Task.of(42).ap(Task.of((x: number) => x * 2)).run())
//       (await Task.of(84).run());
//     assertEquivalent
//       ("Composition law.")
//       (await Task.of(42)
//         .ap(Task.of((x: number) => x * 2).ap(Task.of((x: number) => x + 2).map(compose2))).run())
//       (await Task.of(42).ap(Task.of((x: number) => x * 2)).ap(Task.of((x: number) => x + 2)).run());
//   });

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
      ("A Box is factorized with the value.")
      (await factorizeTask (() => 42).run())
      (await Task.of(42).run())
  );

// const add = x => x + 2;
// const multiply = x => x * 2;

// Deno.test(
//   "Task: #ap (promise)",
//   () => {
//     const containerA = Task.of(42);
//     const containerB = Task.of(x => x * x);
//     assert(Task.is(containerA));
//     assert(Task.is(containerB));
//
//     const containerC = containerA.ap(containerB);
//     assert(Task.is(containerC));
//
//     const promise = containerC.run();
//     assert(promise instanceof Promise);
//
//     return promise
//       .then(container => assertEquivalent(container, Either.Right(1764)));
//   }
// );
//
// Deno.test(
//   "Task: #ap - Composition",
//   async () => {
//     const containerA = Task.of(42);
//     const containerB = Task.of(add);
//     const containerC = Task.of(multiply);
//     assert(Task.is(containerA));
//     assert(Task.is(containerB));
//     assert(Task.is(containerC));
//
//     const containerD = await containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).run();
//     const containerE = await containerA.ap(containerB).ap(containerC).run();
//     assert(Either.is(containerD));
//     assert(Either.is(containerE));
//
//     assertEquivalent(containerD, containerE);
//   }
// );
//
// Deno.test(
//   "Task: #ap with lift",
//   async () => {
//     const lift2 = (f, a, b) => b.ap(a.map(f));
//
//     const containerA = Task.of(42);
//     const containerB = Task.of(32);
//     const containerC = Task.of(x => y => x * y);
//     assert(Task.is(containerA));
//     assert(Task.is(containerB));
//     assert(Task.is(containerC));
//
//     const containerD = await lift2(x => y => x * y, containerA, containerB).run();
//     assert(Either.is(containerD));
//
//     assertEquivalent(containerD, Either.Right(1344));
//   }
// );
//
// Deno.test(
//   "Task: #map (promise)",
//   () => {
//     let count = 0;
//     const containerA = Task(_ => ++count && Promise.resolve(Either.Right(42)));
//     assert(Task.is(containerA));
//
//     const containerB = containerA.map(add);
//     const containerC = containerB.map(multiply);
//
//     assert(Task.is(containerB));
//     assert(Task.is(containerC));
//     assert(count === 0);
//
//     const promiseA = containerB.run();
//     const promiseB = containerC.run();
//     const promiseC = containerC.run();
//
//     assert(promiseA instanceof Promise);
//     assert(promiseB instanceof Promise);
//     assert(count === 3);
//
//     return Promise.all([
//       promiseA
//         .then(container => assertEquivalent(container, Either.Right(44))),
//       promiseB
//         .then(container => assertEquivalent(container, Either.Right(88))),
//       promiseC
//         .then(container => assertEquivalent(container, Either.Right(88)))
//     ]);
//   }
// );
//
// Deno.test(
//   "Task: #map - Identity",
//   async () => {
//     const containerA = Task(_ => Promise.resolve(Either.Right(42)));
//
//     const containerB = await containerA.map(value => value).run();
//     const containerC = await containerA.run();
//
//     assertEquivalent(containerB, containerC);
//   }
// );
//
// Deno.test(
//   "Task: #map - Composition",
//   async () => {
//     const containerA = Task(_ => Promise.resolve(Either.Right(42)));
//
//     const containerB = await containerA.map(add).map(multiply).run();
//     const containerC = await containerA.map(value => multiply(add(value))).run()
//
//     assertEquivalent(containerB, containerC);
//   }
// );
//
// Deno.test(
//   "Task: #chain (promise)",
//   () => {
//     let count = 0;
//     const containerA = Task(_ => ++count && Promise.resolve(Either.Right(42)));
//     assert(Task.is(containerA));
//
//     const containerB = containerA.chain(value => Task(_ => add(value)));
//     const containerC = containerB.chain(value => Task(_ => multiply(value)));
//
//     assert(Task.is(containerB));
//     assert(Task.is(containerC));
//     assert(count === 0);
//
//     const promiseA = containerB.run();
//     const promiseB = containerC.run();
//     const promiseC = containerC.run();
//
//     assert(promiseA instanceof Promise);
//     assert(promiseB instanceof Promise);
//     assert(promiseC instanceof Promise);
//     assert(count === 3);
//
//     return Promise.all([
//       promiseA
//         .then(container => assertEquivalent(container, Either.Right(44))),
//       promiseB
//         .then(container => assertEquivalent(container, Either.Right(88))),
//       promiseC
//         .then(container => assertEquivalent(container, Either.Right(88)))
//     ]);
//   }
// );
//
// Deno.test(
//   "Task: #chain - Associativity",
//   async () => {
//     const containerA = Task(_ => Promise.resolve(Either.Right(42)));
//     const chainAdd = value => Task(_ => add(value));
//     const chainMultiply = value => Task(_ => multiply(value));
//
//     const containerB = await containerA.chain(chainAdd).chain(chainMultiply).run();
//     const containerC = await containerA.chain(value => chainAdd(value).chain(chainMultiply)).run()
//
//     assertEquivalent(containerB, containerC);
//   }
// );
//
// Deno.test(
//   "Task: #chainRec",
//   async () => {
//     const container = Task.of([ 0 ]).chainRec(
//       (Loop, Done, cursor) =>
//         cursor === 10 ? Done(Pair(cursor, null)) : Loop(Pair(cursor + 1, Task.of([ 42 * (cursor + 1) ]))),
//       0
//     );
//
//     assert(Task.is(container));
//
//     const value = safeExtract("Failed.", await container.run());
//
//     assertEquals(value, [ 0, 42, 84, 126, 168, 210, 252, 294, 336, 378, 420 ]);
//   }
// );
//
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
//
// Deno.test(
//   "Task: #wrap (no container)",
//   () => {
//     let count = 0;
//     const containerA = Task.wrap(_ => ++count && Promise.resolve(42));
//     assert(Task.is(containerA));
//
//     const containerB = containerA.map(add);
//     const containerC = containerB.map(multiply);
//
//     assert(Task.is(containerB));
//     assert(Task.is(containerC));
//     assert(count === 0);
//
//     const promiseA = containerB.run();
//     const promiseB = containerC.run();
//     const promiseC = containerC.run();
//
//     assert(promiseA instanceof Promise);
//     assert(promiseB instanceof Promise);
//     assert(count === 1);
//
//     return Promise.all([
//       promiseA
//         .then(container => assertEquivalent(container, Either.Right(44))),
//       promiseB
//         .then(container => assertEquivalent(container, Either.Right(88))),
//       promiseC
//         .then(container => assertEquivalent(container, Either.Right(88)))
//     ]);
//   }
// );
//
// Deno.test(
//   "Task: Parallel",
//   async () => {
//     const append = x => accumulator => [ ...accumulator, x ];
//     const lift2 = (f, a, b) => b.ap(a.map(f));
//     const insideOut = (T, list) => list.reduce(
//       (accumulator, x) => lift2(append, x, accumulator),
//       T.of([])
//     );
//     const f = x => Task(_ => Promise.resolve(Either.Right(x * 2)));
//
//     const containerA = insideOut(Task, [ 42, 32, 23 ].map(f));
//
//     assert(Task.is(containerA));
//
//     const promise = containerA.run();
//
//     assert(promise instanceof Promise);
//
//     const containerB = await promise;
//
//     assertEquivalent(containerB, Either.Right([ 84, 64, 46 ]))
//   }
// );

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
      ("Chain")
      (Task.wrap(() => Promise.resolve(42)).ap(Task.of((x: number) => x * 2)).toString())
      ("Task(() => Promise.resolve(42)).ap(Task((x) => x * 2))");
  });
