import { describe, expect, it } from "vitest";

/**
 * Test the jsObjectToJson conversion that was added to parseParams.ts
 * This function converts JS object literal syntax to valid JSON.
 */

// Replicate the function for testing
function jsObjectToJson(input: string): string {
  return input.replace(
    /([{,]\s*)([a-z_$][\w$]*)\s*:/gi,
    '$1"$2":',
  );
}

// Replicate option validation for testing
function validateOptions(
  name: string,
  optionsHash: Record<string, unknown>,
  validOptions: Record<string, string>,
): { valid: true } | { valid: false; error: string } {
  const validKeys = Object.keys(validOptions);
  const providedKeys = Object.keys(optionsHash);
  const invalidKeys = providedKeys.filter(key => !validKeys.includes(key));

  if (invalidKeys.length > 0) {
    return {
      valid: false,
      error: `The "${name}" handler received unknown option(s): ${invalidKeys.map(k => `"${k}"`).join(", ")}. Valid options are: ${validKeys.map(k => `"${k}"`).join(", ")}`,
    };
  }

  return { valid: true };
}

describe("jsObjectToJson", () => {
  it("should convert unquoted keys to quoted keys", () => {
    expect(jsObjectToJson("{foo: true}")).toBe('{"foo": true}');
    expect(jsObjectToJson("{bar: false}")).toBe('{"bar": false}');
    expect(jsObjectToJson('{baz: "value"}'))
      .toBe('{"baz": "value"}');
  });

  it("should handle multiple keys", () => {
    expect(jsObjectToJson("{foo: true, bar: false}"))
      .toBe('{"foo": true, "bar": false}');
  });

  it("should handle nested objects", () => {
    expect(jsObjectToJson("{outer: {inner: true}}"))
      .toBe('{"outer": {"inner": true}}');
  });

  it("should preserve already-quoted keys", () => {
    expect(jsObjectToJson('{"foo": true}')).toBe('{"foo": true}');
    expect(jsObjectToJson('{"foo": true, bar: false}'))
      .toBe('{"foo": true, "bar": false}');
  });

  it("should handle keys with underscores and numbers", () => {
    expect(jsObjectToJson("{foo_bar: true}")).toBe('{"foo_bar": true}');
    expect(jsObjectToJson("{key123: true}")).toBe('{"key123": true}');
    expect(jsObjectToJson("{_private: true}")).toBe('{"_private": true}');
  });

  it("should handle keys starting with $", () => {
    expect(jsObjectToJson("{$key: true}")).toBe('{"$key": true}');
  });

  it("should handle whitespace around colons", () => {
    expect(jsObjectToJson("{foo : true}")).toBe('{"foo": true}');
    expect(jsObjectToJson("{foo  :  true}")).toBe('{"foo":  true}');
  });

  it("should handle whitespace after comma", () => {
    expect(jsObjectToJson("{foo: true,  bar: false}"))
      .toBe('{"foo": true,  "bar": false}');
  });

  it("should produce valid JSON when wrapped in array", () => {
    const input = "{dedupe: false}";
    const converted = jsObjectToJson(input);
    const parsed = JSON.parse(`[${converted}]`);
    expect(parsed).toEqual([{ dedupe: false }]);
  });

  it("should handle the BackLinks use case", () => {
    const input = "{dedupe: false, excludeCompletedTasks: true}";
    const converted = jsObjectToJson(input);
    const parsed = JSON.parse(`[${converted}]`);
    expect(parsed).toEqual([{ dedupe: false, excludeCompletedTasks: true }]);
  });

  it("should handle array values", () => {
    const input = '{exclude: ["software", "hardware"]}';
    const converted = jsObjectToJson(input);
    const parsed = JSON.parse(`[${converted}]`);
    expect(parsed).toEqual([{ exclude: ["software", "hardware"] }]);
  });

  it("should handle string with scalar params before options", () => {
    const input = '"kind1", "kind2", {dedupe: false}';
    const converted = jsObjectToJson(input);
    const parsed = JSON.parse(`[${converted}]`);
    expect(parsed).toEqual(["kind1", "kind2", { dedupe: false }]);
  });
});

// Replicate type validation for testing
function matchesSingleType(value: unknown, type: string): boolean {
  if (type === "bool") return typeof value === "boolean";
  if (type === "string") return typeof value === "string";
  if (type === "number") return typeof value === "number";
  if (type.startsWith("array(")) return Array.isArray(value);
  return true;
}

function validateOptionType(key: string, value: unknown, typeToken: string): string | null {
  const isOptional = typeToken.startsWith("opt(");
  const innerType = isOptional ? typeToken.slice(4, -1) : typeToken;

  if ((value === undefined || value === null) && isOptional) {
    return null;
  }

  // Handle union types
  const unionTypes = innerType.split("|").map(t => t.trim());
  const matchesAny = unionTypes.some(type => matchesSingleType(value, type));

  if (!matchesAny) {
    const expectedDesc = unionTypes.length > 1 ? unionTypes.join(" or ") : unionTypes[0];
    return `Option "${key}" expects ${expectedDesc}, got ${typeof value}`;
  }

  return null;
}

describe("Option validation", () => {
  const backLinksOptions = {
    ignoreTags: "array(string)",
    dedupe: "opt(bool)",
    exclude: "opt(array(string))",
    excludeCompletedTasks: "opt(bool)",
  };

  it("should accept valid options", () => {
    const result = validateOptions("BackLinks", { dedupe: false }, backLinksOptions);
    expect(result.valid).toBe(true);
  });

  it("should accept multiple valid options", () => {
    const result = validateOptions(
      "BackLinks",
      { dedupe: false, excludeCompletedTasks: true },
      backLinksOptions,
    );
    expect(result.valid).toBe(true);
  });

  it("should reject unknown options", () => {
    const result = validateOptions("BackLinks", { huh: true }, backLinksOptions);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain('"huh"');
      expect(result.error).toContain('unknown option');
    }
  });

  it("should list valid options in error message", () => {
    const result = validateOptions("BackLinks", { invalid: true }, backLinksOptions);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain('"ignoreTags"');
      expect(result.error).toContain('"dedupe"');
      expect(result.error).toContain('"exclude"');
      expect(result.error).toContain('"excludeCompletedTasks"');
    }
  });

  it("should reject multiple unknown options", () => {
    const result = validateOptions("BackLinks", { foo: 1, bar: 2 }, backLinksOptions);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain('"foo"');
      expect(result.error).toContain('"bar"');
    }
  });

  it("should accept empty options hash", () => {
    const result = validateOptions("BackLinks", {}, backLinksOptions);
    expect(result.valid).toBe(true);
  });
});

