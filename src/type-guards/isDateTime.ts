import { isObject } from "inferred-types"
import { DateTime } from "luxon"


export const isDateTime = <T>(val: T): val is T & DateTime => {
	return isObject(val) && "toFormat" in val
}
