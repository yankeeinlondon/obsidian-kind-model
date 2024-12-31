import type { PageType } from "./Page";

export interface FuturePage {
  kind: "FuturePage";
  pageType: PageType;
  tag: string;
}
