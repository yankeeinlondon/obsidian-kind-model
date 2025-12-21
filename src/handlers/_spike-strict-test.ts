/**
 * Test ArkType strict mode for unknown keys
 *
 * Run with: npx tsx src/handlers/_spike-strict-test.ts
 */

import { type } from "arktype";

// Test if there's a way to reject unknown keys

// Option 1: Use .onUndeclaredKey()
const StrictSchema = type({
  "dedupe?": "boolean",
  "ignoreTags?": "string[]",
}).onUndeclaredKey("reject");

console.log("Testing strict mode with onUndeclaredKey('reject'):");
console.log("──────────────────────────────────────────────────\n");

const test1 = StrictSchema({ unknownKey: true });
console.log(`Input: { unknownKey: true }`);
if (test1 instanceof type.errors) {
  console.log(`Result: REJECTED ✅`);
  console.log(`Error: ${test1.summary}`);
}
else {
  console.log(`Result: PASSED (unexpected)`);
}

console.log("");

const test2 = StrictSchema({ dedupe: true });
console.log(`Input: { dedupe: true }`);
if (test2 instanceof type.errors) {
  console.log(`Result: REJECTED (unexpected)`);
  console.log(`Error: ${test2.summary}`);
}
else {
  console.log(`Result: PASSED ✅`);
}

console.log("");

// Option 2: Check if + prefix (required) affects behavior
console.log("\nTesting with + prefix (exact objects):");
console.log("──────────────────────────────────────────────────\n");

const ExactSchema = type({
  "+": "reject",
  "dedupe?": "boolean",
});

const test3 = ExactSchema({ unknownKey: true });
console.log(`Input: { unknownKey: true }`);
if (test3 instanceof type.errors) {
  console.log(`Result: REJECTED ✅`);
  console.log(`Error: ${test3.summary}`);
}
else {
  console.log(`Result: PASSED (unexpected)`);
}
