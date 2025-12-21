import type { DvPage } from "~/types";
import { type } from "arktype";
import { asArray, isString } from "inferred-types";
import { getPageType } from "~/api";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

/**
 * ArkType schema for Kind scalar parameters.
 * Represents: Kind(kind, category?, subcategory?)
 */
const KindScalarSchema = type({
  kind: "string",
  "category?": "string",
  "subcategory?": "string",
});

/**
 * ArkType schema for Kind options.
 */
const KindOptionsSchema = type({
  "+": "reject",
  /**
   * Control whether all pages within scope or only true "kinded" pages are displayed.
   */
  "noClassificationResults?": "boolean",
  "show?": "string[]",
  "hide?": "string[]",
});

// Register the handler with the registry
registerHandler({
  name: "Kind",
  scalarSchema: KindScalarSchema,
  optionsSchema: KindOptionsSchema,
  acceptsScalars: true,
  description: "Displays pages matching a kind/category/subcategory classification",
  examples: [
    "Kind(\"software\")",
    "Kind(\"software\", \"development\")",
    "Kind(\"software\", \"development\", \"ide\")",
    "Kind(\"software\", {hide: [\"Links\"]})",
  ],
});

export const Kind = createHandlerV2("Kind")
  .scalarSchema(KindScalarSchema)
  .optionsSchema(KindOptionsSchema)
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
