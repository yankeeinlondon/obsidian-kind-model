import type { DataArray } from "~/types";

export function toArray<T extends DataArray<any>>(arrayLike: T) {
  return Array.from(arrayLike) as T extends DataArray<infer K> ? K[] : unknown[];
}
