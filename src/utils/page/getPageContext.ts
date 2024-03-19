import { BasePageContext, KindType, PageContext } from "../../types/PageContext";
import KindModelPlugin from "../../main";
import { isCategoryPage } from "utils/type_guards/isCategoryPage";
import { isSubcategoryPage } from "../../utils/type_guards/isSubcategoryPage";
import { isKindDefinition } from "../../utils/type_guards/isKindDefinition";
import { isTypeDefinition } from "../../utils/type_guards/isTypeDefinition";
import { isBlockTemplate } from "../../utils/type_guards/isBlockTemplate";
import { isEnumDefinition } from "../../utils/type_guards/isEnumDefinition";
import { isKindedPage } from "../../utils/type_guards/isKindedPage";

const determine = <THasView extends boolean>(
	plugin: KindModelPlugin, 
	base: BasePageContext<THasView>
): KindType => {
	return isKindDefinition(plugin)(base)
		? "Kind Definition"
		: isTypeDefinition(plugin)(base)
		? "Type Definition"
		: isCategoryPage(base)
		? "Category Page"
		: isSubcategoryPage(base)
		? "Subcategory Page"
		: isEnumDefinition(plugin)(base)
		? "Enumeration Definition"
		: isBlockTemplate(plugin)(base)
		? "Block Template"
		: isKindedPage(plugin)(base)
		? "Kinded Page"
		: null;
}

/**
 * **getPageContext**(plugin) → (base_context) → `PageContext`
 * 
 * The `PageContext<TKind, THasView>` adds the `kind_category` property by determining
 * the category of page it is. This category is an element of the `KindType` enumeration.
 */
export const getPageContext = (plugin: KindModelPlugin) => <
	TBase extends BasePageContext<THasView>,
	THasView extends boolean,
>(
	base: TBase
): PageContext<KindType, THasView> => {
	const kind_category = determine(plugin, base);
	return {
		kind_category,
		...base,
		__kind: "PageContext",
	} as PageContext<KindType, THasView>
}
