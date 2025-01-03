import { IsArray } from "inferred-types";
import KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { isDvPage, isFuturePage, isLink } from "~/type-guards";
import { PageReference } from "~/types";

export function asMdLink(p: KindModelPlugin) {
	return <
		T extends PageReference | PageReference[]
	>(
		ref: T
	): IsArray<T> extends true ? string[] : string => {
		if (Array.isArray(ref)) {
			const links = ref.map(
				i => isDvPage(i) 
					? `[[${i.file.path}|${i.file.name}]]`
					: isFuturePage(i) 
					 	? `[[${i.file.name}]]`
						: String(i)
			);
			
			return links as IsArray<T> extends true ? string[] : string;
		}

		const page = getPage(p)(ref);
		return (
			isDvPage(page)
				? `[[${page.file.path}|${page.file.name}]]`
				: isFuturePage(ref)
					? `[[${ref.file.name}]]`
					: String(ref)
		) as IsArray<T> extends true ? string[] : string
	}

}
