import { isString } from "inferred-types"

export type WikipediaUrl = `https://${string}wikipedia.org${string}`


/**
 * **isWikipediaUrl**
 * 
 * Type guard which validates whether a given URL is for a Wikipedia page
 */
export const isWikipediaUrl = (val: unknown): val is WikipediaUrl => {
	return isString(val) && val.startsWith("https://") && val.includes("wikipedia.org/")
}
