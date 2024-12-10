// import { FileManager } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianApp } from "~/types";

interface Global {
  app: ObsidianApp;
}

export function obsidianApi(p: KindModelPlugin) {
  return {
    /**
     * the full Obsidian API surface exposed on global
     */
    app: p.app,

    /**
     * A dictionary of commands configured for the active vault
     */
    commands: (globalThis as unknown as Global).app.commands.commands,

    /**
     * Atomically read, modify, and save the frontmatter of a note. The frontmatter is passed in as a JS object, and should be mutated directly to achieve the desired result.
		 Remember to handle errors thrown by this method.
     * @param file — the file to be modified. Must be a Markdown file.
     * @param fn — a callback function which mutates the frontmatter object synchronously.
     * @param options — write options.
     * @throws — YAMLParseError if the YAML parsing fails
     * @throws — any errors that your callback function throws
     *
     * ```ts
     * app.fileManager.processFrontMatter(file, (frontmatter) => {
     *     frontmatter['key1'] = value;
     *     delete frontmatter['key2'];
     * });
     * ```
     */
    processFrontmatter: p.app.fileManager.processFrontMatter,

    /**
     * Resolves a unique path for the attachment file being saved.
     * Ensures that the parent directory exists and dedupes the
     * filename if the destination filename already exists.
     *
     * @param filename Name of the attachment being saved
     * @param sourcePath The path to the note associated with this attachment, defaults to the workspace's active file.
     * @returns Full path for where the attachment should be saved, according to the user's settings
     */
    getAvailablePathForAttachment:
			p.app.fileManager.getAvailablePathForAttachment,

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
  };
}
