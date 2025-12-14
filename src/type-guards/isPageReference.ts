import type { PageReference } from "~/types";
import { isString } from "inferred-types";
import { isDvPage } from "./isDvPage";
import { isFileLink } from "./isFileLink";
import { isFuturePage } from "./isFuturePage";
import { isMdLink } from "./isMdLink";
import { isPageInfo } from "./isPageInfo";
import { isTAbstractFile } from "./isTAbstractFile";
import { isTFile } from "./isTFile";

/**
 * checks whether passed in value is any sort of "page reference"
 * including a `FuturePage` or an `MdLink`.
 */
export function isPageReference(v: unknown): v is PageReference {
  return (
    isDvPage(v)
    || isFileLink(v)
    || isPageInfo(v)
    || isFuturePage(v)
    || isTFile(v)
    || isTAbstractFile(v)
    || isMdLink(v)
    || isString(v)
  );
}
