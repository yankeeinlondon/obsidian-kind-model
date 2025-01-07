import type { DvPage } from "~/types";
import { asArray, isString } from "inferred-types";
import { getPageType } from "~/api";
import { createHandler } from "./createHandler";

export const Kind = createHandler("Kind")
  .scalar(
    "kind AS string",
    "category AS opt(string)",
    "subcategory AS opt(string)",
  )
  .options({
    /**
     * control whether all pages within scope or only true "kinded" pages
     * are displayed.
     */
    noClassificationResults: "boolean",
    show: "array(string)",
    hide: "array(string)",
  })
  .handler(async (evt) => {
    const { createTable, plugin, dv, report, options } = evt;
    const noClassificationResult = options.noClassificationResults || true;

    const where = noClassificationResult
      ? (i: DvPage) => ["kinded", "multi-kinded"].includes(getPageType(plugin)(i))
      : () => true;

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
    if (!kind) {
      return report("No kind tag was specified in the Kind()");
    }

    const queryParts: string[] = [`#${kind}`];
    if (category) {
      queryParts.push(`/${category}`);
    }
    if (category && subcategory) {
      queryParts.push(`/${subcategory}`);
    }

    const pages = dv.pages(queryParts.join(""))
      .sort(i => [i.kind, i.category, i.subcategory])
      .where(where);

    if (options.hide) {
      const hide = asArray(options.hide);
      if (hide.every(i => isString(i))) {
        tbl.removeColumns(hide);
      }
    }

    await tbl(pages);

    return true;
  });
