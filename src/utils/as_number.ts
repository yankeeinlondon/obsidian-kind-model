import { isNumber, isString } from "inferred-types"

/**
 * returns a number when a number or string value is presented; otherwise
 * returns _undefined_.
 */
export const as_number = (val: unknown) => {
	if (isNumber(val)) {
		return val;
	} else if (isString(val) && val !== "") {
		return Number(val);
	} else {
		return undefined;
	}
}
