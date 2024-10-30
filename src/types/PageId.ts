import { AfterFirst } from "inferred-types";

type Includes<
	T extends PageIdType[],
	F extends PageIdType
> = [] extends T
? false
: T[0] extends F
	? true
	: Includes<AfterFirst<T>, F>;


export type PageIdType = "path" | "tag";

export type PageId<T extends PageIdType[]> =
Includes<T, "path"> extends true
	? Includes<T, "tag"> extends true
		? { path: string; tag: string }
		: { path: string; tag?: string | undefined }
	: Includes<T, "tag"> extends true
		? { tag: string; path: string }
		: { tag: string; path: string } | { path: string; tag?: string | undefined };



