import { back_links } from "handlers/back_links";
import { book } from "handlers/book";
import { kind_table } from "handlers/kind_table";
import { page_entry } from "handlers/page_entry";
import { video_gallery } from "handlers/video_gallery";
import KindModelPlugin from "main";


export const queryHandlers = (plugin: KindModelPlugin) => ({
		/**
	 * Service a `km` code block with a back links section
	 */
		back_links: back_links(plugin),

		/**
		 * Service a `km` code block with entry content for a page
		 */
		page_entry: page_entry(plugin),
	
		/**
		 * Produces a nice book summary widget on a page with book metadata
		 */
		book: book(plugin),
	
		/**
		 * Produces a table summary of all pages of a particular kind
		 */
		kind_table: kind_table(plugin),
	
		/**
		 * Produces a video 
		 */
		video_gallery: video_gallery(plugin),
});
