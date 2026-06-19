const assert = require("assert");
const { greet } = require("./hello");

assert.strictEqual(greet("world"), "Hello, world!");
assert.strictEqual(greet("Claude"), "Hello, Claude!");

console.log("All tests passed.");
