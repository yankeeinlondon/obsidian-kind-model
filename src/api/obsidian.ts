import KindModelPlugin from "~/main";
import { ObsidianApp } from "~/types";

type Global = {
	app: ObsidianApp
}


export const obsidianApi = (p: KindModelPlugin) => {

	return {
		/**
		 * the full Obsidian API surface exposed on global
		 */
		obsidianApp: (globalThis as unknown as Global).app,

		/**
		 * A dictionary of commands configured for the active vault
		 */
		commands: (globalThis as unknown as Global).app.commands.commands,

		/**
		 * A dictionary of files:
		 * 
		 * - _keys_ are the full file path
		 * - _values_ are 
		 */
		fileCache: (globalThis as unknown as Global).app.metadataCache.fileCache,
		/**
		 * A dictionary which can be used to lookup metadata using
		 * the `fileCache`'s hash value.
		 */
		metaData: (globalThis as unknown as Global).app.metadataCache.metadataCache,

	}
}
