import { Task, apBinary, compose2, map } from "../mod.ts";
import { assertEquivalent, test } from "./testing.ts";

interface User {
  email: string;
  ID: string;
  username: string;
}

const fetchUser = (userID: string) => Task.of({ email: "hoge@gmail.com", ID: userID, username: "hoge" });

test ("Scenario 1")
  (async () => {
    const sayHello = compose2
      (map
        (apBinary
            ((username: string) => (email: string) => `Hello, ${username} (${email})!`)
            ((user: User) => user.username)
            ((user: User) => user.email)))
      (fetchUser);

    assertEquivalent
      (await sayHello("e135841d-0a5d-4b72-816f-d84238c3f9c9").run())
      (await Task.of("Hello, hoge (hoge@gmail.com)!").run());
  });

test ("Scenario 1: Classic")
  (async () => {
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
  });