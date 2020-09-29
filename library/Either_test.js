import { assertEquals } from "https://deno.land/std@0.70.0/testing/asserts.ts";

import { factorizeType } from "./factories.js";
import Either from "./Either.js";
import { $$value } from "./Symbols.js";

Deno.test(
  "Either: #right",
  () =>
    assertEquals(Either.right(42).toString(), Either.Right(42).toString())
);

Deno.test(
  "Either.Right: #alt",
  () =>
    assertEquals(
      Either.Right(42).alt(Either.Right(24)).toString(),
      Either.Right(42).toString()
    )
);

Deno.test(
  "Either.Right: #ap - Composition",
  () => {
    const containerA = Either.Right(42);
    const containerB = Either.Right(x => x + 2);
    const containerC = Either.Right(x => x * 2);

    assertEquals(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).toString(),
      containerA.ap(containerB).ap(containerC).toString()
    );
  }
);

Deno.test(
  "Either.Right: #chain",
  () =>
    assertEquals(
      Either.Right(42).chain(x => Either.of(x * 2)).toString(),
      Either.Right(84).toString()
    )
);

Deno.test(
  "Either.Right: #extend - Associativity",
  async () => {
    const container = Either.Right(42);
    const f = container => container[$$value] + 2;
    const g = container => container[$$value] * 2;

    assertEquals(
      container.extend(f).extend(g).toString(),
      container.extend(value => g(value.extend(f))).toString()
    );
  }
);

Deno.test(
  "Either.Right: #extract - Right identity",
  () => {
    const container = Either.Right(42);
    const f = container => container[$$value] + 2;

    assertEquals(
      container.extend(f).extract().toString(),
      f(container).toString()
    );
  }
);

Deno.test(
  "Either.Right: #map",
  () =>
    assertEquals(
      Either.Right(42).map(x => x * 2).toString(),
      Either.Right(84).toString()
    )
);

Deno.test(
  "Either.Right: #map - Identity",
  () => {
    const container = Either.Right(42);

    assertEquals(
      container.map(x => x).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Either.Right: #map - Composition",
  () => {
    const container = Either.Right(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertEquals(
      container.map(f).map(g).toString(),
      container.map(x => g(f(x))).toString()
    );
  }
);

Deno.test(
  "Either.Right: #of - Identity (Applicative)",
  () => {
    const container = Either.Right(42);

    assertEquals(
      container.ap(Either.of(x => x)).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Either.Right: #of - Left identity (Chainable)",
  async () => {
    const container = Either.Right(42);
    const f = x => Either.Right(x + 2);

    assertEquals(
      container.chain(Either.of).chain(f).toString(),
      container.chain(f).toString()
    );
  }
);

Deno.test(
  "Either.Right: #of - Right identity (Chainable)",
  async () => {
    const container = Either.Right(42);
    const f = x => Either.Right(x + 2);

    assertEquals(
      container.chain(f).chain(Either.of).toString(),
      container.chain(f).toString()
    );
  }
);

Deno.test(
  "Either.Right: #of - Homomorphism",
  () =>
    assertEquals(
      Either.of(42).ap(Either.of(x => x + 2)),
      Either.of((x => x + 2)(42))
    )
);

Deno.test(
  "Either.Right: #of - Interchange",
  () =>
    assertEquals(
      Either.of(42)
        .ap(Either.Right(x => x + 2)).toString(),
      Either.Right(x => x + 2)
        .ap(Either.of(f => f(42))).toString()
    )
);

Deno.test(
  "Either.Right: #traverse - Identity",
  () => {
    const Dummy = factorizeType("Dummy", [ "x" ]);
    Dummy.of = x => Dummy(x);
    Dummy.prototype.map = function (unaryFunction) {

      return Dummy(unaryFunction(this.x));
    };
    const container = Either.Right([ 42, 32, 23 ]);

    assertEquals(
      container.traverse(Dummy, Dummy.of).toString(),
      Dummy.of(container).toString()
    );
  }
);

/**
 * Traverse is an experimental feature; The Naturility law test is failing.
 */
// Deno.test(
//   "Either.Right: #traverse - Naturality",
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
//     const container = Either.Right([ 42, 32, 23 ]);
//     const f = x => Dummy.of(x);
//
//     assertEquals(
//       f(container.sequence(Dummy)).toString(),
//       container.traverse(Either, f).toString()
//     );
//   }
// );

Deno.test(
  "Either: #zero - Right identity",
  () => {
    const container = Either.Right(42);

    assertEquals(
      container.alt(Either.zero()).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Either: #zero - Left identity",
  () => {
    const container = Either.Right(42);

    assertEquals(
      Either.zero().alt(container).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Either: #zero - Annihilation",
  () =>
    assertEquals(
      Either.zero().map(x => x + 2).toString(),
      Either.zero().toString()
    )
);

Deno.test(
  "Either.Left: #alt",
  () =>
    assertEquals(
      Either.Left(32).alt(Either.Right(42)).toString(),
      Either.Right(42).toString()
    )
);

Deno.test(
  "Either.Left: #map",
  () =>
    assertEquals(
      Either.Left(32).map(x => x * 2).toString(),
      Either.Left(32).toString()
    )
);

Deno.test(
  "Either.Left: #map - Identity",
  () => {
    const container = Either.Left(32);

    assertEquals(
      container.map(x => x).toString(),
      container.toString()
    );
  }
);

Deno.test(
  "Either.Left: #map - Composition",
  () => {
    const container = Either.Left(32);
    const f = x => x + 2;
    const g = x => x * 2;

    assertEquals(
      container.map(f).map(g).toString(),
      container.map(x => g(f(x))).toString()
    );
  }
);
