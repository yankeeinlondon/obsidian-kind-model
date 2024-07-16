import { isObject, isString } from "inferred-types"


export const isError = <T>(val: T): val is T & { msg: string } => {
	return (
		isObject(val) && "msg" in val && isString(val.msg)
	) || val instanceof Error
}
