import { DvPage, Link } from "./dataview_types";
import { Classification } from "./Classification";
import { ObsidianComponent, TAbstractFile, TFile } from "./Obsidian";
import { MarkdownView } from "obsidian";
import { RenderableTreeNode, Node } from "@markdoc/markdoc";
import { Frontmatter, HeadingTag } from "./frontmatter";
import { DateTime } from "luxon";

import { ShowApi } from "~/types";
import { RenderApi, FormattingApi, getPage } from "~/api";


export type PageType = "kinded" | "kind-defn" | "type-defn" | "none";


export type PageInfo = {
	/** 
	 * whether page is _kinded_, a _kind definition_, a _type definition_, or none of the above.
	 */
	type: PageType;

	/** the full path to the page */
	path: string;

	/**
	 * the frontmatter dictionary on the current page
	 * 
	 * **Note:** this is just an alias to `.page.file.frontmatter` property.
	 */
	fm: Frontmatter;

	/** 
	 * All of the categories which the current page belongs to.
	 * 
	 * - this is drawn from both `category` and `categories` props as well
	 * - as any category tags found on the page
	 * - the `PageCategory` return type organizes the categories by the "kind" property
	 * which the category is a part of.
	 */
	categories: PageCategory[];

	/**
	 * All of the subcategories which the current page belongs to.
	 */
	subcategories: PageSubcategory[];

	/** boolean flag indicating whether page is a **category** page for a `kind` */
	isCategoryPage: boolean;

	hasCategoryTag: boolean;
	hasCategoryProp: boolean;


	/** boolean flag indicating whether page is a **subcategory** page for a `kind` */
	isSubcategoryPage: boolean;
	/**
	 * whether a kinded page has _multiple_ kinds in claims membership to
	 */
	hasMultipleKinds: boolean;

	/**
	 * whether the page has a tag which indicates the page's "kind"
	 * but is _not_ a Kind Definition tag.
	 */
	hasKindTag: boolean;

	hasKindDefinitionTag: boolean;
	hasTypeDefinitionTag: boolean;

	/**
	 * whether the page has a "kind" property which indicates the page's "kind"; 
	 * this is **any** "kind" property which links to another page inside
	 * the vault (aka, it should be a kind definition but for this flag it doesn't
	 * have to be). 
	 * 
	 * The one exception, is when the kind property points directly to the `kind` Kind definition
	 * as this indicates it is a 
	 */
	hasKindProp: boolean;


	/**
	 * the Classifications of the page
	 */
	classifications: Classification[];

	/**
	 * whether the page has a "kinds" property which indicates the page's "kind"
	 * (or multiple kinds); this looks for a list where at least one item in the 
	 * list is a link to another page in the vault.
	 */
	hasKindsProperty: boolean;

	/** get the icons associated with this page */
	getIcons(): PageIcons;
	/** get the banners associated with this page */
	getBanners(): PageBanners;
	

	getSuggestedActions(): PageSuggestion[];

	/**
	 * The **Formatting API** surface.
	 */
	format: FormattingApi;

	/** 
	 * The `DvPage` API surface for the given page
	 */
	page: DvPage;


	/**
	 * Get a `DvPage` from any `PageReference`
	 */
	getPage: ReturnType<typeof getPage>
} & ShowApi;

export type PageInfoBlock = PageInfo & RenderApi & {
	/** the content of the code block */
	content: string;
	/** the Obsidian Component instance */
	component: ObsidianComponent;

	/** the HTML Element of the code block */
	container: HTMLElement;
}

/**
 * references to DOM elements found on a Markdown View derived page
 */
export type PageDomElements = {
	container: HTMLElement;
	content: HTMLElement;
	icon?: HTMLElement;
	backButton?: HTMLElement;
	forwardButton?: HTMLElement;
	title?: HTMLElement;
	titleContainer?: HTMLElement;
	titleParent?: HTMLElement;
	inlineTitle?: HTMLElement;
	actions?: HTMLElement;
	modeButton?: HTMLElement;
	backlinks?: HTMLElement;
}

