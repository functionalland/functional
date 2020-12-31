## TypeScript

You can import any types or the factories through `mod.ts`.

```ts
import {
  Either,
  IO,
  Maybe,
  Pair,
  Task,
  factorizeType,
  factorySumType
} from "https://deno.land/x/functional@v9.9.9/mod.ts";
```

Or, you can import individual sub-module with the appropriate TypeScript hint in Deno.

```ts
// @deno-types="https://deno.land/x/functional@v9.9.9/library/Either.d.ts"
import Either from "https://deno.land/x/functional@v9.9.9/library/Either.js";
```
 