// @deno-types="./factories.d.ts"
import { factorizeSumType, factorizeType } from "./factories.js";
import { TypeRepresentationPrototype, SumTypeRepresentationPrototype } from "./factories.d.ts";
import { assert, assertEquals, test } from "./testing.ts";

interface TupleInterface<X, Y> extends TypeRepresentationPrototype {
  <X, Y> (x: X, y: Y): TupleInterface<X, Y>;
  _1: X;
  _2: Y;
}

interface ListConsPrototype<X, XS> extends SumTypeRepresentationPrototype {
  <X, XS> (x: X, xs: XS): ListConsPrototype<X, XS>;
  x: X,
  xs: XS
}

interface ListNilPrototype extends SumTypeRepresentationPrototype {
  (): ListNilPrototype;
}

interface ListInterface extends SumTypeRepresentationPrototype {
  Cons: {
    <X, XS> (x: X, xs: XS): ListConsPrototype<X, XS>;
    from<X, XS>(t: { x: X, xs: XS }): ListConsPrototype<X, XS>;
    is<A>(C: A): boolean;
    of<X>(x: X): ListConsPrototype<X, null>;
  },
  Nil: {
    (): ListNilPrototype;
    from(t: Object): ListNilPrototype;
    is<A>(C: A): boolean;
    of<X>(x: X): ListNilPrototype;
  }
};

test ("factorizeType: Tuple")
  (() => {
    const Tuple = factorizeType<TupleInterface<number, number>> ("Tuple", [ "_1", "_2" ]);
    const instanceCollection: Array<[string, TupleInterface<number, number>]> = [
      [
        "Constructor",
        Tuple(42, 24)
      ],
      [
        "#from",
        Tuple.from({ _1: 42, _2: 24 })
      ]
    ];

    assertEquals
      ("A Type factory can be serialized.")
      (Tuple.toString())
      ("Tuple");
    assert (!Tuple.is({}));

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals (`${instanceName}: An instance can be serialized.`) ($$instance.toString()) (`Tuple(42, 24)`);
      assertEquals (`${instanceName}: An instance has properties.`) ($$instance._1) (42);
      assertEquals (`${instanceName}: An instance has properties.`) ($$instance._2) (24);
      assertEquals
        (`${instanceName}: An instance constructor is the Type factory.`)
        ($$instance.constructor)
        (Tuple);
      assert (Tuple.is($$instance));
      assert (Tuple.prototype.isPrototypeOf($$instance))
    }
  });

Deno.test(
  "factorizeSumType: List",
  () => {
    const List = factorizeSumType<ListInterface> (
      "List",
      {
        Cons: [ "x", "xs" ],
        Nil: []
      }
    );

    // List.prototype.iterate = "Dummy";

    const instanceCollection: Array<[string, ListConsPrototype<number, number|any>]> = [
      [
        "Constructor",
        List.Cons(42, List.Nil)
      ],
      [
        "#from",
        List.Cons.from({ x: 42, xs: List.Nil })
      ]
    ];

    assertEquals (List.toString()) (`List`);
    assertEquals (List.Cons.toString()) (`List.Cons`);
    assertEquals (List.Nil.toString()) (`List.Nil`);
    assert (!List.is({}));

    for (const [ instanceName, $$instance ] of instanceCollection) {
      assertEquals
        ($$instance.toString())
        (`List.Cons(42, List.Nil)`)
        (`${instanceName}: An instance can be serialized.`);
      assertEquals ($$instance.x) (42);
      assertEquals ($$instance.xs) (List.Nil);
      assertEquals ($$instance.xs.constructor) (List);
      assertEquals
          ($$instance.fold({ Cons: (x: number, xs: Array<number>) => [ x, xs ], Nil: () => [] }))
          ([ 42, List.Nil ]);
      assert (List.is($$instance));
      assert (List.Cons.is($$instance));
      assert (!List.Cons.is($$instance.xs));
      assert (List.Nil.is($$instance.xs));
      assert (!List.Nil.is($$instance));
      // assert(List.prototype.isPrototypeOf($$instance));
      // assert(!!$$instance.iterate);
    }
  }
);
