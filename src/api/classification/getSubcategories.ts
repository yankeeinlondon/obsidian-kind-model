import { ensureLeading, stripLeading } from "inferred-types";
import KindModelPlugin from "~/main";
import { getPage, getPageFromTagOrFuturePage } from "~/page";
import { PageReference, PageSubcategory } from "~/types";
import { getPageType, isKindTag } from "../classificationApi";

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export function getSubcategories(p: KindModelPlugin) {
	return (pg: PageReference): PageSubcategory[] => {
		const page = getPage(p)(pg);
		const pageType = getPageType(p)(pg);

		if (page && pageType) {
			const possibleKinded = (Array.from(page.file.tags) as string[]).filter(
				i => i.split("/").length === 3
					&& !["category", "subcategory"].includes(i.split("/")[1])
					&& isKindTag(p)(i.split("/")[0]),
			).map((i) => {
				const [kind, category, subcategory] = i.split("/");
				return {
					kind: stripLeading(kind, "#"),
					page: getPageFromTagOrFuturePage(p)(
						`${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,
						`"${subcategory}" as Subcategory of "${category}" for "${stripLeading(kind, "#")}"`,
					),
					category,
					subcategory,
					kindedTag: `${ensureLeading(kind, "#")}/${category}/${subcategory}`,
					defnTag: `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,

				} as PageSubcategory;
			});

			switch (pageType) {
				case "kind-defn":
				case "type-defn":
				case "kinded > category":
					return [];
				case "kinded > subcategory":
					const tags = (Array.from(page.file.tags) as string[]).filter(
						i => i.split("/")[1] === "subcategory",
					) as string[];

					return tags.map(
						tag => {
							const [kind, _, category, subcategory] = tag.split("/");
							return {
								kind: stripLeading(kind, "#"),
								page: getPageFromTagOrFuturePage(p)(
									`${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,
									`"${subcategory}" as Subcategory of "${category}" for "${stripLeading(kind, "#")}"`,
								),
								category,
								subcategory,
								kindedTag: `${ensureLeading(kind, "#")}/${category}/${subcategory}`,
								defnTag: `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,
							};
						}
					).filter(i => i.subcategory) as PageSubcategory[];

				case "kinded":
				case "multi-kinded":
					const ktags = (Array.from(page.file.tags) as string[]).filter(
						i => (
							!(["category", "subcategory"].includes(i.split("/")[1])) &&
							i.split("/").length === 3
						)
					);
					p.debug("kinded subcategory tags", ktags);

					return ktags.map(
						tag => {
							const [kind, category, subcategory] = tag.split("/");
							const findTag = `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`
							const futureName = `"${subcategory}" as Subcategory of the "${category}" for "${stripLeading(kind, "#")}"`;
							return {
								kind: stripLeading(kind, "#"),
								page: getPageFromTagOrFuturePage(p)(
									findTag,
									futureName
								),
								category,
								subcategory,
								kindedTag: `${ensureLeading(kind, "#")}/${category}/${subcategory}`,
								defnTag: findTag,
							};
						}
					).filter(i => i.subcategory) as PageSubcategory[];


				case "multi-kinded > category":
				case "multi-kinded > subcategory":
					return [];
				case "none":
					return [];
			}
		}

		return [];
	};
}
