import type { DvFileProperties } from "~/types";

export function isDataviewFile(val: unknown): val is DvFileProperties {
  return !!(typeof val === "object"
    && val !== null
    && "aliases" in (val as object)
    && (val as any)?.aliases?.where);
}
