import { TupleToUnion } from "inferred-types";
import { Tag } from "../types/general";
import { createHandler } from "./createHandler";
import {
	createFileLink,
	showClassifications,
	showDesc,
	showLinks,
} from "~/api";

export const COLUMN_CHOICES = [
	"when",
	"created",
	"modified",
	"links",
	"desc",
	"classification",
	"category",
	"subcategory",
	"kind",
	"related",
	"about",
	"company",
	/^#[a-zA-Z/]+ AS [a-zA-Z]{1}.*/ as unknown as `#${string} AS ${string}`,
] as const;

export type ColumnChoice = TupleToUnion<typeof COLUMN_CHOICES>;

export type BackLinkOptions = {
	/**
	 * rather than back links auto determining how to layout your links
	 * you can instead specify which columns you'd like
	 */
	columns?: ColumnChoice[];

	/**
	 * you can specify tags that indicate that a back linked page should be
	 * filtered from the list
	 */
	filterTags?: Tag[];

	/**
	 * the property you want to sort by
	 */
	sortProperty?: string;

	/**
	 * the sort order (either ASC or DESC)
	 */
	sortOrder?: "ASC" | "DESC";
};

/**
 * Renders back links for any obsidian page
 */
export const BackLinks = createHandler("BackLinks")
	.scalar()
	.options()
	.handler(async (evt) => {
		const { plugin: p, page } = evt;

		const current = page.current;

		const { table, renderValue } = page;

		/**
		 * all in-bound links for the page with the exception of self-references */
		const links = current.file.inlinks
			.sort((p) => p?.path)
			.where((p) => p.path !== current.file.path);

		p.info(
			"backlinks",
			links.map((i) => [
				createFileLink(p)(i),
				showClassifications(p)(i),
				showDesc(p)(i),
				showLinks(p)(i),
			]),
		);

		if (links.length > 0) {
			table(
				["Backlink", "Classification(s)", "Desc", "Links"],
				links.map((i) => [
					createFileLink(p)(i),
					showClassifications(p)(i),
					showDesc(p)(i),
					showLinks(p)(i),
				]),
			);
		}

		if (links.length === 0) {
			renderValue(`- no back links found to this page`);
		}
	});
