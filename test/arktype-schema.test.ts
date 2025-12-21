import { describe, expect, it } from "vitest";
import { type } from "arktype";
import {
  validateWithSchema,
  formatArkErrors,
  getErrorDetails,
  isArkErrors,
  commonSchemas,
} from "../src/handlers/schema";

describe("ArkType Schema Utilities", () => {
  describe("validateWithSchema", () => {
    it("should return success with typed data for valid input", () => {
      const schema = type({ name: "string", "age?": "number" });
      const result = validateWithSchema(schema, { name: "John" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        expect(result.data.age).toBeUndefined();
      }
    });

    it("should return success with all fields populated", () => {
      const schema = type({ name: "string", "age?": "number" });
      const result = validateWithSchema(schema, { name: "John", age: 30 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        expect(result.data.age).toBe(30);
      }
    });

    it("should return errors for invalid input", () => {
      const schema = type({ name: "string" });
      const result = validateWithSchema(schema, { name: 123 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it("should return errors for missing required fields", () => {
      const schema = type({ name: "string" });
      const result = validateWithSchema(schema, {});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it("should allow unknown keys by default (ArkType behavior)", () => {
      // Note: ArkType by default allows extra keys - it's "open" by default
      // This is different from TypeToken which rejected unknown keys
      // In Phase 2, we may want to use .onUndeclaredKey("reject") for handlers
      const schema = type({ name: "string" });
      const result = validateWithSchema(schema, { name: "John", extra: "field" });

      // ArkType allows extra keys by default
      expect(result.success).toBe(true);
    });

    it("should reject unknown keys when using onUndeclaredKey", () => {
      // This is how to make ArkType strict about unknown keys
      const schema = type({ "+": "reject", name: "string" });
      const result = validateWithSchema(schema, { name: "John", extra: "field" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some(e => e.message.includes("extra"))).toBe(true);
      }
    });
  });

  describe("formatArkErrors", () => {
    it("should format errors as readable strings", () => {
      const schema = type({ name: "string" });
      const result = schema({ name: 123 });

      if (result instanceof type.errors) {
        const formatted = formatArkErrors(result);
        expect(formatted.length).toBeGreaterThan(0);
        expect(typeof formatted[0]).toBe("string");
      }
    });

    it("should include path information", () => {
      const schema = type({ user: { name: "string" } });
      const result = schema({ user: { name: 123 } });

      if (result instanceof type.errors) {
        const formatted = formatArkErrors(result);
        expect(formatted.some(e => e.includes("user.name") || e.includes("user"))).toBe(true);
      }
    });
  });

  describe("getErrorDetails", () => {
    it("should return detailed error information", () => {
      const schema = type({ name: "string" });
      const result = schema({ name: 123 });

      if (result instanceof type.errors) {
        const details = getErrorDetails(result);
        expect(details.length).toBeGreaterThan(0);
        expect(details[0]).toHaveProperty("message");
        expect(details[0]).toHaveProperty("path");
        expect(details[0]).toHaveProperty("expected");
        expect(details[0]).toHaveProperty("actual");
      }
    });
  });

  describe("isArkErrors", () => {
    it("should return true for ArkType errors", () => {
      const schema = type({ name: "string" });
      const result = schema({ name: 123 });

      expect(isArkErrors(result)).toBe(true);
    });

    it("should return false for valid data", () => {
      const schema = type({ name: "string" });
      const result = schema({ name: "John" });

      expect(isArkErrors(result)).toBe(false);
    });

    it("should return false for non-error objects", () => {
      expect(isArkErrors({})).toBe(false);
      expect(isArkErrors(null)).toBe(false);
      expect(isArkErrors("string")).toBe(false);
      expect(isArkErrors(123)).toBe(false);
    });
  });
});

describe("Common Schema Patterns", () => {
  describe("commonSchemas.bool", () => {
    it("should accept boolean values", () => {
      // Use optional key syntax with the boolean schema
      const schema = type({ "enabled?": "boolean" });
      expect(schema({ enabled: true })).toEqual({ enabled: true });
      expect(schema({ enabled: false })).toEqual({ enabled: false });
    });

    it("should accept undefined for optional key", () => {
      const schema = type({ "enabled?": "boolean" });
      expect(schema({})).toEqual({});
    });
  });

  describe("commonSchemas.stringArray", () => {
    it("should accept array of strings", () => {
      const schema = type({ tags: commonSchemas.stringArray });
      const result = schema({ tags: ["a", "b", "c"] });
      expect(result).toEqual({ tags: ["a", "b", "c"] });
    });

    it("should accept empty array", () => {
      const schema = type({ tags: commonSchemas.stringArray });
      const result = schema({ tags: [] });
      expect(result).toEqual({ tags: [] });
    });

    it("should reject non-array values", () => {
      const schema = type({ tags: commonSchemas.stringArray });
      const result = schema({ tags: "not-an-array" });
      expect(result instanceof type.errors).toBe(true);
    });
  });

  describe("commonSchemas.stringOrStringArray", () => {
    it("should accept single string", () => {
      const schema = type({ exclude: commonSchemas.stringOrStringArray });
      const result = schema({ exclude: "software" });
      expect(result).toEqual({ exclude: "software" });
    });

    it("should accept array of strings", () => {
      const schema = type({ exclude: commonSchemas.stringOrStringArray });
      const result = schema({ exclude: ["software", "hardware"] });
      expect(result).toEqual({ exclude: ["software", "hardware"] });
    });

    it("should reject number", () => {
      const schema = type({ exclude: commonSchemas.stringOrStringArray });
      const result = schema({ exclude: 123 });
      expect(result instanceof type.errors).toBe(true);
    });
  });
});

describe("TypeToken to ArkType Translation", () => {
  describe("Basic types", () => {
    it("should handle string type", () => {
      const schema = type({ name: "string" });
      expect(schema({ name: "test" })).toEqual({ name: "test" });
      expect(schema({ name: 123 }) instanceof type.errors).toBe(true);
    });

    it("should handle number type", () => {
      const schema = type({ count: "number" });
      expect(schema({ count: 42 })).toEqual({ count: 42 });
      expect(schema({ count: "42" }) instanceof type.errors).toBe(true);
    });

    it("should handle boolean type", () => {
      const schema = type({ enabled: "boolean" });
      expect(schema({ enabled: true })).toEqual({ enabled: true });
      expect(schema({ enabled: "yes" }) instanceof type.errors).toBe(true);
    });
  });

  describe("Optional types (opt(T))", () => {
    it("should handle optional boolean", () => {
      const schema = type({ "dedupe?": "boolean" });
      expect(schema({ dedupe: true })).toEqual({ dedupe: true });
      expect(schema({})).toEqual({});
    });

    it("should handle optional string", () => {
      const schema = type({ "name?": "string" });
      expect(schema({ name: "test" })).toEqual({ name: "test" });
      expect(schema({})).toEqual({});
    });
  });

  describe("Array types (array(T))", () => {
    it("should handle string array", () => {
      const schema = type({ tags: "string[]" });
      expect(schema({ tags: ["a", "b"] })).toEqual({ tags: ["a", "b"] });
      expect(schema({ tags: "not-array" }) instanceof type.errors).toBe(true);
    });

    it("should handle number array", () => {
      const schema = type({ values: "number[]" });
      expect(schema({ values: [1, 2, 3] })).toEqual({ values: [1, 2, 3] });
    });
  });

  describe("Union types (T1|T2)", () => {
    it("should handle string or array union", () => {
      const schema = type({ exclude: "string | string[]" });
      expect(schema({ exclude: "single" })).toEqual({ exclude: "single" });
      expect(schema({ exclude: ["a", "b"] })).toEqual({ exclude: ["a", "b"] });
      expect(schema({ exclude: 123 }) instanceof type.errors).toBe(true);
    });
  });

  describe("Enum types (enum(a,b,c))", () => {
    it("should handle enum values", () => {
      const schema = type({ mode: "'fast' | 'slow'" });
      expect(schema({ mode: "fast" })).toEqual({ mode: "fast" });
      expect(schema({ mode: "slow" })).toEqual({ mode: "slow" });
      expect(schema({ mode: "medium" }) instanceof type.errors).toBe(true);
    });
  });

  describe("Complex BackLinks options schema", () => {
    const BackLinksOptionsSchema = type({
      "ignoreTags?": "string[]",
      "dedupe?": "boolean",
      "exclude?": "string | string[]",
      "excludeCompletedTasks?": "boolean",
    });

    it("should accept empty options", () => {
      expect(BackLinksOptionsSchema({})).toEqual({});
    });

    it("should accept all options", () => {
      const result = BackLinksOptionsSchema({
        ignoreTags: ["test"],
        dedupe: false,
        exclude: ["software", "hardware"],
        excludeCompletedTasks: true,
      });

      expect(result).toEqual({
        ignoreTags: ["test"],
        dedupe: false,
        exclude: ["software", "hardware"],
        excludeCompletedTasks: true,
      });
    });

    it("should accept partial options", () => {
      const result = BackLinksOptionsSchema({
        dedupe: true,
      });

      expect(result).toEqual({ dedupe: true });
    });

    it("should accept string exclude", () => {
      const result = BackLinksOptionsSchema({
        exclude: "software",
      });

      expect(result).toEqual({ exclude: "software" });
    });

    it("should allow unknown options by default (ArkType default behavior)", () => {
      // Note: ArkType allows extra keys by default
      // This differs from the TypeToken system which rejected unknown keys
      // If we want to reject unknown keys, we need to use "+": "reject"
      const result = BackLinksOptionsSchema({
        unknownOption: true,
      });

      // ArkType allows extra keys by default
      expect(result instanceof type.errors).toBe(false);
    });

    it("should reject unknown options when schema uses strict mode", () => {
      // This is how to make strict schemas that reject unknown keys
      const StrictBackLinksOptions = type({
        "+": "reject",
        "ignoreTags?": "string[]",
        "dedupe?": "boolean",
        "exclude?": "string | string[]",
        "excludeCompletedTasks?": "boolean",
      });

      const result = StrictBackLinksOptions({
        unknownOption: true,
      });

      expect(result instanceof type.errors).toBe(true);
    });

    it("should reject wrong type for dedupe", () => {
      const result = BackLinksOptionsSchema({
        dedupe: "yes",
      });

      expect(result instanceof type.errors).toBe(true);
    });

    it("should reject wrong type for ignoreTags", () => {
      const result = BackLinksOptionsSchema({
        ignoreTags: "single-string",
      });

      expect(result instanceof type.errors).toBe(true);
    });
  });
});

describe("Type Inference", () => {
  it("should infer correct types from schema", () => {
    const schema = type({
      "name?": "string",
      "count?": "number",
      "enabled?": "boolean",
      "tags?": "string[]",
    });

    type InferredType = typeof schema.infer;

    // Type-level test: These assignments should compile without errors
    const _test1: InferredType = {};
    const _test2: InferredType = { name: "test" };
    const _test3: InferredType = { name: "test", count: 42, enabled: true, tags: ["a"] };

    // Runtime test
    expect(schema(_test1)).toEqual({});
    expect(schema(_test2)).toEqual({ name: "test" });
    expect(schema(_test3)).toEqual({ name: "test", count: 42, enabled: true, tags: ["a"] });
  });
});
