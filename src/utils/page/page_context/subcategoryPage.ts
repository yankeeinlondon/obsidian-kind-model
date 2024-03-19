import KindModelPlugin from "main";
import { BasePageContext,  SubcategoryPage } from "../../../types/PageContext";

/**
 * **sub_cat_tag**
 * 
 * - $1 is the category
 *-  $2 is the ref name
 */
const sub_cat_tag = /#subcategory\/(\s+)\/(\s+)/;

export const subcategoryPage = (plugin: KindModelPlugin, base: BasePageContext): SubcategoryPage => {
	const raw_tag = base.meta.etags.find(t => t.startsWith('#subcategory')) || null;
	const parts: unknown[] = raw_tag 
		? Array.from(raw_tag.match(sub_cat_tag) || [])
		: [];
	
	return {
		...base,
		kind: "Subcategory Page",
		raw_tag,
		category_of: parts[1] ? String('#' +parts[1]) : null,
		ref_tag: parts[2] ? String('#' + parts[2]) : null
	};
}
