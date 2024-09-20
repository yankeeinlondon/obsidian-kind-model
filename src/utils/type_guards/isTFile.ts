import { isObject } from "inferred-types";
import type { TFile } from "obsidian";

/**
 * **isTFile(v)**
 * 
 * Type guard to test whether the value is an Obsidian `TFile`.
 */
export const isTFile = (v: unknown): v is TFile => {
  return isObject(v) && "name" in v && "extension" in v && "path" in v && ;
}
