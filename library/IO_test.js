import IO from "./IO.js";
import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

Deno.test(
  "IO: #ap - Composition",
  () => {
    const containerA = IO(_ => 42);
    const containerB = IO(_ => x => x + 2);
    const containerC = IO(_ => x => console.debug("!!!!") || x * 2);

    assertEquals(
      containerA.ap(containerB.ap(containerC.map(a => b => c => a(b(c))))).run(),
      containerA.ap(containerB).ap(containerC).run()
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
  "Maybe.Just: #map - Composition",
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
