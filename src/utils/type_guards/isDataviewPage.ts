import { DvPage } from "../../types/dataview_types"
import { isDataviewFile } from "./isDataviewFile"

export const isDataviewPage = (val: unknown): val is DvPage => {
	return typeof val === "object" && 
		val !== null &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		"file" in (val as object) && isDataviewFile((val as any).file)
		? true
		: false
}
