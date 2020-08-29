import { assert, assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { factorizeSumType, factorizeType } from "./SumType.js";

Deno.test(
  "SumType #factorizeType: Tuple",
  () => {
    const Tuple = factorizeType("Tuple", [ "_1", "_2" ]);
    const instanceCollection = [
      [
        "Constructor",
        Tuple(42, 24)
      ],
      [
        "#from",
        Tuple.from({ _1: 42, _2: 24 })
      ]
    ];

    assertEquals(Tuple.toString(), `Tuple`, `A Type factory can be serialized.`);
    assert(!Tuple.is({}));

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals($$instance.toString(), `Tuple(42, 24)`, `${instanceName}: An instance can be serialized.`);
      assertEquals($$instance._1, 42, `${instanceName}: An instance has properties.`);
      assertEquals($$instance._2, 24, `${instanceName}: An instance has properties.`);
      assertEquals($$instance.constructor, Tuple, `${instanceName}: An instance constructor is the Type factory.`);
      assert(Tuple.is($$instance));
      assert(Tuple.prototype.isPrototypeOf($$instance))
    }
  }
);

Deno.test(
  "SumType #factorizeSumType: List",
  () => {
    const List = factorizeSumType(
      "List",
      {
        Cons: [ "x", "xs" ],
        Nil: []
      }
    );

    List.prototype.iterate = "Dummy";

    const instanceCollection = [
      [
        "Constructor",
        List.Cons(42, List.Nil)
      ],
      [
        "#from",
        List.Cons.from({ x: 42, xs: List.Nil })
      ]
    ];

    assertEquals(List.toString(), `List`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assertEquals(List.Cons.toString(), `List.Cons`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assertEquals(List.Nil.toString(), `List.Nil`,/* `${instanceName}: A Type factory can be serialized.`*/);
    assert(!List.is({}))

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals($$instance.toString(), `List.Cons(42, List.Nil)`, `${instanceName}: An instance can be serialized.`);
      assertEquals($$instance.x, 42,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals($$instance.xs, List.Nil,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals($$instance.xs.constructor, List,/* `${instanceName}: A Type factory can be serialized.`*/);
      assertEquals(
        $$instance.fold({
          Cons: (x, xs) => [ x, xs ],
          Nil: () => []
        }),
        [ 42, List.Nil ]
      );
      assert(List.is($$instance));
      assert(List.Cons.is($$instance));
      assert(!List.Cons.is($$instance.xs));
      assert(List.Nil.is($$instance.xs));
      assert(!List.Nil.is($$instance));
      assert(List.prototype.isPrototypeOf($$instance));
      assert(!!$$instance.iterate);
    }
  }
);