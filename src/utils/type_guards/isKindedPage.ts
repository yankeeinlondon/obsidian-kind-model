import { PageContext } from "../../types/PageContext"
import { isBasePageContext } from "./isBasePageContext"
import KindModelPlugin from "../../main"
import { get_page } from "../../dv_queries/get_page";
import { isDataviewPage } from "./isDataviewPage";
import { isTag } from "./isTag";

/**
 * **isKindedPage**(plugin) → (val) -> `PageContext<"Kinded Page">`
 * 
 * A higher order type guard which consumes a plugin reference and then value.
 */
export const isKindedPage = (
	plugin: KindModelPlugin
) => 
/** 
 * **isKindPage**(val): val is `PageContext<"Kinded Page">`
 * 
 * Type guard to validate that passed in value is a _kinded_ page.
 */
(
	val: unknown
): val is PageContext<"Kinded Page"> => {

	if (isBasePageContext(val)) {
		const kind_tags  = plugin.api.kind_tags();
		const kind_prop = val.fm?.kind
			? get_page(plugin)(val.kind)
			: null;

		return ( 
			isBasePageContext(val) && ( 
				val.tags.some(t => isTag(t) && kind_tags.has(t))) || 
				((isDataviewPage(kind_prop) && kind_prop.file?.name === "Kinded Page")
			)
		);
	} else {
		return false;
	}

}
