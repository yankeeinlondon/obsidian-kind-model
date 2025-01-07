import type { DvPage } from "~/types";
import { isDataviewFile } from "./isDataviewFile";

export function isDataviewPage(val: unknown): val is DvPage {
  return !!(typeof val === "object"
      && val !== null
      && "file" in (val as object)
      && isDataviewFile((val as any).file));
}
