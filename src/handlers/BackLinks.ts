import { Component, MarkdownPostProcessorContext } from "obsidian";
import { TupleToUnion, isString } from "inferred-types";
import type KindModelPlugin from "../main";
import type { DvPage } from "../types/dataview_types";
import { Tag } from "../types/general";
import { parseParams } from "../helpers/parseParams";
import { createPageInfo } from "~/api";
import { hasFileLink, isFileLink } from "~/type-guards";
import { isKindedPage } from "~/api/buildingBlocks";


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
export const BackLinks = (plg: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	params_str: string = ""
) => {
	const page = plg.api.createPageInfoBlock(
		source, container, component, filePath
	);

	if (page) {
		const current = page.current;
		let opt: BackLinkOptions = parseParams([],{});


		const fmt = page.format;

		/** 
		 * all in-bound links for the page with the exception of self-references */
		const links = current.file.inlinks
			.sort(p => page.getPage(p)?.file.name)
			.where(p => page.getPage(p)?.file.path !== current.file.path);

		const categoryPaths = page.categories.flatMap(i => i.categories.map(c => c.file.path));
	
	
		if(page.isCategoryPage) {
			/** pages which are subcategories of the current category page */
			const subCategories = links.where(
				p => {
					const pg = createPageInfo(plg)(p);
					return pg
						? pg.isSubcategoryPage && pg.fm.category && isFileLink(pg.fm.category) && pg.fm.category.path === page.path
						: false
				}
			);

			/** pages which are _kinded pages_ and belong to this page's category */
			const kindPages = links.where(p => 
				page.type === "kinded" && 
				categoryPaths.includes(p.path)
			);


			const subPaths = subCategories.map(i => i.path);
			const kindPaths = kindPages.map(i => i.path);
			/** 
			 * any other pages which have inbound links but aren't subcategories 
			 * or kinded pages 
			 */
			const otherPages = links.filter(i => ![...subPaths,kindPaths].includes(i.path));

	
			if(subCategories.length > 0) {
				page.callout("info", "Subcategories", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `subcategory pages which are part of the ${fmt.bold(category || "")} ${fmt.italics("category")}.`
				})
				page.table(
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
				page.ul(
					`no subcategories found for this category page`,
					`to be listed a page would need one of the following tags:`,
					l => l.indent(
						`\`#subcategory/${category}/[subcategory]\`, `,
						`\`#${kind_tag}/subcategory/${category}/[subcategory]`
					)
				)
			}
			if(kindPages.length > 0) {
				page.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are kinded as ${fmt.bold(kind_tag || "")} ${fmt.italics("and")} are part of the ${fmt.bold(category || "")} category.`
				})
				page.table(
					["Page", "Created", "Subcategory", "Desc", "Links"],
					kindPages.map(p => {
						const pg = page.getPage(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.showCreatedDate(pg, "DD"),
							page.showCreatedDate(pg, "subcategory"),
							page.showProp(pg, "desc","description","about"),
							page.showLinks(pg)
						]
					})
				).catch(e => plg.error(`Problems rendering table`, e));
			}
	
			if(otherPages.length > 0) {
				if(kindPages.length>0 || subCategories.length>0) {
					page.callout("info", "Other Pages", { 
						style: {
							mt: "1rem",
							mb: "1rem",
						},
						content: `other back links which aren't related directly via their classification`
					})
				}
				page.table(
					["Page", "Created", "Kind", "Category", "Links"],
					otherPages.map(p => {
						const pg = page.getPage(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.showCreatedDate(pg, "DD"),
							page.showProp(pg, "kind"),
							page.showProp(pg, "category", "categories"),
							page.showLinks(pg)
						]
					})
				).catch(e => plg.error(`Problems rendering otherPages table`, e));
			}
	
		} // end Category Page
		else if (page.isSubcategoryPage) {
			/** kinded pages of the given subcategory */
			const kinded = links.where(p => {
				const pg = page.getPage(p);
				if (pg) {
					return isKindedPage(plg)(pg) 
						? (
							isFileLink(pg.subcategory) && pg.subcategory.path === current.file.path
						  ) || (
							hasFileLink(pg.subcategories) && pg.subcategories.filter(i => isFileLink(i)).map(i => i.path).includes(current.file.path)
						  )
						: false
				}
				return false
			})
			
			const other = links.where( 
				p => kinded.map(k => k.path).includes(p.path)
			);
			
	
			if(kinded.length > 0) {
				page.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are kinded as ${fmt.bold(kind_tag || "")} ${fmt.italics("and")} are part of the ${fmt.bold(current.file.name)} subcategory .`
				})
				page.table(
					["Page", "Created", "Modified", "Desc", "Links"],
					kinded.map(p => {
						const pg = page.getPage(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.showCreatedDate(pg, "DD"),
							page.showModifiedDate(pg, "DD"),
							page.showProp(pg, "desc", "description", "about"),
							page.showLinks(pg)
						]
					})
				);
			} else {
				page.paragraph(`### Subcategory Page`)
				page.ul(
					`no pages which identify as being in this subcategory`,
					`to be listed, a page would need one of the following tag groups:`,
					l => l.indent(
						`<code>#${kind_tag}/${category}/${subcategory}</code>`,
						`<code>#${kind_tag} #subcategory/${category}/${subcategory}</code>`,
					)
				)
			}
			if(other.length > 0) {
				page.paragraph(`### Other Back Links`);
				page.table(
					["Page", "Created", "Kind", "Category", "Links"],
					other.map(p => {
						const pg = page(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.showCreatedDate(pg, "DD"),
							page.showProp(pg, "kind"),
							page.showProp(pg, "category", "categories"),
							page.showLinks(pg)
						]
					})
				);
			}
		} // end Subcategory Page
		else if (page.type === "kinded") {
			// KINDED PAGE
			let peering: "none" | "subcategory" | "category" = "none";
	
			if (page.subcategories.length > 0) {
				// peers from subcategory perspective
				const peers = links.where(p => 
					get_classification(page(p))?.subcategory === subcategory
				)
				if (peers.length>0) {
					peering = "subcategory";
					page.callout("info", "Peers", {
						content: `pages who share the same ${fmt.bold(current.file.name)} ${fmt.italics("subcategory")} as this page`,
						style: {
							mt: "1rem",
							mb: "1rem"
						},
						fold: ""
					})
	
					page.table(
						["Page", "Created", "Modified", "Desc", "Links"],
						peers.map(p => {
							const pg = page.getPage(p) as DvPage;
							return [
								page.createFileLink(pg),
								page.showCreatedDate(pg,"DD"),
								page.showModifiedDate(pg,"DD"),
								page.showProp(pg, "desc","description","about"),
								page.showLinks(pg)
							]
						})
					)
				}
			} else if (page.categories.length > 0) {
				// peers from category perspective
				const peers = links.where(p => 
					get_classification(page(p))?.category === category
				)
				if (peers.length>0) {
					peering = "category";
					if(subcategory) {
						page.callout("info", "Peers", { 
							style: {
								pt: "1rem"
							},
							content: `no peers with your subcategory ${fmt.bold(subcategory)} found but there are peers with your ${fmt.italics("category")} ${fmt.bold(category)}`
						})
						page.paragraph(`> ![note] no peers with your subcategory ${subcategory} found but there are peers with your category of ${category}`)
					} else {
						page.callout("info", "Peers", { 
							style: {
								mt: "1rem",
								mb: "1rem",
							},
							content: `pages who share the same ${fmt.bold(category)} ${fmt.italics("category")} as this page`
						})
					}
	
					page.table(
						["Page", "Created", "Modified", "Desc", "Links"],
						peers.map(p => {
							const pg = page.getPage(p) as DvPage;
							return [
								page.createFileLink(pg),
								page.showCreatedDate(pg,"DD"),
								page.showModifiedDate(pg,"DD"),
								page.showProp(pg, "desc","description","about"),
								page.showLinks(pg)
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
					page.callout("info", "Other Back Links", { 
						style: {
							mt: "2rem",
							mb: "1rem",
						},
					})
				}
	
	
				page.table(
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
		else if (page.type === "kind-defn") {
			const categoryPages = links.where(p => 
				get_classification(page(p))?.isCategory &&
				get_kind_prop(page(p)).kind?.file?.path === current.file.path
			);
	
			if(categoryPages.length>0) {
				page.callout("info", "Classification Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages that are category pages of this ${fmt.italics("kind definition")} page and their subcategories.`
				});
		
		
				page.table(
					["Category", "Tag", "Subcategories"],
					categoryPages.map(p => {
						const pg = page.getPage(p) as DvPage;
						return [
							page.createFileLink(pg),
							page.categories.join(`, `),
							page.subcategories.join(`, `)
						]
					})
				)
			}
	
			const kindPages = links.where(p => 
				get_kind_prop(page(p)).kind?.file?.path === current.file.path &&
				isKindedPage(page(p))
			);
	
			if(kindPages.length>0) {
				page.callout("info", "Kinded Pages", { 
					style: {
						mt: "1rem",
						mb: "1rem",
					},
					content: `pages who's "kind" is defined by this page.`
				});
				
				const [_,classification] = get_prop(current, "__classification");
				
				if(isString(classification) && classification === "categories") {
					page.table(
						["Page", "Categories", "Links"],
						kindPages.map(p => {
							const pg = page.getPage(p) as DvPage;
							return [
								page.createFileLink(pg),
								page.showProp(pg,  "categories"),
								page.showLinks(pg)
							]
						})
					)
					
				} else {
	
					page.table(
						["Page", "Category", "Subcategory", "Links"],
						kindPages.map(p => {
							const pg = page.getPage(p) as DvPage;
							return [
								page.createFileLink(pg),
								page.showProp(pg, "category", "categories"),
								page.showProp(pg, "subcategory"),
								page.showLinks(pg)
							]
						})
					)
				}
			}
	
		}
		
	
		if(links.length === 0) {
			page.renderValue(`- no back links found to this page`).catch(e => plg.error(`Problem rendering paragraph WRT to no back links`, e));
		}
	}


}
