import { isObject } from "inferred-types";
import { PageInfo } from "~/types";
import { isDvPage } from "~/type-guards";


/**
 * type guard which validates that the passed in `val` is of the type `PageInfo`
 */
export const isPageInfo = (val: unknown): val is PageInfo => {
	return isObject(val) && "page" in val && "categories" in val && "type" in val;
}
