import { isObject, isString } from "inferred-types"
import { FileLink, Link } from "../../types/dataview_types"

/**
 * Type guard which checks whether the passed in value is a `DvPageRef` structure.
 */
export const isFileLink = (val: unknown): val is FileLink => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return isLink(val) && "type" in val && val.type === "file"
}


export const isLink = <V>(val: V): val is V & Link => {
	return isObject(val) && "path" in val && isString(val.path) && "embed" in val && typeof val.embed === "boolean"
}
