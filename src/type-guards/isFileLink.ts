import type { FileLink, Link } from "~/types";
import { isObject, isString } from "inferred-types";

/**
 * Type guard which checks whether the passed in value is a `DvPageRef` structure.
 */
export function isFileLink(val: unknown): val is FileLink {
  return isLink(val) && "type" in val && val.type === "file";
}

export function isLink<V>(val: V): val is V & Link {
  return isObject(val) && 
  	"path" in val && 
	isString(val.path) && 
	"embed" in val && 
	typeof val.embed === "boolean";
}
