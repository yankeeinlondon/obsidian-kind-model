/**
 * Phase 0 Spike: ArkType Integration for BackLinks Handler
 *
 * This spike validates:
 * 1. ArkType schema definition for handler options
 * 2. Type inference from schemas (no explicit annotations needed)
 * 3. Integration with curried createHandler pattern
 * 4. Error message quality comparison with TypeToken
 *
 * Created: 2025-12-20
 */

import { type } from "arktype";

// ============================================================================
// 1. DEFINE SCHEMAS WITH ARKTYPE
// ============================================================================

/**
 * BackLinks options schema using ArkType.
 *
 * Translation from TypeToken:
 * - `"array(string)"` → `"string[]"`
 * - `"opt(bool)"` → `"boolean?"` or key with `?`
 * - `"opt(string|array(string))"` → `"string | string[]"` with `?` key
 */
export const BackLinksOptionsSchema = type({
  /**
   * Tags to filter out from backlinks
   */
  "ignoreTags?": "string[]",

  /**
   * Remove backlinks already shown in page body
   * @default true
   */
  "dedupe?": "boolean",

  /**
   * Exclude backlinks by classification (kind, kind/category, or kind/category/subcategory)
   */
  "exclude?": "string | string[]",

  /**
   * Remove backlinks that only appear in completed tasks
   * @default true
   */
  "excludeCompletedTasks?": "boolean",
});

/**
 * Inferred TypeScript type - NO explicit annotation needed!
 * This is the key benefit of ArkType: single source of truth.
 */
export type BackLinksOptions = typeof BackLinksOptionsSchema.infer;

// Type test: Verify the inferred type matches expectations
// (This would be a compile-time check in a .test.ts file)
const _typeTest: BackLinksOptions = {
  ignoreTags: ["test"],
  dedupe: true,
  exclude: "software",
  excludeCompletedTasks: false,
};

// Also valid with array exclude
const _typeTest2: BackLinksOptions = {
  exclude: ["software", "hardware/automation"],
};

// Also valid with no options (all optional)
const _typeTest3: BackLinksOptions = {};

// ============================================================================
// 2. DEMONSTRATE SCHEMA VALIDATION
// ============================================================================

/**
 * Validate options using ArkType schema.
 * Returns validated data with proper TypeScript types, or errors.
 */
export function validateBackLinksOptions(rawOptions: unknown): {
  success: true;
  data: BackLinksOptions;
} | {
  success: false;
  errors: string[];
} {
  const result = BackLinksOptionsSchema(rawOptions);

  if (result instanceof type.errors) {
    // ArkType provides detailed error messages
    return {
      success: false,
      errors: result.map(err => err.message),
    };
  }

  return {
    success: true,
    data: result,
  };
}

// ============================================================================
// 3. ERROR MESSAGE QUALITY COMPARISON
// ============================================================================

/**
 * Compare error messages between current TypeToken and ArkType approaches.
 */
export function compareErrorMessages() {
  const testCases = [
    // Unknown option key
    { input: { unknownKey: true }, description: "Unknown option key" },

    // Wrong type for dedupe
    { input: { dedupe: "yes" }, description: "Wrong type (string instead of boolean)" },

    // Wrong type for ignoreTags
    { input: { ignoreTags: "single-string" }, description: "Wrong type (string instead of array)" },

    // Wrong type for exclude (number instead of string/string[])
    { input: { exclude: 123 }, description: "Wrong type (number instead of string)" },

    // Valid input
    { input: { dedupe: true, ignoreTags: ["test"] }, description: "Valid input" },
  ];

  console.log("\n=== ArkType Error Message Quality ===\n");

  for (const { input, description } of testCases) {
    console.log(`Case: ${description}`);
    console.log(`Input: ${JSON.stringify(input)}`);

    const result = BackLinksOptionsSchema(input);

    if (result instanceof type.errors) {
      console.log("Errors:");
      for (const err of result) {
        console.log(`  - ${err.message}`);
        console.log(`    Path: ${err.path.join(".")}`);
        console.log(`    Expected: ${err.expected}`);
        console.log(`    Actual: ${err.actual}`);
      }
    }
    else {
      console.log("Result: Valid");
      console.log(`  Data: ${JSON.stringify(result)}`);
    }
    console.log("");
  }
}

