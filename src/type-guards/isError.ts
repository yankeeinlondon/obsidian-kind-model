import { isObject, isString } from "inferred-types"


export const isError = (val: unknown): val is Error => {
	return isObject(val) && val instanceof Error;
}
