import { isString, stripAfter } from "inferred-types";
import { PageReference } from "~/types";
import {
	isDvPage,
	isLink,
	isPageInfo,
	isTAbstractFile,
	isTFile,
} from "~/type-guards";

/**
 * Get's a page's "path" from various page reference types.
 */
export const getPath = <T extends PageReference | undefined>(
	pg: T,
): string | undefined => {
	return isTFile(pg) || isTAbstractFile(pg) || isLink(pg)
		? pg.path
		: isDvPage(pg)
			? pg.file.path
			: isString(pg)
				? stripAfter(pg, "|")
				: isPageInfo(pg)
					? pg.current?.file?.path
					: undefined;
};
