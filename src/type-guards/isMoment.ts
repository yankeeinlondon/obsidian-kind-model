import type { Moment } from "~/globals";
import { isObject } from "inferred-types";

/**
 * Type guard which validates that the passed in `val` is a
 * [**MomentJS**](https://momentjs.com/docs/#/displaying/) date
 * object.
 */
export function isMoment(val: unknown): val is Moment {
  return isObject(val) && "toISOString" in val && "calendar" in val && "dayOfYear" in val;
}
