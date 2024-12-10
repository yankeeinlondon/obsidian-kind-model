import { isObject } from "inferred-types";

export function isError(val: unknown): val is Error {
  return isObject(val) && val instanceof Error;
}
