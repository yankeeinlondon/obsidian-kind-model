import KindModelPlugin from "~/main";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { IconPage } from "./IconPage";
import { kind_table } from "./Kind";
import { PageEntry } from "./PageEntry";
import { video_gallery } from "./VideoGallery";
import { Page } from "./Page";

export const queryHandlers = (k: KindModelPlugin) => ({
	IconPage: IconPage(k),
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
	IconPage,
	kind_table,
	PageEntry,
	video_gallery,
	Page
}
