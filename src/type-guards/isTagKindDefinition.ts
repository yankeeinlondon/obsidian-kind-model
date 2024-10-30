import { isObject } from "inferred-types";
import { KindDefinition } from "~/types";

/**
 * type guard which validates that `val` is a KindDefinition with a `tag` specified
 */
export const isTagKindDefinition = (val: unknown): val is KindDefinition<["tag"]> => {
	return isObject(val) && "tag" in val && typeof val.tag === "string"
}
