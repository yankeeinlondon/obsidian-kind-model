import { isFunction, isObject } from "inferred-types";
import { Frontmatter } from "~/types";


export const isFrontmatter = (v: unknown): v is Frontmatter => {
	return isObject(v) && !isFunction(v);
}
