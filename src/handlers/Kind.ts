import { asDisplayTag } from "~/helpers";
import { createHandler } from "./createHandler";

export const Kind = createHandler("Kind")
  .scalar(
    "kind AS opt(string)",
    "category AS opt(string)",
    "subcategory AS opt(string)",
  )
  .options({
    show: "array(string)",
    hide: "array(string)",
  })
  .handler(async (evt) => {
    const { createTable, page, render, getPageFromKindTag, dv } = evt;

    const tbl = createTable("Page", "Classification", "Description", "Links")(
      r => [
        r.createFileLink(),
        r.showClassifications(),
        r.showDesc(),
        r.showLinks(),
      ],
      { hideColumnIfEmpty: ["Description", "Links"] },
    );

    const { kind, category, subcategory } = evt.scalar;
    const kindTags = kind
      ? [kind]
      : page.kindTags;

    // Iterate over Kinds
    for (const kind of kindTags) {
      if (kindTags.length > 1) {
        const kindPage = getPageFromKindTag(kind);
        if (kindPage) {
          render.renderValue(`### ${kindPage.file.name} kind`);
        }
        else {
          render.renderValue(`### ${asDisplayTag(kind)} kind`);
        }
      }

      /** query results */
      const pages = subcategory
        ? dv.pages(`#${kind}/${category}/${subcategory}`)
            .sort(c => [c.category, c.subcategory])
        : category
          ? dv.pages(`#${kind}/${category}`).sort(c => c.category)
          : dv.pages(`#${kind}`).sort(c => c.file.name);

      tbl(pages);
    }

    return true;
  });
