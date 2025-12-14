import type { PageReference } from "~/types";
import { isString, stripAfter, stripLeading } from "inferred-types";
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
export function getPath<T extends PageReference | undefined>(pg: T): string | undefined {
  return isTFile(pg) || isTAbstractFile(pg) || isLink(pg)
    ? pg.path
    : isDvPage(pg)
      ? pg.file.path
      : isString(pg)
        ? stripLeading(stripAfter(pg.trim(), "|"), "[[")
        : isPageInfo(pg)
          ? typeof pg.current?.file?.path === "string"
            ? pg.current.file.path
            : undefined
          : undefined;
}
