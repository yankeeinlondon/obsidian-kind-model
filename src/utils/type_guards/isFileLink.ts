import { FileLink } from "../../types/dataview_types"

/**
 * Type guard which checks whether the passed in value is a `DvPageRef` structure.
 */
export const isFileLink = (val: unknown): val is FileLink => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return typeof val === "object" && "path" in (val as object) && (val as any).type === "file"
}
