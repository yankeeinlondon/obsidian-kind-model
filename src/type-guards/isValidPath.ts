import { isString } from "inferred-types"


export const isValidPath = (val: unknown): val is string => {
	return isString(val) && !val.startsWith("/") && !val.startsWith(".") && val.length > 2
}
