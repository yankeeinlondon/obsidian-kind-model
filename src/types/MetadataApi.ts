import { getFrontmatter, getMetadata } from "~/api";

export type MetadataApi = {
	/**
	 * Provides the _type_ (e.g., `PageType`) of data contained in each property of the page reference passed in.
	 */
	getMetadata: ReturnType<typeof getMetadata>;

	/**
	 * higher order function which after passed the plugin, will take a
	 * _page reference_ or an object representing a frontmatter key/value
	 * object.
	 *
	 * This function utility is to ensure regardless of the input type that
	 * a valid Frontmatter type is returned.
	 */
	getFrontmatter: ReturnType<typeof getFrontmatter>;
};
