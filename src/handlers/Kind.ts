import { asDisplayTag } from "~/helpers";
import { createHandler } from "./createHandler";

export const Kind = createHandler("Kind")
	.scalar(
		"kind AS opt(string)",
		"category AS opt(string)",
		"subcategory AS opt(string)",
	)
	.options({
		show: "array(string)",
		hide: "array(string)",
	})
	.handler(async (evt) => {
		const { createTable, page, render, getPageFromKindTag, dv, report } = evt;

		const tbl = createTable("Page", "Classification", "Description", "Links")(
			r => [
				r.createFileLink(),
				r.showClassifications(),
				r.showDesc(),
				r.showLinks(),
			],
			{ hideColumnIfEmpty: ["Description", "Links"] },
		);

		const { kind, category, subcategory } = evt.scalar;
		if (!kind) {
			return report("No kind tag was specified in the Kind()")
		}


		const queryParts: string[] = [`#${kind}`];
		if (category) {
			queryParts.push(`/${category}`);
		}
		if (category && subcategory) {
			queryParts.push(`/${subcategory}`)
		}

		const pages = dv.pages(queryParts.join(""))
			.sort(i => [i.kind, i.category, i.subcategory])

		await tbl(pages);


		return true;
	});
