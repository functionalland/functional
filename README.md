# Functional

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/functional/SumType.js)

## Type factory

The Type factory can be used to build complex data structure.

```js
import { factorizeType } from "https://deno.land/x/functional/SumType.js"

const Coordinates = factorizeType("Coordinates", [ "x", "y" ]);
const vector = Coordinates(150, 200);
// vector.x === 150
// vector.y === 200
```

### `Type.from`

```
from :: Type ~> Object -> t
```

Create an instance of Type using an object representation.

```js
const vector = Coordinates.from({ x: 150, y: 200 });
// vector.x === 150
// vector.y === 200
```

### `Type.is`

```
is :: Type ~> Type t -> Boolean
```

Assert that an instance is of the same Type.

```js
Coordinates.is(vector);
// true
```

### `Type.toString`

```
toString :: Type ~> () -> String
```

Serialize the Type Representation into a string.

```js
Coordinates.toString();
// "Coordinates"
```

### `Type(a).toString`

```
toString :: Type t => t ~> () -> String
```

Serialize the instance into a string.

```js
vector.toString();
// "Coordinates(150, 200)"
```

## Type Sum factory

```js
import { factorizeSumType } from "https://deno.land/x/functional/SumType.js"

const Shape = factorizeSumType(
  "Shape",
  {
    // Square :: (Coord, Coord) -> Shape
    Square: [ "topLeft", "bottomRight" ],
    // Circle :: (Coord, Number) -> Shape
    Circle: [ "center", "radius" ]
  }
);
```

### `SumType.from`

```
from :: SumType ~> Object -> t
```

Create an instance of Type using an object representation.

```js
const oval = Shape.Circle.from(
  {
    center: Coordinates.from({ x: 150, y: 200 }),
    radius: 200
  }
);
// oval.center === Coordinates(150, 200)
// oval.radius === 200
```

### `SumType.is`

```
is :: SumType ~> SumType t -> Boolean
```

Assert that an instance is of the same Sum Type.

```js
Shape.Circle.is(oval);
// true
```

### `SumType.fold`

```js
Shape.prototype.translate =
  function (x, y, z) {
    return this.fold({
      Square: (topleft, bottomright) =>
        Shape.Square(
          topLeft.translate(x, y, z),
          bottomRight.translate(x, y, z)
        ),

      Circle: (centre, radius) =>
        Shape.Circle(
          centre.translate(x, y, z),
          radius
        )
    })
  };
```

### `SumType(a).toString`

```
toString :: SumType t => t ~> () -> String
```

Serialize the instance into a string.

```js
oval.toString();
// "Shape.Circle(Coordinates(150, 200), 200)"
```

### Example of writing a binary tree with Sum Types

```js
import { factorizeSumType } from "https://deno.land/x/functional/SumType.js"

const BinaryTree = factorizeSumType('BinaryTree', {
  Node: ['left', 'x', 'right'],
  Leaf: []
});

BinaryTree.prototype.reduce = function (f, accumulator) {

  return this.fold(
    {
      Node: (l, x, r) => {
        const left = l.reduce(f, accumulator);
        const leftAndMiddle = f(left, x);

        return r.reduce(f, leftAndMiddle);
      },
      Leaf: () => accumulator
    }
  );
};

const tree =
  BinaryTree.Node(
    BinaryTree.Node(
      BinaryTree.Leaf,
      1,
      BinaryTree.Node(
        BinaryTree.Leaf,
        2,
        BinaryTree.Leaf
      )
    ),
    3,
    BinaryTree.Node(
      BinaryTree.Node(
        BinaryTree.Leaf,
        4,
        BinaryTree.Leaf
      ),
      5,
      BinaryTree.Leaf
    )
  );

// tree.reduce((x, y) => x + y, 0) === 15
```

## `Maybe` type

The `Maybe` type represents potentially `Just` a value or `Nothing`.

```js
import Maybe from "https://deno.land/x/functional/Maybe.js"

const container = Maybe.Just(42);

const serialize = (container) =>
  container.fold({
    Nothing: () => "There is no value.",
    Just: (value) => `The value is ${value}.`
  });

// serialize(container) === "The value is 42."
```
 
## Deno

This codebase uses the assertion library from [Deno](https://deno.land/#installation).

### MIT License

Copyright © 2020 - Sebastien Filion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.