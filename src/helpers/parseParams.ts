import type { KindError } from "@yankeeinlondon/kind-error";
import type KindModelPlugin from "~/main";
import type {
  OptionParams,
  OptionsDefn,
  ScalarDefn,
  ScalarParams,
} from "~/types";
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
