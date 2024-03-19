import KindModelPlugin from "../../main";
import { KindType, KindPage, PageContext, KindPageApi } from "../../types/PageContext";

const baseMethods = <C extends PageContext<KindType,boolean>>(
	plugin: KindModelPlugin, 
	ctx: C
) => ({
	render_h1: () => {
		// 
	},
	render_cover: () => {

	},
	remove_page: () => {
		// 
	},
	update_page: () => {
		//
	}
}) as KindPageApi["base"]

const methods = (plugin: KindModelPlugin) => <
	C extends PageContext<K, V>,
	K extends KindType,
	V extends boolean
>(ctx: C) => {
	switch (ctx.kind_category) {
		case "Kind Definition":
			return {
				...baseMethods(plugin,ctx)
			};
		case "Type Definition":
			return {
				...baseMethods(plugin,ctx)
			};
		case "Category Page":
			return {
				
				category_for: () => {
					//
				},
				raw_tag: () => {
					// 
				},
				ref_tag: () => {

				},
				...baseMethods(plugin,ctx)
			};
		case "Subcategory Page":
			return {
				...baseMethods(plugin,ctx)
			};

		case "Block Template": 
			return {
				...baseMethods(plugin,ctx)
			};

		case "Enumeration Definition":
			return {
				...baseMethods(plugin,ctx)
			};

		case "Kinded Page":
			return {
				...baseMethods(plugin,ctx)
			};

	}
}

/**
 * **getKindedPage**(plugin) → (pageContext) → KindedPage`<T>`
 * 
 * Receives a `PageContext` and adds the appropriate methods for
 * that page type to the api surface.
 */
export const getKindedPage = (plugin: KindModelPlugin) => <
	TContext extends PageContext<TKindCategory,THasView>,
	TKindCategory extends KindType,
	THasView extends boolean,
>(ctx: TContext) => {
	return {
		...ctx,
		...methods(plugin)(ctx),
		__kind: "KindedPage"
	} as KindPage<TKindCategory,THasView>
}
