import { assertIsEquivalent } from "./asserts.js";
import Maybe from "./Maybe.js";

Deno.test(
  "Maybe: #just",
  () =>
    assertIsEquivalent(Maybe.just(42), Maybe.Just(42))
);

Deno.test(
  "Maybe.Just: #alt",
  () =>
    assertIsEquivalent(
      Maybe.Just(42).alt(Maybe.Just(24)),
      Maybe.Just(42)
    )
);

Deno.test(
  "Maybe.Just: #ap - Composition",
  () => {
    const containerA = Maybe.Just(42);
    const containerB = Maybe.Just(x => x + 2);
    const containerC = Maybe.Just(x => x * 2);

    assertIsEquivalent(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))),
      containerA.ap(containerB).ap(containerC)
    );
  }
);

Deno.test(
  "Maybe.Just: #ap with either",
  () => {
    const lift2 = (f, a, b) => b.ap(a.map(f));
    const either = (x, y) => lift2(a => b => a || b, x, y);

    assertIsEquivalent(
      either(
        Maybe.Just(false),
        Maybe.Just(82)
      ),
      Maybe.Just(82)
    );
  }
);

Deno.test(
  "Maybe.Just: #ap with lift",
  () => {
    const lift2 = (f, a, b) => b.ap(a.map(f));

    const containerA = Maybe.Just(42);
    const containerB = Maybe.Just(32);

    assertIsEquivalent(
      lift2(x => y => x * y, containerA, containerB),
      Maybe.Just(1344)
    );
  }
);

Deno.test(
  "Maybe.Just: #ap with merge",
  () => {
    const append = y => xs => xs.concat([y]);
    const lift2 = (f, a, b) => b.ap(a.map(f));
    const merge = (T, xs) => xs.reduce(
      (acc, x) => lift2(append, x, acc),
      T.of([])
    );

    assertIsEquivalent(
      merge(
        Maybe,
        [
          Maybe.Just(2),
          Maybe.Just(10),
          Maybe.Just(3)
        ]
      ),
      Maybe.Just([ 2, 10, 3 ])
    );
  }
);

Deno.test(
  "Maybe.Just: #filter (even)",
  () =>
    assertIsEquivalent(
      Maybe.Just(42).filter(x => x % 2 === 0),
      Maybe.Just(42)
    )
);

Deno.test(
  "Maybe.Just: #filter (odd)",
  () =>
    assertIsEquivalent(
      Maybe.Just(23).filter(x => x % 2 === 0),
      Maybe.Nothing
    )
);

Deno.test(
  "Maybe.Just: #map",
  () =>
    assertIsEquivalent(
      Maybe.Just(42).map(x => x * 2),
      Maybe.Just(84)
    )
);

Deno.test(
  "Maybe.Just: #map - Identity",
  () => {
    const container = Maybe.Just(42);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Maybe.Just: #map - Composition",
  () => {
    const container = Maybe.Just(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

Deno.test(
  "Maybe.Nothing: #alt",
  () =>
    assertIsEquivalent(
      Maybe.Nothing.alt(Maybe.Just(42)),
      Maybe.Just(42)
    )
);

Deno.test(
  "Maybe.Nothing: #filter",
  () =>
    assertIsEquivalent(
      Maybe.Nothing.filter(x => x % 2 === 0),
      Maybe.Nothing
    )
);

Deno.test(
  "Maybe.Nothing: #map",
  () =>
    assertIsEquivalent(
      Maybe.Nothing.map(x => x * 2),
      Maybe.Nothing
    )
);

Deno.test(
  "Maybe.Nothing: #map - Identity",
  () => {
    const container = Maybe.Nothing;

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Maybe.Nothing: #map - Composition",
  () => {
    const container = Maybe.Nothing;
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);