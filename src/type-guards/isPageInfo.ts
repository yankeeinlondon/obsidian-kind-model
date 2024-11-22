import { isObject } from "inferred-types";
import { PageInfo } from "~/types";
import { isDvPage } from "./isDvPage";


/**
 * Type guard which validates that the passed in `val` is of 
 * the type `PageInfo` (or `PageInfoBlock`)
 */
export const isPageInfo = (val: unknown): val is PageInfo => {
	return isObject(val) && 
		"current" in val && 
		"categories" in val && 
		"type" in val &&
		isDvPage(val.current);
}
