import { isArray } from "inferred-types";
import { FileLink } from "~/types";
import { isFileLink } from "./isFileLink";

/**
 * Type guard which validates that the passed in value is an array with at least one
 * `FileLink` in it.
 */
export const hasFileLink = (val: unknown): val is (FileLink & unknown)[] => {
	return isArray(val) && val.some((i) => isFileLink(i));
};
