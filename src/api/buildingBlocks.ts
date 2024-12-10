/* eslint-disable @typescript-eslint/no-explicit-any */
import type KindModelPlugin from "~/main";

import type { DecomposedCategoryTag, DecomposedKindTag, DecomposedSubcategoryTag, DecomposedTag } from "~/types";
import {
  stripLeading,
} from "inferred-types";
import { isCategoryDefnTag, isKindedWithCategoryTag, isKindedWithSubcategoryTag, isKindTag, isSubcategoryDefnTag, isTypeDefnPage } from "./classificationApi";

export function decomposeTag(p: KindModelPlugin) {
  return (tag: string): DecomposedTag => {
    const safeTag = stripLeading(tag, "#");
    const parts = safeTag.split("/");
    if (!isKindTag(p)(parts[0])) {
      return {
        type: "unknown",
        tag,
        safeTag,
      };
    }

    const partial: Partial<DecomposedTag> = {
      tag,
      safeTag,
      kindTag: parts[0],
      kindDefnTag: `kind/${parts[0]}`,
    };

    if (isCategoryDefnTag(p)(safeTag)) {
      return {
        type: "category",
        ...partial,
        categoryTag: parts[2],
        categoryDefnTag: safeTag,
        isCategoryDefn: true,
        isSubcategoryDefn: false,
        isKindDefn: false,
      } as DecomposedCategoryTag;
    }
    else if (isKindedWithCategoryTag(p)(safeTag)) {
      return {
        type: "category",
        ...partial,
        categoryTag: parts[1],
        categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
        isCategoryDefn: false,
        isSubcategoryDefn: false,
        isKindDefn: false,
      } as DecomposedCategoryTag;
    }
    else if (isKindedWithSubcategoryTag(p)(safeTag)) {
      return {
        type: "subcategory",
        ...partial,
        categoryTag: parts[1],
        categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
        subcategoryTag: parts[2],
        subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}`,
        isCategoryDefn: false,
        isSubcategoryDefn: false,
        isKindDefn: false,
      } as DecomposedSubcategoryTag;
    }
    else if (isSubcategoryDefnTag(p)(safeTag)) {
      return {
        type: "subcategory",
        ...partial,
        categoryTag: parts[2],
        categoryDefnTag: `${parts[0]}/category/${parts[2]}`,
        subcategoryTag: parts[3],
        subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}/${parts[3]}`,
        isCategoryDefn: false,
        isSubcategoryDefn: true,
        isKindDefn: false,
      } as DecomposedSubcategoryTag;
    }
    else if (isTypeDefnPage(p)(safeTag)) {
      return {
        type: "type",
        typeDefnTag: `type/${parts[1]}`,
        typeTag: parts[1],
        tag,
        safeTag,
        isCategoryDefn: false,
        isSubcategoryDefn: false,
        isKindDefn: false,
      };
    }

    return {
      type: "kind",
      ...partial,
      isCategoryDefn: false,
      isSubcategoryDefn: false,
      isKindDefn: safeTag.includes("kind/"),
    } as DecomposedKindTag;
  };
}
