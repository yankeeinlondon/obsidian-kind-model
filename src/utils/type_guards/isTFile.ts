import type { TFile } from "obsidian";

/**
 * **isTFile(v)**
 * 
 * Type guard to test whether the value is an Obsidian `TFile`.
 */
export const isTFile = (v: unknown): v is TFile => {
  return typeof v === "object" && "path" in (v as object);
}
