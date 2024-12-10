import type { DvPage } from "~/types";
import { isDataviewFile } from "./isDataviewFile";

export function isDataviewPage(val: unknown): val is DvPage {
  return !!(typeof val === "object"
    && val !== null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && "file" in (val as object)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && isDataviewFile((val as any).file));
}
