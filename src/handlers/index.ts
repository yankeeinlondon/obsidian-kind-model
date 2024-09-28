import KindModelPlugin from "~/main";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { Icons } from "./icons";
import { kind_table } from "./Kind";
import { page_entry } from "./PageEntry";
import { video_gallery } from "./VideoGallery";
import { Page } from "./Page";

export const queryHandlers = (k: KindModelPlugin) => ({
	Icons: Icons(k),
	BackLinks: BackLinks(k),
	Book: Book(k),
	Kind: kind_table(k),
	PageEntry: page_entry(k),
	Page: Page(k),
	VideoGallery: video_gallery(k),
});


export type QueryHandlers = ReturnType<typeof queryHandlers>;
