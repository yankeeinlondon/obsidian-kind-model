import type { KindError } from "@yankeeinlondon/kind-error";
import { isObject, isString, retainAfter, retainUntil } from "inferred-types";
import { InvalidParameters, ParsingError } from "~/errors";
import type KindModelPlugin from "~/main";
import type {
	OptionParams,
	OptionsDefn,
	ScalarDefn,
	ScalarParams,
} from "~/types";

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
      const parsed = JSON.parse(`[ ${raw} ]`) as any[];
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
