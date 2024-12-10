import type {
  Iso8601Date,
  Iso8601DateTime,
} from "inferred-types";
import {
  isIsoDate,
  isIsoDateTime,
  isIsoExplicitDate,
  isStringArray,
} from "inferred-types";

function test(...props: string[]): Iso8601Date<"explicit"> | undefined {
  const sources = [] as (string | string[])[];
  const targets = props.filter(i => sources.includes(i));
  let found: Iso8601Date<"explicit"> | undefined;
  let idx = 0;

  while (idx <= targets.length || isIsoExplicitDate(found)) {
    const prop = targets[idx];
    if (isStringArray(prop)) {
      // property is an array of elements, take first
      const candidate = prop.find(
        i => isIsoDate(i) || isIsoDateTime(i),
      ) as Iso8601Date | Iso8601DateTime | undefined;
      if (candidate) {
        found = asExplicitIso8601Date(candidate);
      }
    }

    idx++;
  }

  return found;
}
