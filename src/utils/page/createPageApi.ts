import KindModelPlugin from "../../main";
import { KindCategory,  PageContext, KindPageApi,  PageApi } from "../../types/PageContext";

const baseMethods = <
	K extends KindCategory,
	V extends boolean
>(
	plugin: KindModelPlugin, 
	ctx: Omit<PageContext<K,V>, "api">
): KindPageApi<K,V>["base"] => ({

	render_h1: async () => {
		// 
	},
	update_blocks: async() => {
		//
	},
	remove_page: async() => {
		//
	},
	rename_page: async() => {
		//
	},
	update_frontmatter: async (fm) => {
		//
	},
	get_url_props: () => {
		const defn = ctx.fm["kind"] || {};

		return [];
	},

	request_save: async() => {
		return ctx.request_save();
	}
}) 

const bespokeMethods = <
	P extends KindModelPlugin,
	K extends KindCategory,
	V extends boolean
>(plugin: P,  page: Omit<PageContext<K,V>, "api">): PageApi<K,V> => {
	let api: PageApi<K,V>;

	switch (page.kind_category) {
		case "Kind Definition":
			api = {
				...baseMethods(plugin, page),
				definesRefName: () => {
					const found = page.etags.find(i => i.startsWith(`#kind/`));
					if (found) {
						const [_,ref] = found.split("/");
						return ref.trim().length > 0 
							? true
							: false
					} else {
						return false
					}
				}
			} as PageApi<"Kind Definition",V> as PageApi<K,V>;
			break;
		case "Type Definition":
			api = {
				...baseMethods(plugin, page)
			} as PageApi<"Type Definition",V> as PageApi<K,V>;
			break;
		case "Category Page":
			api = {
				
				category_for: () => {
					//
				},
				raw_tag: () => {
					// 
				},
				ref_tag: () => {

				},
				...baseMethods(plugin,page)
			} as PageApi<"Category Page",V> as PageApi<K,V>;
			break;
		case "Subcategory Page":
			api = {
				...baseMethods(plugin,page)
			} as PageApi<"Subcategory Page",V> as PageApi<K,V>;
			break;

		case "Block Template": 
			api = {
				...baseMethods(plugin,page)
			} as PageApi<"Block Template",V> as PageApi<K,V>;
			break;

		case "Enumeration Definition":
			api = {
				...baseMethods(plugin,page)
			} as PageApi<"Enumeration Definition",V> as PageApi<K,V>;
			break;

		case "Kinded Page":
			api = {
				...baseMethods(plugin,page)
			} as PageApi<"Kinded Page",V> as PageApi<K,V>;
			break;

		default:
			api = baseMethods(plugin,page)  as PageApi<null,V> as PageApi<K,V>
	} // end switch

	return api;
}

/**
 * Adds the API surface to the PageContext passed in.
 */
export const createPageApi = <T extends Omit<PageContext, "api">>(
	plugin: KindModelPlugin, 
	page: T
) => {
	return {
		...baseMethods(plugin,page),
		...bespokeMethods(plugin,page)
	}
}
