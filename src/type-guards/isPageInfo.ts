import type { PageInfo } from "~/types";
import { isObject } from "inferred-types";

/**
 * Type guard which validates that the passed in `val` is of
 * the type `PageInfo` (or `PageInfoBlock`)
 */
export function isPageInfo(val: unknown): val is PageInfo {
  return isObject(val)
      && "current" in val
      && "__kind" in val
      && val.__kind === "PageInfo";
}
