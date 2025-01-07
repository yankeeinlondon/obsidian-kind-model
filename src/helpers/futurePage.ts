import type KindModelPlugin from "~/main";
import type { FuturePage } from "~/types";

export function futurePage(_p: KindModelPlugin) {
  return (
    name: string,
  ) => {
    return ({
      __kind: "FuturePage",
      file: {
        name,
        path: undefined,
      },
    }) as FuturePage;
  };
}
