import type { TFile } from "obsidian";
import { isObject } from "inferred-types";

/**
 * **isTFile(v)**
 *
 * Type guard to test whether the value is an Obsidian `TFile`.
 */
export function isTFile(v: unknown): v is TFile {
  return isObject(v) && "name" in v && "extension" in v && "path" in v;
}
