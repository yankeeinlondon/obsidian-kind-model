import type { FuturePage } from "~/types";
import { isObject } from "inferred-types";

export function isFuturePage(val: unknown): val is FuturePage {
  return isObject(val) && "kind" in val && val.kind === "FuturePage";
}
