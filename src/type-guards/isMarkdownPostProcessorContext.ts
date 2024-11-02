import { isObject } from "inferred-types"
import { MarkdownPostProcessorContext } from "obsidian"

/**
 * type guard which validates that `val` is a Obsidian `MarkdownPostProcessorContext` type
 */
export const isMarkdownPostProcessorContext = (val: unknown): val is MarkdownPostProcessorContext => {
	return isObject(val) && 
		"docId" in val &&
		"sourcePath" in val &&
		"frontmatter" in val &&
		"addChild" in val &&
		"getSectionInfo" in val
}
