import type { DvFileProperties } from "~/types";

export function isDataviewFile(val: unknown): val is DvFileProperties {
  return !!(typeof val === "object"
    && val !== null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && "aliases" in (val as object)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && (val as any)?.aliases?.where);
}
