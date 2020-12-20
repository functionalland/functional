<img src="./.github/fl-logo.svg" alt="Functional" width="450" />

Common Functional Programming Algebraic data types for JavaScript that is compatible with most modern browsers and Deno.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/functional-redis@v1.3.0)
[![deno version](https://img.shields.io/badge/deno-^1.6.1-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![GitHub release](https://img.shields.io/github/v/release/sebastienfilion/functional-redis)](https://github.com/sebastienfilion/functional-redis/releases)
[![GitHub licence](https://img.shields.io/github/license/sebastienfilion/functional-redis)](https://github.com/sebastienfilion/functional-redis/blob/v1.3.0/LICENSE)

  * [Either](#either)
  * [IO](#io)
  * [Maybe](#maybe)
  * [Pair](#pair)
  * [Task](#task)
  * [Type factory](#type-factory)
  * [Sum Type factory](#sum-type-factory)
  * [Utilities](#utilities)
  * [TypeScript](#typescript)

## Usage

This example uses the [Ramda library](https://ramdajs.com) - for simplification - but you should be able to use any library that implements
the [Fantasy-land specifications](https://github.com/fantasyland/fantasy-land).

```js
import { compose, converge, curry, map, prop } from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import Either from "https://deno.land/x/functional@v1.3.0/library/Either.js";
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";

const fetchUser = userID => Task.wrap(_ => fetch(`${URL}/users/${userID}`).then(response => response.json()));

const sayHello = compose(
  map(
    converge(
      curry((username, email) => `Hello ${username} (${email})!`),
      [
        prop("username"),
        prop("email")
      ]
    )
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

// await sayHello(userID).run() === Either.Right(String)
```

### Using the bundle

As a convenience, when using Functional in the browser, you can use the **unminified** bundled copy.

```js
import { compose, converge, lift, map, prop } from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { Either, Task } from "https://deno.land/x/functional@v1.3.0/functional.js";

const fetchUser = userID => Task.wrap(_ => fetch(`${URL}/users/${userID}`).then(response => response.json()));

const sayHello = compose(
  map(
    converge(
      curry((username, email) => `Hello ${username} (${email})!`),
      [
        prop("username"),
        prop("email")
      ]
    )
  ),
  fetchUser
);
```

---

## Either

The `Either` is a sum type similar to `Maybe`, but it differs in that a value can be of two possible types
(Left or Right). Commonly the Left type represents an error.

The `Either` type implements the following algebras:
- [x] Alternative
- [x] Comonad
- [x] Monad

### Example

```js
import Either from "https://deno.land/x/functional@v1.3.0/library/Either.js";

const containerA = Either.Right(42).map(x => x + 2);
const containerB = Either.Left(new Error("The value is not 42.")).map(x => x + 2);
const containerC = containerB.alt(containerA);

assert(Either.Right.is(containerA));
assert(containerA.extract() === 44);
assert(Either.Left.is(containerB));
assert(Either.Right(containerC));
```

---

Traverse is an experimental feature; The Naturility law test is failing.

---

## IO

The `IO` type represents a call to IO. Any Functional Programming purist would tell you that your functions has
to be pure... But in the real world, this is not very useful. Wrapping your call to IO with `IO` will enable you
to postpone the side-effect and keep your program (somewhat) pure.

The `IO` type implements the following algebras:
- [x] Monad

### Example

```js
import IO from "https://deno.land/x/functional@v1.3.0/library/IO.js";

const container = IO(_ => readFile(`${Deno.cwd()}/dump/hoge`))
  .map(promise => promise.then(text => text.split("\n")));
// File isn't being read yet. Still pure.

assert(IO.is(containerA));

const promise = container.run();
// Now, the file is being read.

const lines = await promise;
```

---

## Maybe

The `Maybe` is the most common sum type; it represents the possibility of a value being `null` or `undefined`.

The `Maybe` type implements the following algebras:
- [x] Alternative
- [x] Comonad
- [x] Monad

### Example

```js
import Maybe from "https://deno.land/x/functional@v1.3.0/library/Maybe.js";

const containerA = Maybe.Just(42).map(x => x + 2);
const containerB = Maybe.Nothing.map(x => x + 2);

assert(Maybe.Just.is(containerA));
assert(containerA.extract() === 44);
assert(Maybe.Nothing.is(containerB));
```

---

Traverse is an experimental feature; The Naturility law test is failing.

---

## Pair

The `Pair` type represents two values.

The `Pair` type implements the following algebras:
- [x] Bifunctor
- [x] Functor

### Example

```js
import Pair from "https://deno.land/x/functional@v1.3.0/library/Pair.js";

const pair = Pair(42, 42)
  .bimap(
    x => x * 2,
    x => x + 2
  );

assert(Pair.is(pair));
assert(pair.first === 84);
assert(pair.first === 44);
```

---

## Task

The `Task` type is similar in concept to `IO`; it helps keep your function pure when you are working with `IO`.
The biggest difference with `IO` is that this type considers Promise as first-class citizen. Also, it always resolves
to an instance of `Either`; `Either.Right` for a success, `Either.Left` for a failure.

The `IO` type implements the following algebras:
- [x] Monad

### Example

```js
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";

const containerA = Task(_ => readFile(`${Deno.cwd()}/dump/hoge`))
  .map(text => text.split("\n"));
// File isn't being read yet. Still pure.

assert(Task.is(containerA));

const containerB = await container.run();
// Now, the file is being read.

assert(Either.Right.is(containerB));
// The call was successful!

const lines = containerB.extract();
```

The `Task` factory comes with a special utility method called `wrap`. The result of any function called with `wrap`
will be memoized allowing for safe "logic-forks".

Take the following example; `containerD` contains the raw text, `containerE` contains the text into lines and
`containerF` contains the lines in inverted order. Because `run` was called thrice, the file was read thrice. 😐

```js
let count = 0;
const containerA = Task(_ => ++count && readFile(`${Deno.cwd()}/dump/hoge`));
const containerB = containerA.map(text => text.split("\n"));
const containerC = containerB.map(lines => text.reverse());

assert(Task.is(containerA));
assert(Task.is(containerB));
assert(Task.is(containerC));

const containerD = await containerA.run();
const containerE = await containerB.run();
const containerF = await containerC.run();

assert(count === 3);
```

Definitely not what we want... Simply wrap the function and bim bam boom - memoization magic! (The file will only be
read once) 🤩

Please check-out [Functional IO](https://github.com/sebastienfilion/functional-deno-io) for more practical examples.

---

## Type factory

The Type factory can be used to build complex data structure.

```js
import { factorizeType } from "https://deno.land/x/functional@v1.3.0/library/factories.js";

const Coordinates = factorizeType("Coordinates", [ "x", "y" ]);
const vector = Coordinates(150, 200);
// vector.x === 150
// vector.y === 200
```

### Type`.from`
`Type ~> Object → t`

Create an instance of Type using an object representation.

```js
const vector = Coordinates.from({ x: 150, y: 200 });
// vector.x === 150
// vector.y === 200
```

### Type`.is`
`Type ~> Type t → Boolean`

Assert that an instance is of the same Type.

```js
Coordinates.is(vector);
// true
```

### Type`.toString`
`Type ~> () → String`

Serialize the Type Representation into a string.

```js
Coordinates.toString();
// "Coordinates"
```

### Type(a)`.toString`
`Type t => t ~> () → String`

Serialize the instance into a string.

```js
vector.toString();
// "Coordinates(150, 200)"
```

## Sum Type factory

```js
import { factorizeSumType } from "https://deno.land/x/functional@v1.3.0/library/factories.js";

const Shape = factorizeSumType(
  "Shape",
  {
    // Square :: (Coord, Coord) → Shape
    Square: [ "topLeft", "bottomRight" ],
    // Circle :: (Coord, Number) → Shape
    Circle: [ "center", "radius" ]
  }
);
```

### SumType`.from`
`SumType ~> Object → t`

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

### SumType`.is`
`SumType ~> SumType t → Boolean`

Assert that an instance is of the same Sum Type.

```js
Shape.Circle.is(oval);
// true
```

### SumType`#fold`

```js
Shape.prototype.translate = function (x, y, z) {
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

### SumType(a)`.toString`
` SumType t => t ~> () → String`

Serialize the instance into a string.

```js
oval.toString();
// "Shape.Circle(Coordinates(150, 200), 200)"
```

@function
@name factorizeType
@module functional/SumType

@description Factorize a Type Representation.
@param {String} typeName
@param {String[]} propertyNameList
@return {Function}

@example
const Coordinates = factorizeType("Coordinates", [ "x", "y" ]);
const vector = Coordinates(150, 200);
// vector.x === 150
// vector.y === 200

---

## Utilities

### `assertIsArray`
`* → Boolean`

### `assertIsBoolean`
`* → Boolean`

### `assertIsFunction`
`* → Boolean`

### `assertIsInstance`
`* → Boolean`

### `assertIsNull`
`* → Boolean`

### `assertIsNumber`
`* → Boolean`

### `assertIsObject`
`* → Boolean`

### `assertIsRegex`
`* → Boolean`

### `assertIsString`
`* → Boolean`

### `assertIsUndefined`
`* → Boolean`

### `decodeRaw`
`Uint8Array → String`

### `encodeText`
`String → Uint8Array`

### `chainLift`
`(a → b → c) → Chainable a → Functor b → Chainable c`

This function is similar to [`lift`](https://ramdajs.com/docs/#lift) but is chainable.

```js
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";
import { chainLift } from "https://deno.land/x/functional@v1.3.0/library/utilities.js";

const hogeFuga = useWith(
  chainLift(curry((x, y) => Task.of(x * y))),
  [
    x => Task.of(x),
    x => Task.of(x)
  ]
);

const container = await hogeFuga(42, 24).run();

const value = safeExtract("Failed.", container);

assertEquals(value, 1008);
```

### `chainRec`
`ChainRec r => ((a → c, b → c, a) → r c) → a → r b`

This function is a combinator for the [`chainRec` algebra](https://github.com/fantasyland/fantasy-land#chainrec).
It takes a ternary function, an initial value and, a chainable recursive functor.

```js
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";
import { chainRec } from "https://deno.land/x/functional@v1.3.0/library/utilities.js";

const multiplyAll = curry((x, n) => chainRec(
  (Loop, Done, cursor) =>
    cursor === n ? Done(Pair(cursor, null)) : Loop(Pair(cursor + 1, Task.of([ x * (cursor + 1) ]))),
  0
));

const container = await multiplyAll(42, 10)(Task.of([ 0 ])).run();

const value = safeExtract("Failed.", container);

assertEquals(value, [ 0, 42, 84, 126, 168, 210, 252, 294, 336, 378, 420 ]);
```

### `evert`
`Applicative a => a → a[] → a`

This function takes a type constructor and, a list of Applicative functor and evert it; effectively making an Applicative
functor of a list of value.

```js
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";
import { evert } from "https://deno.land/x/functional@v1.3.0/library/utilities.js";

const container = await evert(Task, [ Task.of(42), Task.of(32), Task.of(24) ]).run();

const list = safeExtract("Failed.", container);

assertEquals(list, [ 42, 32, 24 ]);
```

### `log`
`String → a → a`

This function is a composable `console.debug`. It takes a message, a value and, return the value.

### `runSequentially`
`Chain c => (...c) → c`

This function takes n Chainable functor and chain them automatically.

```js
import Task from "https://deno.land/x/functional@v1.3.0/library/Task.js";
import { runSequentially } from "https://deno.land/x/functional@v1.3.0/library/utilities.js";

const fuga = converge(
  runSequentially,
  [
    x => Task.of(x * 2),
    x => Task.of(x + 2)
  ]
);

const container = await fuga(42).run();

const value = safeExtract("Failed.", container);

assertEquals(value, 44);
```

### `safeExtract`
`String → Either a → a`

This function takes a message and an Either container; if the container is `Either.Right`, the value will be
returned. But if the container is `Either.Left`, it will throw an error with the message passed.

### `stream`
`((a, b) → a) → a → AsyncIterable b → a`

---

## TypeScript

You can import any types or the factories through `mod.ts`.

```ts
import { Either, IO, Maybe, Task, factorizeType, factorySumType } from "https://deno.land/x/functional@v1.3.0/mod.ts";
```

Or, you can import individual sub-module with the appropriate TypeScript hint in Deno.

```ts
// @deno-types="https://deno.land/x/functional@v1.3.0/library/Either.d.ts"
import Either from "https://deno.land/x/functional@v1.3.0/library/Either.js";
```
 
---

## License

Copyright © 2020 - Sebastien Filion

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
