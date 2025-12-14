import type { TFile } from "obsidian";

export function asTFileForMarkdown(
  name: string,
  path: string,
) {
  return {
    name: `${name}.md`,
    path,
    basename: name,
    extension: "md",
  } as unknown as TFile;
}
