import { PageContext } from "~/types";

/**
 * Type guard which validates that passed in `val` is of type `PageContext<T>`
 */
export const isPageContext = (val: unknown): val is PageContext => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return typeof val === "object" && (val as any).__kind === "PageContext";
};
