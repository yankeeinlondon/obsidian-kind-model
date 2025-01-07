import type { MarkdownPostProcessorContext } from "obsidian";
import { isObject } from "inferred-types";

/**
 * type guard which validates that `val` is a Obsidian `MarkdownPostProcessorContext` type
 */
export function isMarkdownPostProcessorContext(val: unknown): val is MarkdownPostProcessorContext {
  return isObject(val)
      && "docId" in val
      && "sourcePath" in val
      && "frontmatter" in val
      && "addChild" in val
      && "getSectionInfo" in val;
}
