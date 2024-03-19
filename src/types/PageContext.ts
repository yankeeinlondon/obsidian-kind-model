import { MarkdownView } from "obsidian";
import { DateTime, Link } from "obsidian-dataview";
// import { DataviewSettings } from "./dataview_types";
import { Node, RenderableTreeNode } from "@markdoc/markdoc";
import { Frontmatter, HeadingTag } from "./frontmatter";
import { KindApi } from "../helpers/KindApi";
import { KindClassification, UomType } from "./settings_types";
import { BlockTemplate } from "./BlockTemplate";
import { Tag } from "../types/general";

/**
 * Defines a document **tag** property which _might_ not be present
 * (in which case the `null` value is provided)
 */
export type OptionalTag = null | `#${string}`;

/**
 * Provides both a `name` and `link` property which refer to a page in
 * the Obsidian vault.
 */
export type NamedLink = { name: string; link: Link };

/**
 * The context derived from a page where an _active view_ and _plugin_ can be passed
 * in to gain these insights.
 */
export interface BasePageContext<THasView extends boolean = false> {
	__kind: "BasePageContext";
	/**
	 * The API surface for a page
	 */
	api: KindApi;
	/**
	 * The identified category of page this is (as an element of the `KindType` enumeration)
	 */
	kind: KindType;
	/**
	 * Boolean flag indicating whether a "view" was provided to gather context for this
	 * page. In cases where it _was_ some additional properties will be made available.
	 */
	viewProvided: THasView;

	/**
	 * **kindTags**
	 * 
	 * a list of tags which represent _kind types_ in the current vault
	 */
	kindTags: string[],
	/**
	 * a list of recognized category tags
	 */
	categoryTags: string[];
	/**
	 * a list of recognized subcategory tags
	 */
	subcategoryTags: string[];

	/**
	 * a list of recognized enumeration tags
	 */
	enumTags: string[];


	// /**
	//  * Settings for [Dataview plugin](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/).
	//  */
	// dv: DataviewSettings;
	/** the list of page name aliases; empty array if none */
	aliases: string[];
	/**
	 * The frontmatter properties found on the page.
	 * 
	 * Note: _this includes the `tags` and `aliases` if present_
	 */
	fm: Frontmatter;
	/** The date that the file was created. */
	cday: DateTime;
	/** The date _and time_ that the file was created. */
	ctime: DateTime;
	/** The date that the file last modified. */
	mday: DateTime;
	/** The date _and time_ that the file was last modified. */
	mtime: DateTime;
	/** 
	 * Whether or not the file has been starred/bookmarked in 
	 * core Obsidian plugin "Bookmarks".
	 */
	starred: boolean;

	/**
	 * A list of all incoming links to this file, meaning all files
	 * that contain a link to this file.
	 */
	inlinks: Link[];
	/** 
	 * A list of all outgoing links from this file, meaning all 
	 * links the file contains. 
	 */
	outlinks: Link[];

	/**
	 * **etags**
	 * 
	 * A list of all explicit tags in the note; unlike `tags`, 
	 * does not break sub-tags down, i.e. [#Tag/1/A]
	 */
	etags: string[];
	/**
	 * **tags**
	 * 
	 * A list of all unique tags in the note. Sub-tags are broken down by each level, 
	 * so `#Tag/1/A` will be stored in the list as [#Tag, #Tag/1, #Tag/1/A].
	 */
	tags: string[];


	/** A list of all tasks (I.e., | [ ] some task) in this file. */
	tasks: unknown[];

	/**
	 * A list of all list elements in the file (including tasks); these 
	 * elements are effectively tasks and can be rendered in task views.
	 */
	lists: unknown[];

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
	icon_assigned: string;

	/**
	 * The **mode** that the current page is operating under
	 */
	mode: THasView extends true ? MarkdownView["currentMode"] : never;

	leaf: THasView extends true ? MarkdownView["leaf"] : never;

