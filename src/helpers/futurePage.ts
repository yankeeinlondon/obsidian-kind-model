import type KindModelPlugin from "~/main";
import type { FuturePage } from "~/types";

export function futurePage(_p: KindModelPlugin) {
  return (
    name: string,
  ) => {
    return ({
      __kind: "FuturePage",
      file: {
        name,
        path: undefined,
      },
    }) as FuturePage;
  };
}

/**
 * Generates a Kind() km query block string for category or subcategory pages
 *
 * @param kind - The kind name (e.g., "software", "book")
 * @param category - The category name
 * @param subcategory - Optional subcategory name
 * @returns A properly formatted Kind() query string
 */
export function generateKindBlock(
  kind: string,
  category: string,
  subcategory?: string,
): string {
  if (subcategory) {
    return `Kind("${kind}", "${category}", "${subcategory}")`;
  }
  return `Kind("${kind}", "${category}")`;
}
