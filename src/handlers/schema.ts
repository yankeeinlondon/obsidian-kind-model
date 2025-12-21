/**
 * ArkType Schema Utilities for KM Handlers
 *
 * This module provides the schema layer for km handlers, replacing the
 * TypeToken string-based system with ArkType for unified runtime validation
 * and TypeScript type inference.
 *
 * ## Key Benefits
 * 1. Single source of truth: Schema defines BOTH runtime validation AND TypeScript types
 * 2. Rich error messages: ArkType provides detailed, actionable errors
 * 3. Type inference: No explicit type annotations needed in handler implementations
 *
 * ## TypeToken to ArkType Translation Reference
 *
 * | TypeToken              | ArkType                    | Example                           |
 * |------------------------|----------------------------|-----------------------------------|
 * | `"string"`             | `"string"`                 | `name: "string"`                  |
 * | `"number"`             | `"number"`                 | `count: "number"`                 |
 * | `"bool"`               | `"boolean"`                | `enabled: "boolean"`              |
 * | `"opt(bool)"`          | `"boolean?"` or key `?`    | `"enabled?": "boolean"`           |
 * | `"array(string)"`      | `"string[]"`               | `tags: "string[]"`                |
 * | `"opt(string)"`        | `"string?"`                | `"name?": "string"`               |
 * | `"enum(a,b,c)"`        | `"'a' | 'b' | 'c'"`        | `mode: "'fast' | 'slow'"`         |
 * | `"string|array(string)"` | `"string | string[]"`    | `exclude: "string | string[]"`    |
 *
 * @module handlers/schema
 */

import { type, Type } from "arktype";

// Re-export arktype's type function and Type for convenience
export { type, Type };

/**
 * Type alias for ArkType errors - used for validation error handling
 */
export type ArkErrors = InstanceType<typeof type.errors>;

/**
 * Result of schema validation - either success with typed data or failure with errors
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ArkErrors };

/**
 * Validate data against an ArkType schema.
 *
 * @param schema - The ArkType schema to validate against
 * @param data - The data to validate
 * @returns ValidationResult with either typed data or errors
 *
 * @example
 * ```ts
 * const schema = type({ name: "string", "age?": "number" });
 * const result = validateWithSchema(schema, { name: "John" });
 * if (result.success) {
 *   console.log(result.data.name); // Typed as string
 * } else {
 *   console.log(result.errors.summary);
 * }
 * ```
 */
export function validateWithSchema<T>(
  schema: Type<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema(data);

  if (result instanceof type.errors) {
    return { success: false, errors: result };
  }

  return { success: true, data: result };
}

/**
 * Format ArkType errors into human-readable strings.
 *
 * @param errors - The ArkType errors to format
 * @returns Array of formatted error messages
 *
 * @example
 * ```ts
 * const result = schema({ invalid: "data" });
 * if (result instanceof type.errors) {
 *   const messages = formatArkErrors(result);
 *   // ["Property 'name' is required", "Property 'invalid' is unexpected"]
 * }
 * ```
 */
export function formatArkErrors(errors: ArkErrors): string[] {
  return errors.map((err) => {
    const path = err.path.length > 0 ? `at "${err.path.join(".")}"` : "";
    return `${err.message}${path ? ` ${path}` : ""}`;
  });
}

/**
 * Get a detailed error report from ArkType errors.
 * Useful for rendering rich error displays in the UI.
 *
 * @param errors - The ArkType errors to report on
 * @returns Array of error details with path, expected, and actual values
 */
export function getErrorDetails(errors: ArkErrors): Array<{
  message: string;
  path: string;
  expected: string;
  actual: string;
}> {
  return errors.map(err => ({
    message: err.message,
    path: err.path.join("."),
    expected: err.expected,
    actual: err.actual ?? "undefined",
  }));
}

/**
 * Check if a value is an ArkType errors instance.
 * Useful for type narrowing in validation code.
 *
 * @param value - Value to check
 * @returns True if the value is an ArkType errors instance
 */
export function isArkErrors(value: unknown): value is ArkErrors {
  return value instanceof type.errors;
}

/**
 * Create an optional version of a schema by making all properties optional.
 * This is a convenience wrapper around ArkType's built-in optional syntax.
 *
 * Note: ArkType already supports optional keys with `?` suffix, so this is
 * primarily for programmatic schema composition.
 *
 * @param schema - The schema to make optional
 * @returns A new schema that accepts undefined in addition to the original type
 */
export function optional<T>(schema: Type<T>): Type<T | undefined> {
  return schema.or(type("undefined"));
}

// ============================================================================
// Schema Factory Helpers
// ============================================================================

/**
 * Pre-built common option schemas for reuse across handlers.
 * These match the most common TypeToken patterns used in existing handlers.
 *
 * Note: In ArkType, optionality is expressed in the KEY (e.g., "enabled?": "boolean"),
 * not in the value. These common schemas are just the value types.
 */
export const commonSchemas = {
  /** Boolean - use with optional key like "dedupe?": commonSchemas.bool */
  bool: type("boolean"),

  /** String - use with optional key like "name?": commonSchemas.string */
  string: type("string"),

  /** String array - matches "array(string)" */
  stringArray: type("string[]"),

  /** String or string array - matches "string|array(string)" */
  stringOrStringArray: type("string | string[]"),
} as const;

// ============================================================================
// Handler Schema Types
// ============================================================================

/**
 * Metadata about a registered handler.
 * Used by the registry for autocomplete and validation.
 */
export interface HandlerSchemaMetadata<
  TScalar = unknown,
  TOptions = unknown,
> {
  /** Handler name (PascalCase) */
  name: string;

  /** Schema for scalar (positional) parameters, or null if none */
  scalarSchema: Type<TScalar> | null;

  /** Schema for options hash, or null if none */
  optionsSchema: Type<TOptions> | null;

  /** Human-readable description for autocomplete hints */
  description: string;

  /** Example usages for documentation */
  examples: string[];
}

/**
 * Extract the inferred type from a handler's options schema.
 * This utility type allows handlers to derive their options type from the schema.
 *
 * @example
 * ```ts
 * const schema = type({ "dedupe?": "boolean", "exclude?": "string[]" });
 * type Options = InferOptions<typeof schema>; // { dedupe?: boolean; exclude?: string[] }
 * ```
 */
export type InferOptions<T extends Type<unknown>> = T extends Type<infer U> ? U : never;

/**
 * Extract the inferred type from a handler's scalar schema.
 */
export type InferScalar<T extends Type<unknown>> = T extends Type<infer U> ? U : never;
