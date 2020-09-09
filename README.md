# Functional

Common Functional Programming Algebraic data types for JavaScript that is compatible with most modern browsers and Deno.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/cli_badges)
[![deno version](https://img.shields.io/badge/deno-^1.3.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![GitHub release](https://img.shields.io/github/release/sebastienfilion/functional.svg)](https://github.com/sebastienfilion/functional/releases)

  * [Type factory](#type-factory)
  * [Maybe](#maybe-type)
  * [Either](#either-type)
  * [IO](#io-type)
  * [Task](#task-type)
  * [TypeScript](#typescript)
  
# Usage

This example uses the Ramda library - for simplification - but you should be able to use any library that implements
the [Fantasy-land specifications](https://github.com/fantasyland/fantasy-land). 

```js
import { compose, converge, lift, map, prop } from "https://x.nest.land/ramda@0.27.0/source/index.js";
import Either from "https://deno.land/x/functional@v0.5.0/Either.js"
import Task from "https://deno.land/x/functional@v0.5.0/Task.js"

const fetchUser = userID => Task.wrap(_ => fetch(`${URL}/users/${userID}`).then(response => response.json()));

const sayHello = compose(
  converge(
    lift((username, email) => `Hello ${username} (${email})!`),
    [
      map(prop("username")),
      map(prop("email"))
    ]
  ),
  fetchUser
);

// Calling `sayHello` results in an instance of `Task` keeping the function pure.
assert(Task.is(sayHello(userID)));

// Finally, calling `Task#run` will call `fetch` and return a promise
sayHello(userID).run()
  .then(container => {
    // The returned value should be an instance of `Either.Right` or `Either.Left`
    assert(Either.Right.is(container));
    // Forcing to coerce the container to string will show that the final value is our message.
    assert(container.toString(), `Either.Right("Hello johndoe (johndoe@gmail.com)!")`);
  });

// sayHello(userID).run() === Either.Right("Hello johndoe (johndoe@gmail.com)!")
```

## Type factory

The Type factory can be used to build complex data structure.

```js
import { factorizeType } from "https://deno.land/x/functional@v0.5.0/SumType.js"

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
import { factorizeSumType } from "https://deno.land/x/functional@v0.5.0/SumType.js"

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
import { factorizeSumType } from "https://deno.land/x/functional@v0.5.0/SumType.js"

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
import Maybe from "https://deno.land/x/functional@v0.5.0/Maybe.js"

const container = Maybe.Just(42);

const serialize = (container) =>
  container.fold({
    Nothing: () => "There is no value.",
    Just: value => `The value is ${value}.`
  });

// serialize(container) === "The value is 42."
```

This implementation of Maybe is a valid [`Filterable`](https://github.com/fantasyland/fantasy-land#filterable), 
[`Functor`](https://github.com/fantasyland/fantasy-land#functor), 
[`Applicative`](https://github.com/fantasyland/fantasy-land#applicative), 
[`Alternative`](https://github.com/fantasyland/fantasy-land#alternative), 
[`Traversable`](https://github.com/fantasyland/fantasy-land#traversable) and
[`Monad`](https://github.com/fantasyland/fantasy-land#monad).

## `Either` type

The `Either` type represents the possibility of two values; either an `a` or a `b`.

```js
import Either from "https://deno.land/x/functional@v0.5.0/Either.js"

const container = Either.Right(42);

const serialize = (container) =>
  container.fold({
    Left: value => `An error occured: ${value}.`,
    Right: value => `The value is ${value}.`
  });

// serialize(container) === "The value is 42."
```

This implementation of Maybe is a valid [`Functor`](https://github.com/fantasyland/fantasy-land#functor), 
[`Applicative`](https://github.com/fantasyland/fantasy-land#applicative), 
[`Alternative`](https://github.com/fantasyland/fantasy-land#alternative) and 
[`Monad`](https://github.com/fantasyland/fantasy-land#monad).

## `IO` type

The `IO` type represents a function that access IO. It will be lazily executed when the `#run` method is called.

```js
import IO from "https://deno.land/x/functional@v0.5.0/IO.js"

// Eventually 42
const container = IO(_ => Promise.resolve(42));

const multiply = container.map(promise => promise.then(x => x * x));
const add = container.map(promise => promise.then(x => x + x));

// multiply === IO(Function)
// add === IO(Function)

const multiplyThenAdd = multiply.map(promise => promise.then(x => x + x));

// multiply.run() === Promise(1764)
// add.run() === Promise(84)
// multiplyThenAdd.run() === Promise(3528)
```

This implementation of IO is a valid [`Functor`](https://github.com/fantasyland/fantasy-land#functor), 
[`Applicative`](https://github.com/fantasyland/fantasy-land#applicative) and 
[`Monad`](https://github.com/fantasyland/fantasy-land#monad).

## `Task` type

The `Task` type represents a function that access IO. It will be lazily executed when the `#run` method is called. 
Unlike IO, the Task type also abstract away the promise making for a more intuitive experience.  
Note that the function must return an instance of [`Either`](#either-type); `Either.Right` to represent a success and
`Either.Left` to represent a failure. Also check-out the [`Task.wrap`](#task-wrap) method.  

If the runtime throws an error, the final value will be `Either.Left(error)`.

```js
import Either from "https://deno.land/x/functional@v0.5.0/Either.js";
import Task from "https://deno.land/x/functional@v0.5.0/Task.js"

// Eventually 42
const container = Task(_ => Promise.resolve(Either.Right(42)));

const multiply = container.map(x => x * x);
const add = container.map(x => x + x);

// multiply === Task(Function)
// add === Task(Function)

const multiplyThenAdd = multiply.map(x => x + x);

// await multiply.run() === Either.Right(1764)
// await add.run() === Either.Right(84)
// await multiplyThenAdd.run() === Either.Right(3528)
```

### `Task.wrap`

Create a wrapped instance of Task. An instance of `Task` made using the `wrap` method is different in two ways:

  1. The result of the function call is memoized;
  2. If the function call was successful, the value will automatically be an instance of `Either.Right`;
  
```js
import Task from "https://deno.land/x/functional@v0.5.0/Task.js"

let count = 0;
const fetchUser = userID => Task.wrap(
  _ => ++count && fetch(`${URL}/users/${userID}`).then(response => response.json())
);

const user = fetchUser(userID);
const username = user.map(({ username }) => username);
const email = user.map(({ email }) => email);

// await user.run() === Either.Right({ email: "johndoe@gmail.com", username: "johndoe" })
// await username.run() === Either.Right("johndoe")
// await email.run() === Either.Right("johndoe@gmail.com")
// count === 1
```

This implementation of Task is a valid [`Functor`](https://github.com/fantasyland/fantasy-land#functor), 
[`Applicative`](https://github.com/fantasyland/fantasy-land#applicative), 
[`Alternative`](https://github.com/fantasyland/fantasy-land#alternative) and 
[`Monad`](https://github.com/fantasyland/fantasy-land#monad).

## TypeScript

I will try to publish TypeScript type hint files for those who needs it.  
So far, I've only implemented the Type factory functions.

```ts
// @deno-types="https://deno.land/x/functional@v0.5.0/SumType.d.ts"
import { factorizeType, factorizeSumType } from "https://deno.land/x/functional@v0.5.0/SumType.js";
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