	/**
	 * The height of the window which is hosting the current file
	 */
	leaf_height?: THasView extends true ? number : never;
	/**
	 * The width of the window which is hosting the current file
	 */
	leaf_width?:  THasView extends true ? number : never;
	leaf_id?: THasView extends true ? string : never;
	popover: THasView extends true ? MarkdownView["hoverPopover"] : never;
	allowNoFile: THasView extends true ? MarkdownView["allowNoFile"] : never;
	previewMode: THasView extends true ? MarkdownView["previewMode"] : never;
	/**
	 * A textual representation of the type of view you have.
	 * 
	 * - if you're editing a markdown file it should be `markdown`
	 */
	viewType: THasView extends true 
		? ReturnType<MarkdownView["getViewType"]>
		: never;
	showBackLinks?: boolean;

	/**
	 * Whether or not the view is intended for navigation. If your view is a static view that 
	 * is not intended to be navigated away, set this to false. (For example: File explorer, 
	 * calendar, etc.) If your view opens a file or can be otherwise navigated, set this to 
	 * true. (For example: Markdown editor view, Kanban view, PDF view, etc.) File views can 
	 * be navigated by default.
	 */
	navigation: THasView extends true ? MarkdownView["navigation"] : never

	editor: THasView extends true ? MarkdownView["editor"] : never;

	/**
	 * A debounced request to save the page (2 secs from now)
	 */
	requestSave: THasView extends true ? MarkdownView["requestSave"] : never;

	/**
	 * The raw/text content of the page (including frontmatter)
	 */
	content: THasView extends true ? string : never;

