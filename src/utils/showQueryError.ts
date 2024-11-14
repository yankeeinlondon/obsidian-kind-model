import KindModelPlugin from "~/main";
import { PageInfoBlock } from "~/types";


export const showQueryError = (p: KindModelPlugin) => (
	handler: string,
	page: PageInfoBlock,
	content: string,
) => {

	page.callout("error", `Query error in ${handler}`, {
		content
	});

}
