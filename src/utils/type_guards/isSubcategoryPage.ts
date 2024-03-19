import {  SubcategoryPage } from "../../types/PageContext"
import { isBasePageContext } from "./isBasePageContext"

export const isSubcategoryPage = (v: unknown): v is SubcategoryPage => {
	return isBasePageContext(v) && v.kind === "Subcategory Page"
}
