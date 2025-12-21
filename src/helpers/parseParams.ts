import type { Type } from "arktype";
import type { KindError } from "@yankeeinlondon/kind-error";
import type { Dictionary } from "inferred-types";
import type KindModelPlugin from "~/main";
import type {
  OptionParams,
  OptionsDefn,
  ScalarDefn,
  ScalarParams,
} from "~/types";
import { type } from "arktype";
import { isObject, isString, retainAfter, retainUntil } from "inferred-types";
import { InvalidParameters, ParsingError } from "~/errors";

/**
 * Convert JavaScript object literal syntax to valid JSON.
 * Handles unquoted keys like `{foo: "bar"}` → `{"foo": "bar"}`
 */
function jsObjectToJson(input: string): string {
  // Match unquoted keys that aren't already quoted
  // Handles: {key:, , key:, { key: (with optional whitespace)
  return input.replace(
    /([{,]\s*)([a-z_$][\w$]*)\s*:/gi,
    '$1"$2":',
  );
}

/**
 * Validate that a value matches a single type (not union).
 * Returns true if valid, false if invalid.
 */
function matchesSingleType(value: unknown, type: string): boolean {
  if (type === "bool") {
    return typeof value === "boolean";
  }
  if (type === "string") {
    return typeof value === "string";
  }
  if (type === "number") {
    return typeof value === "number";
  }
  if (type.startsWith("array(")) {
    return Array.isArray(value);
  }
  if (type.startsWith("enum(")) {
    const enumValues = type.slice(5, -1).split(",").map(s => s.trim());
    return enumValues.includes(String(value));
  }
  // Unknown type - be permissive
  return true;
}

/**
 * Validate that a value matches the expected TypeToken type.
 * Returns null if valid, or an error message if invalid.
 *
 * Supports:
 * - Basic types: "bool", "string", "number"
 * - Optional: "opt(type)"
 * - Arrays: "array(type)"
 * - Enums: "enum(a,b,c)"
 * - Union types: "string|array(string)" or "opt(string|array(string))"
 */
function validateOptionType(key: string, value: unknown, typeToken: string): string | null {
  // Handle optional wrapper
  const isOptional = typeToken.startsWith("opt(");
  const innerType = isOptional
    ? typeToken.slice(4, -1) // Remove "opt(" and ")"
    : typeToken;

  // If value is undefined/null and it's optional, that's fine
  if ((value === undefined || value === null) && isOptional) {
    return null;
  }

  // Handle union types (e.g., "string|array(string)")
  const unionTypes = innerType.split("|").map(t => t.trim());

  // Value is valid if it matches ANY of the union types
  const matchesAny = unionTypes.some(type => matchesSingleType(value, type));

  if (!matchesAny) {
    const expectedDesc = unionTypes.length > 1
      ? unionTypes.join(" or ")
      : unionTypes[0];
    return `Option "${key}" expects ${expectedDesc}, got ${typeof value} (${JSON.stringify(value)})`;
  }

  return null; // Valid
}

export function parseQueryParams(_p: KindModelPlugin) {
  return <TScalar extends readonly ScalarDefn[], TOpt extends OptionsDefn>(
    name: string,
  /** the raw string params */
    raw: string,
  /** the scalar property definitions */
    scalar: TScalar,
  /** the options hash definition */
    options: TOpt,
  ): KindError | [ScalarParams<TScalar>, OptionParams<TOpt>] => {
    /** the quantity of scalars that MUST be in place */
    const requiredScalar = scalar.filter(i => !i.includes("opt(")).length;

    const invalid = InvalidParameters.rebase({
      raw,
      scalar,
      options,
      requiredScalar,
    });
    const parsingErr = ParsingError.rebase({
      raw,
      scalar,
      options,
      requiredScalar,
    });

    /** the order of scalar parameters (in tuple form of `[name, type]`) */
    const scalarOrder = scalar.map((s) => {
      return [retainUntil(s, " "), retainAfter(s, "AS ")];
    });

    if (!raw || raw.trim() === "") {
      // no parameters provided

      if (requiredScalar > 0) {
        return invalid(
          `The ${name} handler expects at least ${requiredScalar} scalar parameter(s) and no parameters were provided!`,
        );
      }

      return [{}, {}] as [ScalarParams<TScalar>, OptionParams<TOpt>];
    }

    try {
      // Convert JS object literal syntax to JSON before parsing
      const jsonCompatible = jsObjectToJson(raw);

      const parsed = JSON.parse(`[ ${jsonCompatible} ]`) as any[];

      const optionsPosition = parsed.findIndex(i => isObject(i));
      const hasOptionsHash = optionsPosition !== -1;

      const optionsHash = hasOptionsHash ? parsed[optionsPosition] : {};

      /**
       * boolean flag indicating whether the options hash -- if it exists --
       * is in the last position of parameters passed in.
       */
      const optionsInTerminalPosition
        = optionsPosition === -1 ? true : optionsPosition === parsed.length - 1;

      const scalarParams
        = optionsPosition === -1 ? parsed : parsed.slice(0, optionsPosition);

      const notEnoughScalarParams = !!(
        requiredScalar > 0 && scalarParams.length < requiredScalar
      );

      if (!optionsInTerminalPosition) {
        const err = invalid(
          `Kind Model query syntax requires that any options hash parameter provided be provided as the LAST parameter but the ${optionsPosition + 1} element was the options hash on a parameter array which had ${parsed.length} parameters.`,
        );
        return err;
      }

      if (notEnoughScalarParams) {
        return invalid(
          `the ${name} query handler expects at least ${requiredScalar} scalar parameters to be passed in, only ${scalarParams.length} were received!`,
        );
      }

      if (optionsPosition !== -1) {
        if (optionsPosition < parsed.length - 1) {
          return invalid(
            `The "${name}" query parser received an options hash but did not provide all of the required scalar properties [${requiredScalar}]!`,
            { scalarProvided: scalarParams.length, optionsPosition, parsed },
          );
        }
      }

      const scalar: Record<string, any> = {};
      let idx = 0;
      for (const [key, typeOf] of scalarOrder) {
        if (typeOf.startsWith("string") && !isString(scalarParams[idx])) {
          return invalid(
            `the scalar property "${key}" is required and expected to be a string; type was ${typeof scalarParams[idx]}`,
          );
        }

        scalar[key] = scalarParams[idx];

        idx++;
      }

      // Validate that all keys in optionsHash are defined in the options schema
      if (hasOptionsHash) {
        const validKeys = Object.keys(options);
        const providedKeys = Object.keys(optionsHash);
        const invalidKeys = providedKeys.filter(key => !validKeys.includes(key));

        if (invalidKeys.length > 0) {
          return invalid(
            `The "${name}" handler received unknown option(s): ${invalidKeys.map(k => `"${k}"`).join(", ")}. Valid options are: ${validKeys.map(k => `"${k}"`).join(", ")}`,
          );
        }

        // Validate types of provided options
        const typeErrors: string[] = [];
        for (const key of providedKeys) {
          const typeToken = options[key];
          const value = optionsHash[key];
          const typeError = validateOptionType(key, value, typeToken);
          if (typeError) {
            typeErrors.push(typeError);
          }
        }

        if (typeErrors.length > 0) {
          return invalid(
            `The "${name}" handler received invalid option value(s): ${typeErrors.join("; ")}`,
          );
        }
      }

      return [scalar, optionsHash] as [
        ScalarParams<TScalar>,
        OptionParams<TOpt>,
      ];
    }
    catch (e) {
      return parsingErr(`Problem parsing query parameters passed in: ${raw}!`, {
        underlying: e,
      });
    }
  };
}

/**
 * Parse query parameters using ArkType schemas for validation.
 *
 * This is the new ArkType-based parser that provides:
 * - Rich error messages with expected vs actual types
 * - Type inference from schemas
 * - Consistent validation across scalar and option params
 *
 * @param _p - The plugin instance (for logging)
 * @returns A curried function that parses and validates query parameters
 */
export function parseQueryParamsWithArkType(_p: KindModelPlugin) {
  return <TScalar extends Dictionary, TOptions extends Dictionary>(
    name: string,
    /** the raw string params */
    raw: string,
    /** ArkType schema for scalar parameters, or null if none */
    scalarSchema: Type<TScalar> | null,
    /** ArkType schema for options hash, or null if none */
    optionsSchema: Type<TOptions> | null,
  ): KindError | [TScalar, TOptions] => {
    const invalid = InvalidParameters.rebase({
      raw,
      scalarSchema: scalarSchema?.expression,
      optionsSchema: optionsSchema?.expression,
    });
    const parsingErr = ParsingError.rebase({
      raw,
      scalarSchema: scalarSchema?.expression,
      optionsSchema: optionsSchema?.expression,
    });

    // Handle empty input
    if (!raw || raw.trim() === "") {
      // Validate empty input against schemas
      const emptyScalar = {} as TScalar;
      const emptyOptions = {} as TOptions;

      if (scalarSchema) {
        const scalarResult = scalarSchema(emptyScalar);
        if (scalarResult instanceof type.errors) {
          return invalid(
            `The ${name} handler requires scalar parameters: ${scalarResult.summary}`,
          );
        }
      }

      if (optionsSchema) {
        const optionsResult = optionsSchema(emptyOptions);
        if (optionsResult instanceof type.errors) {
          // Options schemas should typically accept empty objects (all optional)
          // but if not, report the error
          return invalid(
            `The ${name} handler options validation failed: ${optionsResult.summary}`,
          );
        }
      }

      return [emptyScalar, emptyOptions];
    }

    try {
      // Convert JS object literal syntax to JSON before parsing
      const jsonCompatible = jsObjectToJson(raw);
      const parsed = JSON.parse(`[ ${jsonCompatible} ]`) as unknown[];

      // Find the options hash (if present)
      const optionsPosition = parsed.findIndex(i => isObject(i));
      const hasOptionsHash = optionsPosition !== -1;

      const rawOptionsHash = hasOptionsHash ? parsed[optionsPosition] : {};
      const scalarParams = optionsPosition === -1
        ? parsed
        : parsed.slice(0, optionsPosition);

      // Validate options hash position
      const optionsInTerminalPosition
        = optionsPosition === -1 || optionsPosition === parsed.length - 1;

      if (!optionsInTerminalPosition) {
        return invalid(
          `Kind Model query syntax requires that any options hash parameter provided be provided as the LAST parameter but the ${optionsPosition + 1} element was the options hash on a parameter array which had ${parsed.length} parameters.`,
        );
      }

      // Build scalar object from positional params
      // For ArkType schemas, we need to know the expected keys
      // For now, we use a simple approach: if scalarSchema has keys, map params to those keys
      let scalarObject: Record<string, unknown> = {};

      if (scalarSchema) {
        // Extract expected keys from the schema's description
        // ArkType schemas expose their structure - we use this for mapping
        const schemaKeys = getSchemaKeys(scalarSchema);

        for (let i = 0; i < schemaKeys.length && i < scalarParams.length; i++) {
          scalarObject[schemaKeys[i]] = scalarParams[i];
        }
      }
      else if (scalarParams.length > 0) {
        // No ArkType schema but params provided - pass through for TypeToken handlers
        // (Hybrid handlers use TypeToken for scalars and ArkType for options)
        scalarObject = scalarParams.reduce((acc, val, idx) => {
          acc[`param${idx}`] = val;
          return acc;
        }, {} as Record<string, unknown>);
      }

      // Validate scalar params with ArkType
      let validatedScalar: TScalar = {} as TScalar;
      if (scalarSchema) {
        const scalarResult = scalarSchema(scalarObject);
        if (scalarResult instanceof type.errors) {
          const errors = scalarResult
            .map(err => formatArkError(err))
            .join("; ");
          return invalid(
            `The "${name}" handler received invalid scalar parameter(s): ${errors}`,
          );
        }
        validatedScalar = scalarResult;
      }

      // Validate options with ArkType
      let validatedOptions: TOptions = {} as TOptions;
      if (optionsSchema) {
        const optionsResult = optionsSchema(rawOptionsHash);
        if (optionsResult instanceof type.errors) {
          const errors = optionsResult
            .map(err => formatArkError(err))
            .join("; ");
          return invalid(
            `The "${name}" handler received invalid option(s): ${errors}`,
          );
        }
        validatedOptions = optionsResult;
      }
      else if (hasOptionsHash) {
        // No schema but options provided - pass through
        validatedOptions = rawOptionsHash as TOptions;
      }

      return [validatedScalar, validatedOptions];
    }
    catch (e) {
      return parsingErr(`Problem parsing query parameters passed in: ${raw}!`, {
        underlying: e,
      });
    }
  };
}

/**
 * Extract the keys from an ArkType object schema.
 * Used to map positional scalar parameters to named keys.
 */
function getSchemaKeys(schema: Type<unknown>): string[] {
  // ArkType schemas have an internal structure we can inspect
  // The 'expression' property shows the schema definition
  // For object schemas, we can extract keys from the structure

  try {
    // Access the schema's internal node structure
    const expression = schema.expression;

    // For simple object schemas like { kind: "string", "category?": "string" }
    // the expression will contain key information

    // Try to extract keys from the schema's description
    if (typeof expression === "string") {
      // Parse keys from expression like "{ kind: string, category?: string }"
      const keyMatch = expression.match(/\{([^}]+)\}/);
      if (keyMatch) {
        const content = keyMatch[1];
        // Match key names (with optional ?)
        const keys = content.match(/(\w+)\??:/g);
        if (keys) {
          return keys.map(k => k.replace(/\??:$/, ""));
        }
      }
    }

    // Fallback: try to get keys from the schema's internal structure
    // @ts-expect-error - accessing internal ArkType structure
    const internal = schema.internal ?? schema.t ?? schema;
    if (internal && typeof internal === "object" && "props" in internal) {
      // @ts-expect-error - accessing internal structure
      return Object.keys(internal.props);
    }
  }
  catch {
    // If we can't extract keys, return empty array
  }

  return [];
}

/**
 * Format an ArkType error for display.
 */
function formatArkError(err: { message: string; path: (string | number)[]; expected: string; actual?: string }): string {
  const path = err.path.length > 0 ? ` at "${err.path.join(".")}"` : "";
  const expected = err.expected ? ` (expected ${err.expected}` : "";
  const actual = err.actual ? `, got ${err.actual})` : expected ? ")" : "";
  return `${err.message}${path}${expected}${actual}`;
}
