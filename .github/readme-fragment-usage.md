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
