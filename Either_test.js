import { assertIsEquivalent } from "./asserts.js";
import Either from "./Either.js";

Deno.test(
  "Either: #right",
  () =>
    assertIsEquivalent(Either.right(42), Either.Right(42))
);

Deno.test(
  "Either.Right: #alt",
  () =>
    assertIsEquivalent(
      Either.Right(42).alt(Either.Right(24)),
      Either.Right(42)
    )
);

Deno.test(
  "Either.Right: #ap - Composition",
  () => {
    const containerA = Either.Right(42);
    const containerB = Either.Right(x => x + 2);
    const containerC = Either.Right(x => x * 2);

    assertIsEquivalent(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))),
      containerA.ap(containerB).ap(containerC)
    );
  }
);

Deno.test(
  "Either.Right: #chain",
  () =>
    assertIsEquivalent(
      Either.Right(42).chain(x => Either.of(x * 2)),
      Either.Right(84)
    )
);

Deno.test(
  "Either.Right: #map",
  () =>
    assertIsEquivalent(
      Either.Right(42).map(x => x * 2),
      Either.Right(84)
    )
);

Deno.test(
  "Either.Right: #map - Identity",
  () => {
    const container = Either.Right(42);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Either.Right: #map - Composition",
  () => {
    const container = Either.Right(42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);

Deno.test(
  "Either.Left: #alt",
  () =>
    assertIsEquivalent(
      Either.Left(32).alt(Either.Right(42)),
      Either.Right(42)
    )
);

Deno.test(
  "Either.Left: #map",
  () =>
    assertIsEquivalent(
      Either.Left(32).map(x => x * 2),
      Either.Left(32)
    )
);

Deno.test(
  "Either.Left: #map - Identity",
  () => {
    const container = Either.Left(32);

    assertIsEquivalent(
      container.map(x => x),
      container
    );
  }
);

Deno.test(
  "Either.Left: #map - Composition",
  () => {
    const container = Either.Left(32);
    const f = x => x + 2;
    const g = x => x * 2;

    assertIsEquivalent(
      container.map(f).map(g),
      container.map(x => g(f(x)))
    );
  }
);