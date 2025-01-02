import { IsArray } from "inferred-types";
import KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { PageReference } from "~/types";

export function asMdLink(p: KindModelPlugin) {
	return <
	T extends PageReference | PageReference[]
>(ref: T): IsArray<T> extends true ? string[] : string  => {
		if(Array.isArray(ref)) {
			const links = ref.map(i => `[[${page.file.path}|${page.file.name}]]`);
			return links as IsArray<T> extends true ? string[] : string;
		}

		const page = getPage(p)(ref);
		return `[[${page.file.path}|${page.file.name}]]` as IsArray<T> extends true ? string[] : string
	}

}
