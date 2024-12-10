import type { DateTime } from "luxon";
import { isObject } from "inferred-types";

export function isDateTime<T>(val: T): val is T & DateTime {
  return isObject(val) && "toFormat" in val;
}
