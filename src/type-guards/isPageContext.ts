import type { PageContext } from "~/types";

/**
 * Type guard which validates that passed in `val` is of type `PageContext<T>`
 */
export function isPageContext(val: unknown): val is PageContext {
  return typeof val === "object" && (val as any).__kind === "PageContext";
}
