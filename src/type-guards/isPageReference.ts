import type { PageReference } from "~/types";
import { isString } from "inferred-types";
import { isDvPage } from "./isDvPage";
import { isFileLink } from "./isFileLink";
import { isPageInfo } from "./isPageInfo";
import { isTAbstractFile } from "./isTAbstractFile";
import { isTFile } from "./isTFile";

export function isPageReference(v: unknown): v is PageReference {
  return (
    isDvPage(v)
    || isFileLink(v)
    || isPageInfo(v)
    || isTFile(v)
    || isTAbstractFile(v)
    || isString(v)
  );
}
