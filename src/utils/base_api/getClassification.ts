
import KindModelPlugin from "main";
import { Classification } from "types/Classification";
import { DvPage } from "types/dataview_types";

export const getClassification = (p: KindModelPlugin) => (
	pg: DvPage | undefined
): Classification[] => {
	if(pg === undefined) {
		return { isCategory: false, isSubcategory: false, category: undefined, subcategory: undefined};
	}
	const directCat = pg.file.etags.find(
		t => t?.startsWith(`#category/`)
	);
	const directSubCat = pg.file.etags.find(
		t => t?.startsWith(`#subcategory/`)
	);
	const indirectCat = pg.file.etags.find(
		t => t?.split("/").length > 2 && t?.split("/")[1] === "category" 
	);
	const indirectSubCat =  pg.file.etags.find(
		t => t?.split("/").length > 2 && t.split("/")[1] === "subcategory" 
	);
	const kindedPage = pg.file.etags.find(t => 
		t?.split("/").length > 1 && 
		!["#category","#subcategory"].includes(t.split("/")[0]) &&
		!["category","subcategory"].includes(t.split("/")[1])
	)

	return directCat
		? {
			isCategory: true,
			isSubcategory: false,
			category: directCat.split("/")[1],
			subcategory: undefined
		}
		: directSubCat
		? {
			isCategory: false,
			isSubcategory: true,
			category: directSubCat.split("/")[1],
			subcategory: directSubCat.split("/")[2],
		}
		: indirectCat
		? {
			isCategory: true,
			isSubcategory: false,
			category: indirectCat.split("/")[2],
			subcategory: undefined
		}
		: indirectSubCat
		? {
			isCategory: false,
			isSubcategory: true,
			category: indirectSubCat.split("/")[2],
			subcategory: indirectSubCat.split("/")[3]
		}
		: kindedPage
		? {
			isCategory: false,
			isSubcategory: false,
			category: kindedPage.split("/")[1],
			subcategory: kindedPage.split("/")[2],
		}
		: { 
			isCategory: false, 
			isSubcategory: false, 
			category: undefined, 
			subcategory: undefined
		};
}
