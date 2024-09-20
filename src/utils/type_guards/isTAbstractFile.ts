import { isObject } from "inferred-types";
import type { TAbstractFile } from "obsidian";

/**
 * **isTAbstractFile(v)**
 * 
 * Type guard to test whether the value is an Obsidian `TAbstractFile` (both files and folders 
 * extend off of this).
 */
export const isTAbstractFile = (v: unknown): v is TAbstractFile => {
  return isObject(v) && "basename" in v && "path" in v;
}
