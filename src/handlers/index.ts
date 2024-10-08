import KindModelPlugin from "main";
import { back_links } from "./BackLinks";
import { book } from "./book";
import { Icons } from "./Icons";
import { kind_table } from "./Kind";
import { page_entry } from "./PageEntry";
import { video_gallery } from "./VideoGallery";

export const queryHandlers = (k: KindModelPlugin) => ({
	Icons: Icons(k),
	BackLinks: back_links(k),
	Book: book(k),
	Kind: kind_table(k),
	PageEntry: page_entry(k),
	VideoGallery: video_gallery(k),
});


export type QueryHandlers = ReturnType<typeof queryHandlers>;
