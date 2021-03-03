## Usage

The module exports all the algebraic data-types, the aviary and, various utility functions.   

```ts
import { Task, apBinary, compose2, map } from "https://deno.land/x/functional@v1.3.4/mod.ts";

interface User {
  email: string;
  ID: string;
  username: string;
}

const fetchUser = (userID: string) => Task.of({ email: "hoge@gmail.com", ID: userID, username: "hoge" });

const sayHello = compose2(
  map(
    apBinary(
      (username: string) => (email: string) => `Hello, ${username} (${email})!`,
      (user: User) => user.username,
      (user: User) => user.email
    )
  ),
  fetchUser
);

assertEquivalent(
  await sayHello("e135841d-0a5d-4b72-816f-d84238c3f9c9").run(),
  await Task.of("Hello, hoge (hoge@gmail.com)!").run()
);
```

The equivalent functions are also available in pure JavaScript. You can either import the bundle or, the source file.

```js
import { Task, apBinary, compose2, map } from "https://deno.land/x/functional@v1.3.4/functional.js";
```
```js
import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
import { map } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
import { apBinary, compose2 } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
```

Finally, all `.d.ts` files are available at the same level as the source file.
```js
// @deno-types="./library/Task.d.ts"
import Task from "https://deno.land/x/functional@v1.3.4/library/Task.js";
// @deno-types="./library/algebraic.d.ts"
import { map } from "https://deno.land/x/functional@v1.3.4/library/algebraic.js";
// @deno-types="./library/aviary.d.ts"
import { apBinary, compose2 } from "https://deno.land/x/functional@v1.3.4/library/aviary.js";
```
