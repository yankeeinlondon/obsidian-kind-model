import { stripLeading, stripTrailing } from "inferred-types";

export function extract_page_reference<T extends string>(ref: T) {
  return stripTrailing(stripLeading(ref, "[["), "]]");
}
