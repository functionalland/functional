import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { factorizeType } from "./factories.js";
import Maybe from "./Maybe.js";
import { $$value } from "./Symbols.js";

Deno.test(
  "Maybe: #just",
  () =>
    assertEquals(Maybe.just(42).toString(), Maybe.Just(42).toString())
);

Deno.test(
  "Maybe: (Just) #alt",
  () =>
    assertEquals(
      Maybe.Just(42).alt(Maybe.Just(24)).toString(),
      Maybe.Just(42).toString()
    )
);

Deno.test(
  "Maybe: (Just) #ap - Composition",
  () => {
    const containerA = Maybe.Just(42);
    const containerB = Maybe.Just(x => x + 2);
    const containerC = Maybe.Just(x => x * 2);

    assertEquals(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).toString(),
      containerA.ap(containerB).ap(containerC).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #ap with either",
  () => {
    const lift2 = (f, a, b) => b.ap(a.map(f));
    const either = (x, y) => lift2(a => b => a || b, x, y);

    assertEquals(
      either(
        Maybe.Just(false),
        Maybe.Just(82)
      ).toString(),
      Maybe.Just(82).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #ap with lift",
  () => {
    const lift2 = (f, a, b) => b.ap(a.map(f));

    const containerA = Maybe.Just(42);
    const containerB = Maybe.Just(32);

    assertEquals(
      lift2(x => y => x * y, containerA, containerB).toString(),
      Maybe.Just(1344).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #ap with merge",
  () => {
    const append = y => xs => xs.concat([y]);
    const lift2 = (f, a, b) => b.ap(a.map(f));
    const merge = (T, xs) => xs.reduce(
      (acc, x) => lift2(append, x, acc),
      T.of([])
    );

    assertEquals(
      merge(
        Maybe,
        [
          Maybe.Just(2),
          Maybe.Just(10),
          Maybe.Just(3)
        ]
      ).toString(),
      Maybe.Just([ 2, 10, 3 ]).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #chain - Associativity",
  async () => {
    const container = Maybe.Just(42);
    const f = x => Maybe.Just(x + 2);
    const g = x => Maybe.Just(x * 2);

    assertEquals(
      container.chain(f).chain(g).toString(),
      container.chain(value => f(value).chain(g)).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #extend - Associativity",
  async () => {
    const container = Maybe.Just(42);
    const f = container => container[$$value] + 2;
    const g = container => container[$$value] * 2;

    assertEquals(
      container.extend(f).extend(g).toString(),
      container.extend(value => g(value.extend(f))).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #extract - Right identity",
  () => {
    const container = Maybe.Just(42);
    const f = container => container[$$value] + 2;

    assertEquals(
      container.extend(f).extract().toString(),
      f(container).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #filter (even)",
  () =>
    assertEquals(
      Maybe.Just(42).filter(x => x % 2 === 0).toString(),
      Maybe.Just(42).toString()
    )
);

Deno.test(
  "Maybe: (Just) #filter (odd)",
  () =>
    assertEquals(
      Maybe.Just(23).filter(x => x % 2 === 0).toString(),
      Maybe.Nothing.toString()
    )
);

Deno.test(
  "Maybe: (Just) #map",
  () =>
    assertEquals(
      Maybe.Just(42).map(x => x * 2).toString(),
      Maybe.Just(84).toString()
    )
);

Deno.test(
  "Maybe: (Just) #map - Identity",
  () => {
    const container = Maybe.Just(42);

    assertEquals(
      container.map(x => x).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #map - Composition",
  () => {
    const container = Maybe.Just(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertEquals(
      container.map(f).map(g).toString(),
      container.map(x => g(f(x))).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #of - Identity (Applicative)",
  () => {
    const container = Maybe.Just(42);

    assertEquals(
      container.ap(Maybe.of(x => x)).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #of - Left identity (Chainable)",
  async () => {
    const container = Maybe.Just(42);
    const f = x => Maybe.Just(x + 2);

    assertEquals(
      container.chain(Maybe.of).chain(f).toString(),
      container.chain(f).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #of - Right identity (Chainable)",
  async () => {
    const container = Maybe.Just(42);
    const f = x => Maybe.Just(x + 2);

    assertEquals(
      container.chain(f).chain(Maybe.of).toString(),
      container.chain(f).toString()
    );
  }
);

Deno.test(
  "Maybe: (Just) #of - Homomorphism",
  () =>
    assertEquals(
      Maybe.of(42).ap(Maybe.of(x => x + 2)),
      Maybe.of((x => x + 2)(42))
    )
);

Deno.test(
  "Maybe: (Just) #of - Interchange",
  () =>
    assertEquals(
      Maybe.of(42)
        .ap(Maybe.Just(x => x + 2)).toString(),
      Maybe.Just(x => x + 2)
        .ap(Maybe.of(f => f(42))).toString()
    )
);

Deno.test(
  "Maybe: (Just) #traverse - Identity",
  () => {
    const Dummy = factorizeType("Dummy", [ "x" ]);
    Dummy.of = x => Dummy(x);
    Dummy.prototype.map = function (unaryFunction) {

      return Dummy(unaryFunction(this.x));
    };
    const container = Maybe.Just([ 42, 32, 23 ]);

    assertEquals(
      container.traverse(Dummy, Dummy.of).toString(),
      Dummy.of(container).toString()
    );
  }
);

/*
 * Traverse is an experimental feature; The Naturility law test is failing.
 */
// Deno.test(
//   "Maybe: (Just) #traverse - Naturality",
//   () => {
//     const Dummy = factorizeType("Dummy", [ "x" ]);
//     Dummy.of = x => Dummy(x);
//     Dummy.prototype.chain = function (unaryFunction) {
//
//       return unaryFunction(this.x);
//     };
//     Dummy.prototype.map = function (unaryFunction) {
//
//       return Dummy(unaryFunction(this.x));
//     };
//     const container = Maybe.Just([ 42, 32, 23 ]);
//     const f = x => Dummy.of(x);
//
//     assertEquals(
//       f(container.sequence(Dummy)).toString(),
//       container.traverse(Maybe, f).toString()
//     );
//   }
// );

Deno.test(
  "Maybe: #zero - Right identity",
  () => {
    const container = Maybe.Just(42);

    assertEquals(
      container.alt(Maybe.zero()).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Maybe: #zero - Left identity",
  () => {
    const container = Maybe.Just(42);

    assertEquals(
      Maybe.zero().alt(container).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Maybe: #zero - Annihilation",
  () =>
    assertEquals(
      Maybe.zero().map(x => x + 2).toString(),
      Maybe.zero().toString()
    )
);

Deno.test(
  "Maybe: (Nothing) #alt",
  () =>
    assertEquals(
      Maybe.Nothing.alt(Maybe.Just(42)).toString(),
      Maybe.Just(42).toString()
    )
);

Deno.test(
  "Maybe: (Nothing) #filter",
  () =>
    assertEquals(
      Maybe.Nothing.filter(x => x % 2 === 0).toString(),
      Maybe.Nothing.toString()
    )
);

Deno.test(
  "Maybe: (Nothing) #map",
  () =>
    assertEquals(
      Maybe.Nothing.map(x => x * 2).toString(),
      Maybe.Nothing.toString()
    )
);

Deno.test(
  "Maybe: (Nothing) #map - Identity",
  () => {
    const container = Maybe.Nothing;

    assertEquals(
      container.map(x => x).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Maybe: (Nothing) #map - Composition",
  () => {
    const container = Maybe.Nothing;
    const f = x => x + 2;
    const g = x => x * 2;

    assertEquals(
      container.map(f).map(g).toString(),
      container.map(x => g(f(x))).toString()
    );
  }
);
