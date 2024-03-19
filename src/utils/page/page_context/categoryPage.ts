import KindModelPlugin from "../../../main";
import { BasePageContext, CategoryPage, OptionalTag, Tag } from "../../../types/PageContext";
import { isValidReference } from "../../type_guards/isValidReference";
import { get_pages } from "../../../dv_queries/get_pages";


export const categoryPage = (plugin: KindModelPlugin, base: BasePageContext) => {
	const raw_tag: Tag = base.meta.etags.find(i => i.startsWith("#category")) as Tag;
	const ref_tag: OptionalTag = `#${base.meta.etags
		.find(t => t.startsWith('#category/'))
		?.replace("#category/", "")}` || null;
	const category_for = isValidReference(base.meta.fm.for)
		? get_pages(plugin)(base.meta.fm.for)
		: null;
	if (category_for === null) {
		plugin.warn(`Category page ${ref_tag} does not define a KIND it is a category for!`, base.meta.fm.for)
	} 
	
	return {
		...base,
		kind: "Category Page",
		raw_tag,
		ref_tag,
		category_for,
	} as CategoryPage;
}
