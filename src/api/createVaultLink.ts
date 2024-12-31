import type KindModelPlugin from "~/main";
import type { DvPage, PageInfo, PageReference } from "~/types";
import { getPage } from "~/page/getPage";

type ReturnLink<T extends PageReference> = T extends DvPage
  ? string
  : T extends PageInfo
    ? string
    : string | undefined;

export function createVaultLink(p: KindModelPlugin) {
  return <T extends PageReference>(
    ref: T,
    opt?: {
      display?: string;
      after?: string;
      before?: string;
    },
  ): T extends DvPage
    ? string
    : T extends PageInfo
      ? string
      : string | undefined => {
    const page = getPage(p)(ref);

    if (page) {
      const alias = page.file.name;
      const path = page.file.path;
      const link = `${opt?.before || ""}[[${path}|${alias}]]${opt?.after || ""}`;

      return link as ReturnLink<T>;
    }

    return undefined as ReturnLink<T>;
  };
}
