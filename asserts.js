import { assert, assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

const $$value = Symbol.for("TypeValue");
const $$tag = Symbol.for("Tag");

export const assertIsDefined = value => typeof value  !== "undefined";
export const assertIsEquivalent = (containerA, containerB) => assert(isEquivalent(containerA, containerB));
export const assertIsNone = value => !value && typeof value === "object";

// isEquivalent :: Setoid a|a -> Setoid b|b -> Boolean
export const isEquivalent = (containerA, containerB) => {
  // When the container are Setoids...
  if (Reflect.getPrototypeOf(containerA).hasOwnProperty("equals")) return containerA.equals(containerB);
  else if (
    Reflect.has(containerA, $$value) && Reflect.has(containerB, $$value)
    && containerA[$$tag] === containerB[$$tag]
  ) {
    return !assertEquals(containerA[$$value], containerB[$$value]);
  } else if (Reflect.has(containerA, $$tag) && Reflect.has(containerB, $$tag)) {

    return containerA[$$tag] === containerB[$$tag];
  } else return false;
};
