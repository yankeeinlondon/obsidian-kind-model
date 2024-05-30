import { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "../main";
import type { DvPage } from "../types/dataview_types";
import { isString } from "inferred-types";

/**
 * Renders back links for any obsidian page
 */
export const back_links = (plugin: KindModelPlugin) => async (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => {
	const {
		current,
		kind_tag,
		page,
		isCategory,
		isSubcategory,
		isKindedPage,
		isKindDefnPage,
		fmt,
		ul,
		paragraph,
		category,
		table,
		show_subcategories_for,
		get_classification,
		get_prop,
		createFileLink,
		show_links,
		show_prop,
		show_created_date,
		get_kind_prop,
		show_modified_date,
		renderValue,
		subcategory
	} = plugin.api.dv_page(source, container, component, filePath);


	/** all in-bound links for the page with the exception of self-references */
	const links = current.file.inlinks
		.sort(p => page(p)?.file.name)
		.where(p => page(p)?.file.path !== current.file.path);


	if(isCategory) {
		/** pages which are subcategories of the current category page */
		const subCategories = links.where(p =>  
			(get_classification(page(p)).isSubcategory === true) && 
			page(p)?.category?.path === current.file.path &&
			!isKindedPage(page(p))
		);
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
					const pg = page(p) as DvPage;
					return [
						createFileLink(pg),
						show_created_date(pg, "DD"),
						show_modified_date(pg, "DD"),
						show_prop(pg, "desc","description","about"),
						show_links(pg)
					]
				})
			).catch(e => plugin.error(`Problems rendering subcategories table`, e));
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
			).catch(e => plugin.error(`Problems rendering table`, e));
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
			).catch(e => plugin.error(`Problems rendering otherPages table`, e));
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
		renderValue(`- no back links found to this page`).catch(e => plugin.error(`Problem rendering paragraph WRT to no back links`, e));
	}
}
