import { MarkdownView } from "obsidian";
import { DateTime, Link } from "obsidian-dataview";
// import { DataviewSettings } from "./dataview_types";
import { Node, RenderableTreeNode } from "@markdoc/markdoc";
import { Frontmatter, HeadingTag } from "./frontmatter";
import {  UomType } from "./settings_types";
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
	 * Boolean flag indicating whether a "view" was provided to gather context for this
	 * page. In cases where it _was_ some additional properties will be made available.
	 */
	viewProvided: THasView;
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

/**
 * The _category_ of page type
 */
export type KindCategory = 
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
 * The `BasePageContext` plus the `kind_category` property and the `api`
 * property which exposes a bespoke API surface based on the category of
 * the page.
 */
export type PageContext<
	K extends KindCategory = KindCategory, 
	V extends boolean = false
> = {
	__kind: "PageContext"; 
	kind_category: K
} & PageApi<K,V> & Omit<BasePageContext<V>, "__kind">;


export type UrlValidation = {
	property: string;
	cardinality: "unknown" | "list" | "singular";
	passed: boolean;
	failures: string[];
}

export type KindPageApi<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_K extends KindCategory,
	V extends boolean
> = {
	base: {
		/**
		 * Gets the `PageContext<"Kind Definition">` for the current
		 * page's `kind` property (if defined).
		 */
		// kind_definition: () => PageContext<"Kind Definition">  | null;
		/**
		 * _render_ or _re-render_ the `H1` element on the page
		 * based on the page's (or it's kind's) strategy
		 */
		render_h1: () => Promise<void>;

		/**
		 * _render_ or _re-render_ the configured "blocks" defined
		 * for the current page.
		 */
		update_blocks: () => Promise<void>;

		/**
		 * remove the current page from the vault and adjust the
		 * cache and lookup values found in the plugin's `KindApi`.
		 */
		remove_page: () => Promise<void>;

		rename_page: () => Promise<void>;
		/**
		 * update the _frontmatter_ properties while leaving the body
		 * of the page alone.
		 */
		update_frontmatter: <T extends Record<string,unknown>>(fm: T) => Promise<void>;

		/**
		 * gets a list of property names which are expected to contain
		 * URL's in them.
		 */
		get_url_props: () => string[];

		/**
		 * checks all the properties which are supposed to contain URLs
		 * and returns a `UrlValidation` per property.
		 */
		// validate_url_props: () => string[];

		/**
		 * _request_ that the current page be saved
		 */
		request_save: () => Promise<void>;
	};
	"Kind Definition": {
		/**
		 * returns a boolean flag based on whether the page has
		 * defined the "reference name" for the kind (aka,
		 * by adding a tag such as `#kind/foobar`)
		 */
		definesRefName: () => boolean;

	};
	"Category Page": {
		/** returns the kind(s) this is a category for */
		category_for: () => PageContext<"Category Page",V>[];
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
		of_kind: () => PageContext<"Kind Definition",V>;
		of_category: () => PageContext<"Category Page",V>;
		/** the reference tag for this category */
		ref_tag: () => OptionalTag;
		/** the etag which starts with #subcategory and ideally has hierarchy */
		raw_tag: () => string | null;
	}
}

/**
 * **PageApi**`<K>`
 * 
 * Lookup utility which returns the extracts the appropriate API
 * signature for the given page's page category from `KindPageApi`.
 */
export type PageApi<K extends KindCategory,V extends boolean> = K extends keyof KindPageApi<K,V>
	? KindPageApi<K,V>["base"] & KindPageApi<K,V>[K]
	: KindPageApi<K,V>["base"];

export type UomTuple = [prop: string, defn: UomType, value: number];
export type PropTuple<T> = [prop: string, value: T];

/**
 * **ListExpansion**
 * 
 * A configuration setting for a Kind _definition_ which describes which blocks
 * should have their lists expanded to new pages. Format: 
 */
export type ListExpansion = [logic: boolean ] | [logic: boolean, ...blocks: BlockTemplate[]];

export type LinkExpansionConstraint = [regex: string, ...kinds:KindCategory[]];

export type LinkExpansion = (string | LinkExpansionConstraint)
