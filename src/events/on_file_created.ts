import type { MarkdownView, TFile } from "obsidian";
import type KindModelPlugin from "~/main";
import { capitalize, ensureLeading, ensureTrailing, retainUntil, stripBefore, stripLeading } from "inferred-types";
import { dirname, join } from "pathe";
import { update_kinded_page } from "~/commands";
import { kmBlock } from "~/handlers/fmt";
import { generateKindBlock } from "~/helpers/futurePage";
import { isTFile } from "~/type-guards";
import { retryWithBackoff, wait } from "~/utils";

/**
 * event handler triggered when a new file is added to the vault
 */
export function on_file_created(plugin: KindModelPlugin) {
  plugin.registerEvent(plugin.app.vault.on("create", async (file) => {
    if (isTFile(file)) {
      const pageName = file.name;
      let kind: string | undefined;
      let category: string | undefined;
      let subcategory: string | undefined;

      if (pageName.includes(`for "`)) {
        kind = retainUntil(stripBefore(pageName, `for "`), `"`);
      }

      if (pageName.includes(`" as Category for`)) {
        category = retainUntil(stripLeading(pageName, `"`), `"`);
      }

      if (pageName.includes(`" as Subcategory of the "`)) {
        subcategory = retainUntil(stripLeading(pageName, `"`), `"`);
        category = retainUntil(stripBefore(pageName, `as Subcategory of the "`), `"`);
      }

      const handleAs: "category" | "subcategory" | "ignore" = subcategory
        ? "subcategory"
        : category
          ? "category"
          : "ignore";

      if (handleAs !== "ignore") {
        const tag = handleAs === "category"
          ? ensureLeading(`${kind}/category/${category}`, "#")
          : ensureLeading(`${kind}/subcategory/${category}/${subcategory}`, "#");

        const name = handleAs === "category"
          ? `${capitalize(category as string)} ${capitalize(kind as string)}`
          : `${capitalize(subcategory as string)} ${capitalize(category as string)} ${capitalize(kind as string)}`;

        const newFilepath = (name: string) => join(dirname(file.path), ensureTrailing(name, ".md"));

        const kindBlockQuery = generateKindBlock(
          kind as string,
          category as string,
          subcategory,
        );

        const content = `${tag}\n# [[${newFilepath(name)}|${name}]]\n${kmBlock(kindBlockQuery)}\n`;

        const basePath = dirname(file.path);
        const newPath = join(basePath, ensureTrailing(name, ".md"));

        plugin.info(
          `New Kind Page`,
          { kind, category, subcategory, handleAs, tag, name },
        );

        await file.vault.modify(file, content);

        const o = plugin.api.obsidian;
        const leaf = o.getMostRecentLeaf();
        const view = leaf?.view;

        plugin.info(`moving file to ${newPath}`, { leaf, view });
        if (view) {
          // await view?.requestSave();

          // Use multi-layered timing strategy to handle metadata cache timing issues
          plugin.deferUntilDataviewReady(async () => {
            try {
              // Wait for metadata cache to resolve
              await new Promise<void>((resolve) => {
                const checkResolved = () => {
                  if (plugin.app.metadataCache.getFileCache(file)) {
                    resolve();
                  }
                  else {
                    setTimeout(checkResolved, 50);
                  }
                };
                checkResolved();
              });

              // Additional debounce for safety
              await wait(300);

              // Attempt update with retry
              await retryWithBackoff(
                () => update_kinded_page(plugin)(view as MarkdownView),
                { maxAttempts: 3, initialDelay: 200 },
              );
            }
            catch (error) {
              plugin.error("Failed to auto-update future page after retries", error);
            }
          });

          const current = { ...file } as TFile;
          await file.vault.rename(current, newPath);

          plugin.info("renamed", { view, leaf });
        }

        // await file.vault.rename(file, newPath);

        // await evt.vault.rename(tfile, newPath);

        // const activeLeaf = plugin.app.workspace.getMostRecentLeaf();
        // if (activeLeaf) {
        //   await activeLeaf.openFile(tfile);
        // }
      }
    }
    else {
      plugin.warn("new file not TFile!");
    }
  }));
}
