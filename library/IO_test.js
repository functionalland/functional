import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import IO from "./IO.js";

Deno.test(
  "IO: #ap - Composition",
  () => {
    const containerA = IO(_ => 42);
    const containerB = IO(_ => x => x + 2);
    const containerC = IO(_ => x => x * 2);

    assertEquals(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).run(),
      containerA.ap(containerB).ap(containerC).run()
    );
  }
);

Deno.test(
  "IO: #chain - Associativity",
  async () => {
    const container = IO(_ => 42);
    const f = x => IO(_ => x + 2);
    const g = x => IO(_ => x * 2);

    assertEquals(
      container.chain(f).chain(g).run(),
      container.chain(value => f(value).chain(g)).run()
    );
  }
);

Deno.test(
  "IO: #map - Identity",
  () => {
    const container = IO(_ => 42);

    assertEquals(
      container.map(x => x).run(),
      container.run()
    );
  }
);

Deno.test(
  "IO: #map - Composition",
  () => {
    const container = IO(_ => 42);
    const f = x => x + 2;
    const g = x => x * 2;

    assertEquals(
      container.map(f).map(g).run(),
      container.map(x => g(f(x))).run()
    );
  }
);

Deno.test(
  "IO: #of - Identity (Applicative)",
  () => {
    const container = IO(_ => 42);

    assertEquals(
      container.ap(IO.of(x => x)).run(),
      container.run()
    );
  }
);

Deno.test(
  "IO: #of - Left identity (Chainable)",
  async () => {
    const container = IO(_ => 42);
    const f = x => IO(_ => x + 2);

    assertEquals(
      container.chain(IO.of).chain(f).run(),
      container.chain(f).run()
    );
  }
);

Deno.test(
  "IO: #of - Right identity (Chainable)",
  async () => {
    const container = IO(_ => 42);
    const f = x => IO(_ => x + 2);

    assertEquals(
      container.chain(f).chain(IO.of).run(),
      container.chain(f).run()
    );
  }
);

Deno.test(
  "IO: #of - Homomorphism",
  () =>
    assertEquals(
      IO.of(42).ap(IO.of(x => x + 2)).run(),
      IO.of((x => x + 2)(42)).run()
    )
);

Deno.test(
  "IO: #of - Interchange",
  () =>
    assertEquals(
      IO.of(42)
        .ap(IO(_ => x => x + 2)).run(),
      IO(_ => x => x + 2)
        .ap(IO(_ => f => f(42))).run()
    )
);
