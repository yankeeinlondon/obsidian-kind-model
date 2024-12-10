/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Dictionary,
} from "inferred-types";
import type KindModelPlugin from "~/main";
import type { OptionParams, OptionsDefn, ScalarDefn, ScalarParams } from "~/types";
import {
  isObject,
  isString,
  kindError,
  retainAfter,
  retainUntil,
} from "inferred-types";

export function parseQueryParams(_p: KindModelPlugin) {
  return <TScalar extends readonly ScalarDefn[], TOpt extends OptionsDefn>(
    name: string,
  /** the raw string params */
    raw: string,
  /** the scalar property definitions */
    scalar: TScalar,
  /** the options hash definition */
    options: TOpt,
  ): Error | [ScalarParams<TScalar>, OptionParams<TOpt>] => {
    /** the quantity of scalars that MUST be in place */
    const requiredScalar = scalar.filter(i => !i.contains("opt(")).length;

    const invalid = kindError(`InvalidQuery<${name}>`, {
      raw,
      scalar,
      options,
      requiredScalar,
    });
    const parsingErr = kindError(`ParsingError<${name}>`, {
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
          `The ${name} handler expects at least ${requiredScalar} scalar parameters and no parameters were passed into the handler and none were provided!`,
        );
      }

      return [{}, {}] as [ScalarParams<TScalar>, OptionParams<TOpt>];
    }

    try {
      const parsed = JSON.parse(`[ ${raw} ]`) as any[];
      const optionsPosition = parsed.findIndex(i => isObject(i));
      const hasOptionsHash = optionsPosition !== -1;

      const optionsHash = hasOptionsHash ? parsed[optionsPosition] : {};

      /**
       * boolean flag indicating whether the options hash -- if it exists --
       * is in the last position of parameters passed in.
       */
      const optionsInTerminalPosition
				= optionsPosition === -1 ? true : optionsPosition === length - 1;

      const scalarParams
				= optionsPosition === -1
				  ? parsed
				  : parsed.slice(0, optionsPosition);

      const notEnoughScalarParams
				= !!(requiredScalar > 0 && scalarParams.length < requiredScalar);

      if (!optionsInTerminalPosition) {
        return invalid(
          `Kind Model query syntax requires that any options hash parameter provided be provided as the LAST parameter but the ${optionsPosition + 1} element was the options hash on a parameter array which had ${parsed.length} parameters.`,
        );
      }

      if (notEnoughScalarParams) {
        return invalid(
          `the ${name} query handler expects at least ${requiredScalar} scalar parameters to be passed in when using it!`,
        );
      }

      if (optionsPosition !== -1) {
        const requiredOpts = Object.keys(options).filter(
          i => !i.includes("opt("),
        );

        const opts = parsed[optionsPosition] as Dictionary;
        for (const key of requiredOpts) {
          if (!(key in opts)) {
            return invalid(
              `The "${name}" query parser received an options hash but did not provide all of the required properties!`,
            );
          }
        }
      }

      const scalar: Record<string, any> = {};
      let idx = 0;
      for (const [key, typeOf] of scalarOrder) {
        if (
          typeOf.startsWith("string")
          && !isString(scalarParams[idx])
        ) {
          return invalid(
            `the scalar property "${key}" is required and expected to be a string; type was ${typeof scalarParams[idx]}`,
          );
        }

        scalar[key] = scalarParams[idx];

        idx++;
      }

      return [scalar, optionsHash] as [
        ScalarParams<TScalar>,
        OptionParams<TOpt>,
      ];
    }
    catch (e) {
      return parsingErr(
        `Problem parsing query parameters passed in: ${raw}!`,
        { underlying: e },
      );
    }
  };
}
