import { DataArray } from "~/types";

export const toArray = <T extends DataArray<any>>(arrayLike: T) => {
	return Array.from(arrayLike) as T extends DataArray<infer K> ? K[] : unknown[]
}
