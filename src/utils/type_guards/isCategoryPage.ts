import { CategoryPage } from "../../types/PageContext"
import { isBasePageContext } from "./isBasePageContext"

export const isCategoryPage = (v: unknown): v is CategoryPage => {
	return isBasePageContext(v) && v.kind === "Category Page"
}
