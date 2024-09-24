import { Component, MarkdownPostProcessorContext } from "obsidian";
import { TupleToUnion, isString } from "inferred-types";
import type KindModelPlugin from "../main";
import type { DvPage } from "../types/dataview_types";
import { Tag } from "../types/general";
import { parseParams } from "../helpers/parseParams";


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
export const back_links = (plg: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	params_str: string = ""
) => {
	const page = plg.api.createPageInfoBlock(source, container, component, filePath);

	if (page) {
		const current = page.current;
		let opt: BackLinkOptions = parseParams(params_str);


		/** all in-bound links for the page with the exception of self-references */
		const links = current.file.inlinks
			.sort(p => page.getPage(p)?.file.name)
			.where(p => page.getPage(p)?.file.path !== current.file.path);

		const categories = page.get

	
	
		if(page.isCategoryPage) {
			/** pages which are subcategories of the current category page */
			const subCategories = page.showSubcategoriesFor(page, page.category);
			/** pages which are _kinded pages_ and belong to this page's category */
			const kindPages = links.where(p => 
				isKindedPage(page(p)) && 
				get_classification(page(p))?.category === category
			);
			/** 
			 * any other pages which have inbound links but aren't subcategories 
			 * or kinded pages 
			 */
			const otherPages = links.where(p => 
				!isKindedPage(page(p), current) &&
				!(
					get_classification(page(p))?.isSubcategory ||
					get_classification(page(p))?.category === category
				)
			);
	
			if(subCategories.length > 0) {
				fmt.callout("info", "Subcategories", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `subcategory pages which are part of the ${fmt.bold(category || "")} ${fmt.italics("category")}.`
				})
				table(
					["Page", "Created", "Modified", "Desc", "Links"],
					subCategories.map(p => {
						const pg = page.getPage(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.showCreatedDate(pg, "DD"),
							page.showModifiedDate(pg, "DD"),
							page.showProp(pg, "desc", "description", "about"),
							page.showLinks(pg)
						]
					})
				).catch(e => plg.error(`Problems rendering subcategories table`, e));
			} else {
				ul(
					`no subcategories found for this category page`,
					`to be listed a page would need one of the following tags:`,
					l => l.indent(
						`\`#subcategory/${category}/[subcategory]\`, `,
						`\`#${kind_tag}/subcategory/${category}/[subcategory]`
					)
				)
			}
			if(kindPages.length > 0) {
				fmt.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are kinded as ${fmt.bold(kind_tag || "")} ${fmt.italics("and")} are part of the ${fmt.bold(category || "")} category.`
				})
				table(
					["Page", "Created", "Subcategory", "Desc", "Links"],
					kindPages.map(p => {
						const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							show_created_date(pg, "DD"),
							show_prop(pg, "subcategory"),
							show_prop(pg, "desc","description","about"),
							show_links(pg)
						]
					})
				).catch(e => plg.error(`Problems rendering table`, e));
			}
	
			if(otherPages.length > 0) {
				if(kindPages.length>0 || subCategories.length>0) {
					fmt.callout("info", "Other Pages", { 
						style: {
							mt: "1rem",
							mb: "1rem",
						},
						content: `other back links which aren't related directly via their classification`
					})
				}
				table(
					["Page", "Created", "Kind", "Category", "Links"],
					otherPages.map(p => {
						const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							show_created_date(pg, "DD"),
							show_prop(pg, "kind"),
							show_prop(pg, "category", "categories"),
							show_links(pg)
						]
					})
				).catch(e => plg.error(`Problems rendering otherPages table`, e));
			}
	
		} // end Category Page
		else if (isSubcategory) {
			/** kinded pages of the given subcategory */
			const kinded = links.where(p =>  
				// isKindedPage(page(p)) &&
				page(p) && page(p)?.subcategory && 
				page(page(p)?.subcategory)?.file?.path === current.file.path
			);
			const other = links.where(p => 
				!page(p)?.subcategory ||
				page(page(p)?.subcategory)?.file?.path !== current.file.path
			)
	
			if(kinded.length > 0) {
				fmt.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are kinded as ${fmt.bold(kind_tag || "")} ${fmt.italics("and")} are part of the ${fmt.bold(current.file.name)} subcategory .`
				})
				table(
					["Page", "Created", "Modified", "Desc", "Links"],
					kinded.map(p => {
						const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							show_created_date(pg, "DD"),
							show_modified_date(pg, "DD"),
							show_prop(pg, "desc", "description", "about"),
							show_links(pg)
						]
					})
				);
			} else {
				paragraph(`### Subcategory Page`)
				ul(
					`no pages which identify as being in this subcategory`,
					`to be listed, a page would need one of the following tag groups:`,
					l => l.indent(
						`<code>#${kind_tag}/${category}/${subcategory}</code>`,
						`<code>#${kind_tag} #subcategory/${category}/${subcategory}</code>`,
					)
				)
			}
			if(other.length > 0) {
				paragraph(`### Other Back Links`);
				table(
					["Page", "Created", "Kind", "Category", "Links"],
					other.map(p => {
						const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							show_created_date(pg, "DD"),
							show_prop(pg, "kind"),
							show_prop(pg, "category", "categories"),
							show_links(pg)
						]
					})
				);
			}
		} // end Subcategory Page
		else if (isKindedPage(current)) {
			// KINDED PAGE
			let peering: "none" | "subcategory" | "category" = "none";
	
			if (subcategory) {
				// peers from subcategory perspective
				const peers = links.where(p => 
					get_classification(page(p))?.subcategory === subcategory
				)
				if (peers.length>0) {
					peering = "subcategory";
					fmt.callout("info", "Peers", {
						content: `pages who share the same ${fmt.bold(current.file.name)} ${fmt.italics("subcategory")} as this page`,
						style: {
							mt: "1rem",
							mb: "1rem"
						},
						fold: ""
					})
	
					table(
						["Page", "Created", "Modified", "Desc", "Links"],
						peers.map(p => {
							const pg = page(p) as DvPage;
							return [
								createFileLink(pg),
								show_created_date(pg,"DD"),
								show_modified_date(pg,"DD"),
								show_prop(pg, "desc","description","about"),
								show_links(pg)
							]
						})
					)
				}
			} else if (category && peering === "none") {
				// peers from category perspective
				const peers = links.where(p => 
					get_classification(page(p))?.category === category
				)
				if (peers.length>0) {
					peering = "category";
					if(subcategory) {
						fmt.callout("info", "Peers", { 
							style: {
								pt: "1rem"
							},
							content: `no peers with your subcategory ${fmt.bold(subcategory)} found but there are peers with your ${fmt.italics("category")} ${fmt.bold(category)}`
						})
						paragraph(`> ![note] no peers with your subcategory ${subcategory} found but there are peers with your category of ${category}`)
					} else {
						fmt.callout("info", "Peers", { 
							style: {
								mt: "1rem",
								mb: "1rem",
							},
							content: `pages who share the same ${fmt.bold(category)} ${fmt.italics("category")} as this page`
						})
					}
	
					table(
						["Page", "Created", "Modified", "Desc", "Links"],
						peers.map(p => {
							const pg = page(p) as DvPage;
							return [
								createFileLink(pg),
								show_created_date(pg,"DD"),
								show_modified_date(pg,"DD"),
								show_prop(pg, "desc","description","about"),
								show_links(pg)
							]
						})
					)
				}
			} else {
				if(category && subcategory) {
					paragraph(`- no peer pages with either your ${category} category or your ${subcategory} subcategory`);
				} else if (category) {
					paragraph(`- no peer pages found with your ${category} category`);
				}
			} // end peering
	
			const other = links.where(p => 
				(peering === "category" && get_classification(page(p))?.category !== category) ||
				(peering === "subcategory" && get_classification(page(p))?.subcategory !== subcategory) ||
				(peering === "none")
			);
			if(other.length>0) {
				if(category || subcategory) {
					fmt.callout("info", "Other Back Links", { 
						style: {
							mt: "2rem",
							mb: "1rem",
						},
					})
				}
	
	
				table(
					["Page", "Created", "Kind", "Category", "Links"],
					other.map(p => {
					const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							show_created_date(pg, "DD"),
							show_prop(pg, "kind"),
							show_prop(pg, "category", "categories"),
							show_links(pg)
						]
					})
				);
			}
		} // end Kinded Pages
		else if (isKindDefnPage(current)) {
			const categoryPages = links.where(p => 
				get_classification(page(p))?.isCategory &&
				get_kind_prop(page(p)).kind?.file?.path === current.file.path
			);
	
			if(categoryPages.length>0) {
				fmt.callout("info", "Classification Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are category pages of this ${fmt.italics("kind definition")} page and their subcategories.`
				});
		
		
				table(
					["Category", "Tag", "Subcategories"],
					categoryPages.map(p => {
						const pg = page(p) as DvPage;
						return [
							createFileLink(pg),
							get_classification(pg).category,
							show_subcategories_for(pg).join(`, `)
						]
					})
				)
			}
	
			const kindPages = links.where(p => 
				get_kind_prop(page(p)).kind?.file?.path === current.file.path &&
				isKindedPage(page(p))
			);
	
			if(kindPages.length>0) {
				fmt.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages who's "kind" is defined by this page.`
				});
				
				const [_,classification] = get_prop(current, "__classification");
				
				if(isString(classification) && classification === "categories") {
					table(
						["Page", "Categories", "Links"],
						kindPages.map(p => {
							const pg = page(p) as DvPage;
							return [
								createFileLink(pg),
								show_prop(pg,  "categories"),
								show_links(pg)
							]
						})
					)
					
				} else {
	
					table(
						["Page", "Category", "Subcategory", "Links"],
						kindPages.map(p => {
							const pg = page(p) as DvPage;
							return [
								createFileLink(pg),
								show_prop(pg, "category", "categories"),
								show_prop(pg, "subcategory"),
								show_links(pg)
							]
						})
					)
				}
			}
	
		}
		
	
		if(links.length === 0) {
			renderValue(`- no back links found to this page`).catch(e => plg.error(`Problem rendering paragraph WRT to no back links`, e));
		}
	}


}
