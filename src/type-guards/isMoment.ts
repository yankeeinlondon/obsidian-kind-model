import { isObject } from "inferred-types";
import { Moment } from "~/globals";

/**
 * Type guard which validates that the passed in `val` is a 
 * [**MomentJS**](https://momentjs.com/docs/#/displaying/) date 
 * object.
 */
export const isMoment = (val: unknown): val is Moment => {
	return isObject(val) && "toISOString" in val && "calendar" in val && "dayOfYear" in val
}
