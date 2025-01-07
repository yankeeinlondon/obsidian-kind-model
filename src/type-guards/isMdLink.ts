import type { AliasedMdLink, MdLink } from "~/types";
import { isString } from "inferred-types";

export function isMdLink(val: unknown): val is MdLink {
  return isString(val) && val.startsWith("[[") && val.endsWith("]]");
}

export function isAliasedMdLink(val: unknown): val is AliasedMdLink {
  return isMdLink(val) && val.includes("|");
}