	/**
	 * Properties derived from the `content` property based on both a
	 * **regex** decomposition as well as using [Markdoc](https://markdoc.dev/)'s
	 * AST parsing as well as the further refined 
	 * [renderable tree node](https://markdoc.dev/docs/render#transform).
	 */
	contentStructure: THasView extends true ? {
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
	: never;

	/** information on the **file** (path, folder, ext) */
	file: {
		/** 
		 * The path to the file from Vault's root. This includes the filename
		 * and extension.
		 */
		path: string;

		/** 
		 * **Page Link**
		 * 
		 * A [Dataview](https://blacksmithgu.github.io/obsidian-dataview) link to the page 
		 */
		link: Link;
		/** the folder that the page is on */
		folder: string;
		/** the file extension (no period in string) */
		ext: string;
		/** the filename without extension or path */
		name: string;
		/** the file size (in bytes) */
		size: number;
	}
	/**
	 * references to DOM elements related to page
	 */
	dom: {
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

	}

	export type KindConditionalFlags = {
	/**
	 * Whether the page has been identified as a _kind definition page_ because it has 
	 * a tag of `#kind/[NAME]` or has a `kind` property that points back to `[[Kind]]`
	 * the 
	 */
	isKindDefinition: boolean;

	/**
	 * **isTypeDefinition**
	 * 
	 * Whether the page has been identified as a _**type** definition page_ because it has
	 * a tag of `#type/NAME` or has a `kind` property that points back to `[[Type]]`.
	 */
	isTypeDefinition: boolean;

	/**
	 * **isKindedPage**
	 * 
	 * Whether a page has been identified as a _kinded page_ either due to having
	 * a tag `#[tag]` which is registered as a _kind_ or a `kind` property which
	 * points to another page (validation of that page is not done yet).
	 */
	isKindedPage: boolean;

	/**
	 * Boolean flag to indicate whether page is a _category page_.
	 * This is determined by whether there is a `#category` tag.
	 */
	isCategoryPage: boolean;
	/** 
	 * Boolean flag indicating the page is a _subcategory page_.
	 * This is determined by the presence of a `#subcategory` tag.
	 */
	isSubcategoryPage: boolean;

	/**
	 * **isEnumerationPage**
	 * 
	 * Page was identified as an _enumeration Definition_ due to the presence of
	 * a `#enum/[name]` tag. The `values` property does not need to be set yet
	 * for this to evaluate to true.
	 */
	isEnumerationPage: boolean;

	/**
	 * **isBlockDefinition**
	 * 
	 * Page was tagged as a block definition (aka, `#block/[name]`) or has 
	 * a property `kind` which looks like a reference to `[[Block Template]]`.
	 */
	isBlockDefinition: boolean;

	/**
	 * Many classification types require that their classification pages
	 * have a "reference name". This is determined by tags such as `#category/NAME`,
	 * etc.
	 * 
	 * Note: if not a classification page you should expect this to always be false
	 */
	hasClassificationRefName: boolean;

	/**
	 * **hasClassificationTargetTags**
	 * 
	 * a classification page -- like `category`, `subcategory`, etc. -- is meant to
	 * not only have a `#[classification]/[ref_name]` tag but at least one other tag
	 * to point to what it is a _classification for_.
	 * 
	 * **Related:** `hasClassificationForProp`
	 */
	hasClassificationTargetTags: boolean;

	/**
	 * **hasClassificationForProp**
	 * 
	 * a classification page is meant to have a property `for` which points to one
	 * or more _kinds_ which this is a classification for.
	 * 
	 * **Related:** `hasClassificationTargetTags`
	 */
	hasClassificationForProp: boolean;	
}

export type KindType = 
	| "Kind Definition" 
	| "Type Definition"
	| "Kinded Page" 
	| "Category Page" 
	| "Subcategory Page"
	| "Block Template"
	| "Enumeration Definition"
	| null;

/**
 * **PageContext**`<K>`
 * 
 * The `BasePageContext` plus the `kind_category` property indicating the 
 * type of page it is.
 */
export type PageContext<K extends KindType = KindType, V extends boolean = false> = {__kind: "PageContext"; kind_category: K} & (
	K extends "Kind Definition"
	? KindDefinition  & Omit<BasePageContext<V>, "__kind">
	: K extends "Type Page"
	? TypeDefinition  & Omit<BasePageContext<V>, "__kind">
	: K extends "Category Page"
	? CategoryPage  & Omit<BasePageContext<V>, "__kind">
	: K extends "Subcategory Page"
	? SubcategoryPage  & Omit<BasePageContext<V>, "__kind">
	: K extends "Enumeration Definition"
	? EnumDefinition  & Omit<BasePageContext<V>, "__kind">
	: K extends "Block Template"
	? BlockTemplate  & Omit<BasePageContext<V>, "__kind">
	: K extends "Kind Page"
	? KindedPage  & Omit<BasePageContext<V>, "__kind">
	: UnknownKind  & Omit<BasePageContext<V>, "__kind">
);

export type KindPageApi = {
	base: {
		render_h1: () => Promise<void>;
		render_cover: () => Promise<void>;

		remove_page: () => Promise<void>;
		update_page: () => Promise<void>;
	}
	"Category Page": {
		/** returns the kind(s) this is a category for */
		category_for: () => KindPage<"Kind Definition">[];
		/**
		 * The full etag found on the category page. A category page, even one which
		 * hasn't provided a ref_tag, must provide at least `#category` to be considered
		 * a category page so this property should always be present.
		 */
		raw_tag: () => Tag;
		/**
		 * **ref_tag**
		 * 
		 * The _reference tag_ which the category page is taking ownership for.
		 * 
		 * - if none found then `null` returned
		 * - if found the reference is prepended with a `#` to make it a valid tag name
		 */
		ref_tag: () => OptionalTag;
	};
	"Subcategory Page": {
		of_kind: () => KindPage<"Kind Definition">;
		of_category: () => KindPage<"Category Page">;
		/** the reference tag for this category */
		ref_tag: () => OptionalTag;
		/** the etag which starts with #subcategory and ideally has hierarchy */
		raw_tag: () => string | null;
	}
}


/**
 * **KindPage**`<K>`
 * 
 * A page with all context provided by `PageContext` as well as an `api` property
 * which hosts the API surface for the given _kind_ of page.
 */
export type KindPage<K extends KindType = KindType, V extends boolean = false>  = {
	api: KindPageApi["base"] & (
		K extends keyof KindPageApi 
			? KindPageApi[K] 
			: { msg: "no methods for this category of page"}
	)
} & PageContext<K,V>;

export type UomTuple = [prop: string, defn: UomType, value: number];
export type PropTuple<T> = [prop: string, value: T];

/**
 * **ListExpansion**
 * 
 * A configuration setting for a Kind _definition_ which describes which blocks
 * should have their lists expanded to new pages. Format: 
 */
export type ListExpansion = [logic: boolean ] | [logic: boolean, ...blocks: BlockTemplate[]];

export type LinkExpansionConstraint = [regex: string, ...kinds:KindType[]];

export type LinkExpansion = (string | LinkExpansionConstraint)
