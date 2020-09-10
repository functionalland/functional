# Functional

Common Functional Programming Algebraic data types for JavaScript that is compatible with most modern browsers and Deno.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/functional@v0.5.0)
[![deno version](https://img.shields.io/badge/deno-^1.3.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![GitHub release](https://img.shields.io/github/v/release/sebastienfilion/functional)](https://github.com/sebastienfilion/functional/releases)
[![GitHub licence](https://img.shields.io/github/license/sebastienfilion/functional)](https://github.com/sebastienfilion/functional/blob/v0.5.0/LICENSE)
  
# Usage

This example uses the [Ramda library](https://ramdajs.com) - for simplification - but you should be able to use any library that implements
the [Fantasy-land specifications](https://github.com/fantasyland/fantasy-land). 

```js
import { compose, converge, lift, map, prop } from "https://x.nest.land/ramda@0.27.0/source/index.js";
import Either from "https://deno.land/x/functional@v0.5.0/Either.js";
import Task from "https://deno.land/x/functional@v0.5.0/Task.js";

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

// await sayHello(userID).run() === Either.Right(String)
```

### Readmore on [Github →](https://github.com/sebastienfilion/functional)