import { Component, MarkdownPostProcessorContext } from "obsidian";
import { TupleToUnion } from "inferred-types";
import type KindModelPlugin from "../main";
import { Tag } from "../types/general";



export const COLUMN_CHOICES = [
	"when", "created", "modified",
	"links", "desc",
	"classification", "category", "subcategory",
	"kind",
	"related", "about",
	"company",
	/^#[a-zA-Z/]+ AS [a-zA-Z]{1}.*/ as unknown as `#${string} AS ${string}`
] as const

export type ColumnChoice = TupleToUnion<typeof COLUMN_CHOICES>;

export type BackLinkOptions = {
	/**
	 * rather than back links auto determining how to layout your links
	 * you can instead specify which columns you'd like
	 */
	columns?: ColumnChoice[],

	/**
	 * you can specify tags that indicate that a back linked page should be 
	 * filtered from the list
	 */
	filterTags?: Tag[],


	/**
	 * the property you want to sort by
	 */
	sortProperty?: string;

	/**
	 * the sort order (either ASC or DESC)
	 */
	sortOrder?: "ASC" | "DESC"
}


/**
 * Renders back links for any obsidian page
 */
export const BackLinks = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	params_str: string = ""
) => {
	const page = p.api.createPageInfoBlock(
		source, container, component, filePath
	);

	if (page) {
		const current = page.current;
		// let [scalar, opt] = parseParams(params_str);

		const {	
			table,
			renderValue,
			createFileLink,
			showDesc,
			showLinks,
			showClassifications
		} = page;

		/** 
		 * all in-bound links for the page with the exception of self-references */
		const links = current.file.inlinks
			.sort(p => page.getPage(p)?.file.name)
			.where(p => page.getPage(p)?.file.path !== current.file.path);


		p.info(links.map(i => [
			createFileLink(i),
			showClassifications(i),
			showDesc(i),
			showLinks(i)
		]))

		if (links.length > 0) {
			table(
				["Page", "Classification(s)", "Desc", "Links"],
				links.map(i => [
					createFileLink(i),
					showClassifications(i),
					showDesc(i),
					showLinks(i)
				])
			)
		}

		if(links.length === 0) {
			renderValue(`- no back links found to this page`)
		}
	}
}