// ============================================================================
// 4. INTEGRATION WITH CURRIED HANDLER PATTERN
// ============================================================================

import type { Type } from "arktype";
import type { Dictionary } from "inferred-types";

/**
 * Handler event with ArkType-inferred types.
 */
interface ArkTypeHandlerEvent<
  THandler extends string,
  TScalar extends Dictionary,
  TOptions,
> {
  handler: THandler;
  scalar: TScalar;
  options: TOptions;
  // ... other event properties would go here
}

/**
 * Prototype of ArkType-aware createHandler.
 *
 * Key insight: The curried pattern works because TypeScript can infer
 * the generic type from the schema parameter. We use `Type.infer` to
 * extract the validated type.
 */
function createArkTypeHandler<THandler extends string>(handler: THandler) {
  return {
    /**
     * Define scalar parameters (unchanged from current system for now).
     */
    scalar: <S extends readonly string[]>(..._scalarDefs: S) => ({
      /**
       * Define options schema using ArkType.
       * The schema's inferred type flows through to the handler function.
       */
      optionsSchema: <T>(schema: Type<T>) => ({
        /**
         * Provide the handler function.
         * Note: options parameter is automatically typed from the schema!
         */
        handler: (
          handlerFn: (
            event: ArkTypeHandlerEvent<THandler, Record<string, unknown>, T>
          ) => Promise<boolean | Error>,
        ) => {
          // Return the handler factory (curried with plugin)
          return {
            handlerName: handler,
            schema,
            handlerFn,
          };
        },
      }),
    }),
  };
}

// ============================================================================
// 5. PROOF OF CONCEPT: BackLinks with ArkType
// ============================================================================

/**
 * BackLinks handler defined with ArkType schema.
 *
 * Key observations:
 * 1. Schema defined ONCE - provides both runtime validation AND TypeScript types
 * 2. Handler function receives properly typed `options` parameter
 * 3. No explicit type annotations needed in handler implementation
 */
export const BackLinksWithArkType = createArkTypeHandler("BackLinks")
  .scalar() // No scalar params for BackLinks
  .optionsSchema(BackLinksOptionsSchema)
  .handler(async (evt) => {
    // TypeScript knows the exact shape of options!
    const { options } = evt;

    // These all have correct types inferred from schema:
    const ignoreTags = options.ignoreTags; // string[] | undefined
    const dedupe = options.dedupe; // boolean | undefined
    const exclude = options.exclude; // string | string[] | undefined
    const excludeCompleted = options.excludeCompletedTasks; // boolean | undefined

    console.log("Handler received options:", {
      ignoreTags,
      dedupe,
      exclude,
      excludeCompleted,
    });

    // TypeScript would error on invalid property access:
    // const invalid = options.nonExistentProp; // Error!

    return true;
  });

// ============================================================================
// 6. ADDITIONAL TYPE TESTS
// ============================================================================

/**
 * These tests verify type inference at compile time.
 * If any of these fail to compile, the spike has identified an issue.
 */

// Test 1: Verify schema type matches expected structure
type ExpectedOptions = {
  ignoreTags?: string[];
  dedupe?: boolean;
  exclude?: string | string[];
  excludeCompletedTasks?: boolean;
};

// This assignment would fail if types don't match
const _schemaTypeTest: ExpectedOptions = {} as BackLinksOptions;
const _reverseTest: BackLinksOptions = {} as ExpectedOptions;

// Test 2: Verify validation result type
const validationResult = validateBackLinksOptions({ dedupe: true });
if (validationResult.success) {
  // data should be properly typed
  const _data: BackLinksOptions = validationResult.data;
}

// Test 3: Verify handler schema is accessible
const _handlerSchema = BackLinksWithArkType.schema;

// ============================================================================
// 7. RUN COMPARISON (for manual testing)
// ============================================================================

// Uncomment to run error message comparison:
// compareErrorMessages();

export { compareErrorMessages as runSpikeComparison };