export type MarkdownViewMeta = {
	/**
	 * **titleTimestamp**
	 * 
	 * Only available if the file has a date inside its file name 
	 * (of form yyyy-mm-dd or yyyymmdd), or has a Date field/inline field.
	 */
	title_timestamp?: DateTime;

	/**
	 * The **icon** assigned to the page by Obsidian. This is an **iconId**
	 * and will be available when a "view" is provided to **getPageContext()**.
	 */
	iconAssigned: string;

	/**
	 * The **mode** that the current page is operating under
	 */
	mode: MarkdownView["currentMode"];

	leaf: MarkdownView["leaf"];

	/**
	 * The height of the window which is hosting the current file
	 */
	leaf_height?: number;
	/**
	 * The width of the window which is hosting the current file
	 */
	leaf_width?:  number ;
	leaf_id?: string ;
	popover: MarkdownView["hoverPopover"];
	allowNoFile: MarkdownView["allowNoFile"];
	previewMode: MarkdownView["previewMode"];
	/**
	 * A textual representation of the type of view you have.
	 * 
	 * - if you're editing a markdown file it should be `markdown`
	 */
	viewType: ReturnType<MarkdownView["getViewType"]>;
	showBackLinks?: boolean;

	/**
	 * Whether or not the view is intended for navigation. If your view is a static view that 
	 * is not intended to be navigated away, set this to false. (For example: File explorer, 
	 * calendar, etc.) If your view opens a file or can be otherwise navigated, set this to 
	 * true. (For example: Markdown editor view, Kanban view, PDF view, etc.) File views can 
	 * be navigated by default.
	 */
	navigation: MarkdownView["navigation"];

	editor: MarkdownView["editor"];

	/**
	 * A debounced request to save the page (2 secs from now)
	 */
	requestSave: MarkdownView["requestSave"];

	/** Load this component and its children */
	load: MarkdownView["load"];

	onLoadFile: MarkdownView["onLoadFile"];
	onUnloadFile: MarkdownView["onUnloadFile"];
	/** Called when the size of this view is changed. */
	onResize: MarkdownView["onResize"];
	onRename: MarkdownView["onRename"];
	/**
	 * Populates the pane menu.
	 * 
	 * (Replaces the previously removed onHeaderMenu and onMoreOptionsMenu)
	 */
	onPaneMenu: MarkdownView["onPaneMenu"];

	/** Registers a callback to be called when unloading */
	register: MarkdownView["register"];
	/** Registers an DOM event to be detached when unloading */
	registerDomEvent: MarkdownView["registerDomEvent"];
	/** Registers an event to be detached when unloading */
	registerEvent: MarkdownView["registerEvent"];
	/** Registers an interval (from setInterval) to be cancelled when unloading 
	 * Use window.setInterval instead of setInterval to avoid TypeScript confusing 
	 * between NodeJS vs Browser API 
	 */
	registerInterval: MarkdownView["registerInterval"];

	getEphemeralState: MarkdownView["getEphemeralState"];
	getState: MarkdownView["getState"];
	getViewData: MarkdownView["getViewData"];
	getViewType: MarkdownView["getViewType"];

	/**
	 * The raw/text content of the page (including frontmatter)
	 */
	content: string;

	/**
	 * Properties derived from the `content` property based on both a
	 * **regex** decomposition as well as using [Markdoc](https://markdoc.dev/)'s
	 * AST parsing as well as the further refined 
	 * [renderable tree node](https://markdoc.dev/docs/render#transform).
	 */
	contentStructure: {
		/**
		 * **ast**
		 * 
		 * MarkDoc AST tree from root of Document.
		 * 
		 * References: [docs](markdoc.dev), [sandbox](https://markdoc.dev/sandbox)
		 */
		ast: Node;

		/**
		 * **renderableTree**
		 * 
		 * MarkDoc's `RenderableTreeNode` representation of the page. This
		 * is a higher level representation of the AST and often a better tool
		 * for extraction of structural content on the page 
		 * (like a table of contents, etc.).
		 * 
		 * References: [docs](markdoc.dev/docs/render#transform), [sandbox](https://markdoc.dev/sandbox)
		 */
		renderableTree: RenderableTreeNode | RenderableTreeNode[];
		
		/** the raw YAML content/frontmatter at top of page  */
		yaml: string | undefined;

		/** the raw `content` with frontmatter removed  */
		body: string;

		h1: string | undefined;

		h2_tags: HeadingTag<2>[];

		preH1: string | undefined;
		postH1: string | undefined;

		/**
		 * The page broken down by H2 headings
		 */
		blocks: {name: string; content: string;}[];
	}
}

/**
 * **PageView**
 * 
 * Is provided by the createPageView() utility when a `MarkdownView` is available.
 * It provides all the properties of the `PageInfo` data structure along with additional
 * endpoints which can only be provided when a "view" is underlying the 
 */
export type PageView = PageInfo & {
	dom: PageDomElements;
	/**
	 * Metadata derived from the `MarkdownView` provided to create the `PageView`
	 */
	view: MarkdownViewMeta;
}


export type PageIcons = {
	hasIcon?: boolean;
	typeIcon?: string;
	kindIcon?: string;
	categoryIcon?: string;
	subcategoryIcon?: string;
	pageIcon?: string;
}
export type PageBanners = {
	hasBanner?: boolean;
	typeBanner?: string;
	kindBanner?: string;
	categoryBanner?: string;
	subcategoryBanner?: string;
	pageBanner?: string;
}

export type PageSuggestion = 
| "add-kind-prop"
| "add-kind-tag"
| "add-kinded-prop"
| "add-kinded-tag"
| "add-category-tag"
| "add-category-prop"
| "add-subcategory-tag"
| "add-subcategory-prop";


export type PageReference = PageInfo | DvPage | TFile |TAbstractFile | Link | string;

/**
 * represents a static "kind" and the categories that a given page has of this
 * particular kind.
 */
export type PageCategory = {
	kind: string;
	categories: DvPage[];
}

/**
 * represents a static "kind" and "category" and a set of subcategories which
 * a given page has.
 */
export type PageSubcategory = {
	kind: string;
	/** the "path" to the category which the subcategories are a part of */
	categoryPath: string;
	/** 
	 * The subcategories associated with this page, kind, and category.
	 * 
	 * **Note:** we typically only expect ONE but in order to support future flexibility the
	 * data structure allows for more.
	 */
	subcategories: DvPage[];
}
