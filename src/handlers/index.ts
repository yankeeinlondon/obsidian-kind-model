import KindModelPlugin from "~/main";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { Icons } from "./Icons";
import { kind_table } from "./Kind";
import { PageEntry } from "./PageEntry";
import { video_gallery } from "./VideoGallery";
import { Page } from "./Page";

export const queryHandlers = (k: KindModelPlugin) => ({
	Icons: Icons(k),
	BackLinks: BackLinks(k),
	Book: Book(k),
	Kind: kind_table(k),
	PageEntry: PageEntry(k),
	Page: Page(k),
	VideoGallery: video_gallery(k),
});


export type QueryHandlers = ReturnType<typeof queryHandlers>;

export {
	BackLinks,
	Book,
	Icons,
	kind_table,
	PageEntry,
	video_gallery,
	Page
}
