import { createHandler } from "./createHandler";


export const Subcategories = createHandler("Subcategories")
	.scalar()
	.options()
	.handler(async(evt) => {
		const { plugin: p, page } = evt;

		if(page.isCategoryPage) {
			page.paragraph("category page");
		} else {
			page.paragraph("not category page");
		}
	});


