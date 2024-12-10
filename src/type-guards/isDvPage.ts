import type { DvPage } from "~/types";
import { isObject } from "inferred-types";

/**
 * type guard which validates whether the value passed in is a `DvPage`
 * object.
 */
export function isDvPage(val: unknown): val is DvPage {
  return isObject(val)
    && "file" in val
    && isObject(val.file)
    && "link" in val.file
    && "name" in val.file
    && "path" in val.file;
}
