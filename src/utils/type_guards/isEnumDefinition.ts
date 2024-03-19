import { PageContext } from "types/PageContext"
import { isBasePageContext } from "./isBasePageContext"
import KindModelPlugin from "main"
import { get_page } from "dv_queries/get_page";
import { isDataviewPage } from "./isDataviewPage";
import { isTag } from "./isTag";

/**
 * **isEnumDefinition**(plugin) → (val) -> `PageContext<"Enumeration Definition">`
 * 
 * A higher order type guard which consumes a plugin reference and then value.
 */
export const isEnumDefinition = (
	plugin: KindModelPlugin
) => 
/** 
 * **isEnumDefinition**(val): val is `PageContext<"Enumeration Definition">`
 * 
 * Type guard to validate that passed in value is a _enumeration definition_ page.
 */
(
	val: unknown
): val is PageContext<"Enumeration Definition"> => {

	if (isBasePageContext(val)) {
		const kind_tags  = plugin.api.kind_tags();
		const kind_prop = val.fm?.kind
			? get_page(plugin)(val.kind)
			: null;

		return ( 
			isBasePageContext(val) && ( 
				val.tags.some(t => isTag(t) && kind_tags.has(t))) || 
				((isDataviewPage(kind_prop) && kind_prop.file?.name === "Type")
			)
		);
	} else {
		return false;
	}

}
