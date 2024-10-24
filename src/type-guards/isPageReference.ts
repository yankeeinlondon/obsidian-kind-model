import { PageReference } from "~/types";
import { isDvPage } from "./isDvPage";
import { isFileLink } from "./isFileLink";
import { isPageInfo } from "./isPageInfo";
import { isTFile } from "./isTFile";
import { isTAbstractFile } from "./isTAbstractFile";

export const isPageReference = (v: unknown): v is PageReference => {
	return (
		isDvPage(v) || 
		isFileLink(v) || 
		isPageInfo(v) || 
		isTFile(v) || 
		isTAbstractFile(v)
	);
}
