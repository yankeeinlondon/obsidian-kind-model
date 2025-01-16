import { isObject } from "inferred-types";
import type { TAbstractFile, TFile, TFolder } from "obsidian";

export function isAbstractFile(v: unknown): v is TAbstractFile {
	return isObject(v) && "name" in v && "path" in v
}


/**
 * **isTFile(v)**
 *
 * Type guard to test whether the value is an Obsidian `TFile`.
 */
export function isTFile(v: unknown): v is TFile {
  return isAbstractFile(v) && "extension" in v && "saving" in v;
}


/**
 * **isTFolder(v)**
 *
 * Type guard to test whether the value is an Obsidian `TFile`.
 */
export function isTFolder(v: unknown): v is TFolder {
return isAbstractFile(v) && "children" in v && "isRoot" in v;
}
  