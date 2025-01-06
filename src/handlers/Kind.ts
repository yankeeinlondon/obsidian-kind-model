import { asDisplayTag } from "~/helpers";
import { createHandler } from "./createHandler";
import { asArray, isString } from "inferred-types";

export const Kind = createHandler("Kind")
	.scalar(
		"kind AS string",
		"category AS opt(string)",
		"subcategory AS opt(string)",
	)
	.options({
		show: "array(string)",
		hide: "array(string)",
	})
	.handler(async (evt) => {
		const { createTable,  dv, report, options } = evt;

		let tbl = createTable("Page", "Classification", "Description", "Links")(
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
			.sort(i => [i.kind, i.category, i.subcategory]);

		if (options.hide) {
			const hide = asArray(options.hide);
			if (hide.every(i => isString(1))) {
				tbl.removeColumns(hide);
			}
		}

		await tbl(pages);


		return true;
	});