describe("Option type validation", () => {
  it("should accept boolean for opt(bool)", () => {
    expect(validateOptionType("dedupe", true, "opt(bool)")).toBeNull();
    expect(validateOptionType("dedupe", false, "opt(bool)")).toBeNull();
  });

  it("should reject string for opt(bool)", () => {
    const error = validateOptionType("dedupe", "bob", "opt(bool)");
    expect(error).not.toBeNull();
    expect(error).toContain("expects bool");
    expect(error).toContain("got string");
  });

  it("should reject number for opt(bool)", () => {
    const error = validateOptionType("dedupe", 123, "opt(bool)");
    expect(error).not.toBeNull();
    expect(error).toContain("expects bool");
  });

  it("should accept undefined for optional types", () => {
    expect(validateOptionType("dedupe", undefined, "opt(bool)")).toBeNull();
    expect(validateOptionType("dedupe", null, "opt(bool)")).toBeNull();
  });

  it("should accept array for array(string)", () => {
    expect(validateOptionType("tags", ["a", "b"], "array(string)")).toBeNull();
    expect(validateOptionType("tags", [], "array(string)")).toBeNull();
  });

  it("should reject non-array for array(string)", () => {
    const error = validateOptionType("tags", "not-an-array", "array(string)");
    expect(error).not.toBeNull();
    expect(error).toContain("expects array(string)");
  });

  it("should accept string for string type", () => {
    expect(validateOptionType("name", "test", "string")).toBeNull();
  });

  it("should reject non-string for string type", () => {
    const error = validateOptionType("name", 123, "string");
    expect(error).not.toBeNull();
    expect(error).toContain("expects string");
  });

  it("should accept number for number type", () => {
    expect(validateOptionType("count", 42, "number")).toBeNull();
  });

  it("should reject non-number for number type", () => {
    const error = validateOptionType("count", "42", "number");
    expect(error).not.toBeNull();
    expect(error).toContain("expects number");
  });

  // Union type tests
  it("should accept string for string|array(string)", () => {
    expect(validateOptionType("exclude", "software", "string|array(string)")).toBeNull();
  });

  it("should accept array for string|array(string)", () => {
    expect(validateOptionType("exclude", ["software", "hardware"], "string|array(string)")).toBeNull();
  });

  it("should reject number for string|array(string)", () => {
    const error = validateOptionType("exclude", 123, "string|array(string)");
    expect(error).not.toBeNull();
    expect(error).toContain("string or array(string)");
  });

  it("should accept string for opt(string|array(string))", () => {
    expect(validateOptionType("exclude", "software", "opt(string|array(string))")).toBeNull();
  });

  it("should accept undefined for opt(string|array(string))", () => {
    expect(validateOptionType("exclude", undefined, "opt(string|array(string))")).toBeNull();
  });
});
