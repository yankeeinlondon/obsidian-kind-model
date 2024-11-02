import KindModelPlugin from "~/main";
import { getPage } from "~/page/getPage";
import { DvPage, PageInfo, PageReference } from "~/types";


type ReturnLink<T extends PageReference> = T extends DvPage
? string
: T extends PageInfo
? string
: string | undefined;

export const createVaultLink = (p: KindModelPlugin) => <T extends PageReference>(
	ref: T
): T extends DvPage
? string
: T extends PageInfo
? string
: string | undefined => {
	const page = getPage(p)(ref);

	if (page) {
		const alias = page.file.name;
		const path = page.file.path;
		const link = `[[${path}|${alias}]]`;

		return link as ReturnLink<T>;
	}

	return undefined as ReturnLink<T>;
}
