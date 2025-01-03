import { stripLeading } from "inferred-types";
import type KindModelPlugin from "~/main";
import type { FuturePage, PageType } from "~/types";



export function futurePage(p: KindModelPlugin) {
  return (
   name: string,
  ) => {
    return ({
	__kind: "FuturePage",
	  file: {
		name: name,
		path: undefined
	  }
    }) as FuturePage;
  };
}
