import { isString } from "inferred-types";
import { DvPage, Link } from "types/dataview_types";
import { TAbstractFile, TFile } from "types/Obsidian";
import { isDvPage, isLink, isTAbstractFile, isTFile } from "utils/type_guards";

/**
 * Get's a page's "path" from various page reference types.
 */
export const getPath = (
	pg: DvPage | TFile |TAbstractFile | Link | string
): string | undefined => {
	return isTFile(pg) || isTAbstractFile(pg) || isLink(pg)
	? pg.path
	: isDvPage(pg)
	? pg.file.path
	: isString(pg)
	? pg
	: undefined;
}
