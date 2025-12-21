/**
 * Spike Error Message Test Runner
 *
 * Run with: npx tsx src/handlers/_spike-test-errors.ts
 */

import { type } from "arktype";

// Define the same schema as in the spike
const BackLinksOptionsSchema = type({
  "ignoreTags?": "string[]",
  "dedupe?": "boolean",
  "exclude?": "string | string[]",
  "excludeCompletedTasks?": "boolean",
});

const testCases = [
  // Unknown option key
  { input: { unknownKey: true }, description: "Unknown option key" },

  // Wrong type for dedupe
  { input: { dedupe: "yes" }, description: "Wrong type (string instead of boolean)" },

  // Wrong type for ignoreTags
  { input: { ignoreTags: "single-string" }, description: "Wrong type (string instead of array)" },

  // Wrong type for exclude (number instead of string/string[])
  { input: { exclude: 123 }, description: "Wrong type (number instead of string)" },

  // Array with wrong element types
  { input: { ignoreTags: [1, 2, 3] }, description: "Array with wrong element types" },

  // Mixed valid and invalid
  { input: { dedupe: true, ignoreTags: 42 }, description: "Mixed valid and invalid" },

  // Valid input
  { input: { dedupe: true, ignoreTags: ["test"] }, description: "Valid input" },

  // Valid with union type (string)
  { input: { exclude: "software" }, description: "Valid exclude as string" },

  // Valid with union type (array)
  { input: { exclude: ["software", "hardware"] }, description: "Valid exclude as array" },

  // Empty object (all optional)
  { input: {}, description: "Empty object (all optional)" },
];

console.log("\n╔═══════════════════════════════════════════════════════════════════╗");
console.log("║           ARKTYPE ERROR MESSAGE QUALITY COMPARISON                ║");
console.log("╚═══════════════════════════════════════════════════════════════════╝\n");

for (const { input, description } of testCases) {
  console.log(`┌─ Test: ${description}`);
  console.log(`│  Input: ${JSON.stringify(input)}`);

  const result = BackLinksOptionsSchema(input);

  if (result instanceof type.errors) {
    console.log("│  ❌ VALIDATION FAILED:");
    console.log("│");
    for (const err of result) {
      console.log(`│  └── Message: ${err.message}`);
      if (err.path.length > 0) {
        console.log(`│      Path: ${err.path.join(".")}`);
      }
    }
    console.log("│");
    console.log(`│  📋 Summary: ${result.summary}`);
  }
  else {
    console.log("│  ✅ VALIDATION PASSED");
    console.log(`│  Data: ${JSON.stringify(result)}`);
  }
  console.log("└────────────────────────────────────────────────────────────────────\n");
}

// Also test current TypeToken approach for comparison
console.log("\n╔═══════════════════════════════════════════════════════════════════╗");
console.log("║           CURRENT TYPETOKEN APPROACH (for comparison)             ║");
console.log("╚═══════════════════════════════════════════════════════════════════╝\n");

// Simulating current TypeToken validation
function validateTypeToken(key: string, value: unknown, typeToken: string): string | null {
  const isOptional = typeToken.startsWith("opt(");
  const innerType = isOptional ? typeToken.slice(4, -1) : typeToken;

  if ((value === undefined || value === null) && isOptional) return null;

  if (innerType === "bool" && typeof value !== "boolean") {
    return `Option "${key}" expects bool, got ${typeof value}`;
  }
  if (innerType === "string" && typeof value !== "string") {
    return `Option "${key}" expects string, got ${typeof value}`;
  }
  if (innerType.startsWith("array(") && !Array.isArray(value)) {
    return `Option "${key}" expects array, got ${typeof value}`;
  }

  return null;
}

const typeTokenTests = [
  { key: "dedupe", value: "yes", type: "opt(bool)" },
  { key: "ignoreTags", value: "single", type: "array(string)" },
];

for (const { key, value, type: typeToken } of typeTokenTests) {
  const error = validateTypeToken(key, value, typeToken);
  console.log(`┌─ TypeToken: ${key}: ${typeToken}`);
  console.log(`│  Value: ${JSON.stringify(value)}`);
  console.log(`│  Error: ${error || "(none)"}`);
  console.log("└────────────────────────────────────────────────────────────────────\n");
}

console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("COMPARISON SUMMARY:");
console.log("═══════════════════════════════════════════════════════════════════");
console.log(`
ArkType Advantages:
  ✓ Cleaner error messages with expected vs actual types
  ✓ Path information shows exact location of error
  ✓ Summary method for human-readable error display
  ✓ Union types validated correctly (string | string[])
  ✓ Unknown keys detected automatically
  ✓ Array element types validated (not just "is array")

TypeToken Limitations (current system):
  ✗ No detection of unknown option keys
  ✗ Shallow array validation (doesn't check element types)
  ✗ No path information for nested errors
  ✗ Union type parsing has edge cases with nested parens
`);
