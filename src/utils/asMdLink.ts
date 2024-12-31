import KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { PageReference } from "~/types";

export function asMdLink(p: KindModelPlugin) {
	return (ref: PageReference) => {
		const page = getPage(p)(ref);
		return `[[${page.file.path}|$${page.file.name}]]`
	}

}
