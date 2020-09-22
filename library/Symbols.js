export const $$debug = Symbol.for("TaskDebug");
export const $$inspect = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
export const $$returnType = Symbol.for("ReturnType");
export const $$tag = Symbol.for("Tag");
export const $$tagList = Symbol.for("TagList");
export const $$type = Symbol.for("Type");
export const $$value = Symbol.for("Value");
export const $$valueList = Symbol.for("ValueList");
