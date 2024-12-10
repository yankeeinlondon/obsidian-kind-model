import type { MarkdownView } from "obsidian";

/**
 * Type Guard to ensure passed in value is a `MarkdownView`
 */
export function isMarkdownView(val: unknown): val is MarkdownView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(typeof val === "object" && "getViewData" in (val as object) && typeof (val as any).getViewData === "function");
}
