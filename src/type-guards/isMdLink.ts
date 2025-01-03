import { isString } from "inferred-types";
import { AliasedMdLink, MdLink } from "~/types";


export function isMdLink(val: unknown): val is MdLink {
	return isString(val) && val.startsWith("[[") && val.endsWith("]]")
}


export function isAliasedMdLink(val: unknown): val is AliasedMdLink {
	return isMdLink(val) && val.includes("|")
}
