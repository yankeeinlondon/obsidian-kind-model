import { FmPropSuggestions, Frontmatter } from "./frontmatter";
import {  Link as DvLink } from "obsidian-dataview";
import { DateTime } from "luxon";
import { Tag } from "./general";
import { ExpandRecursively } from "inferred-types";

/** A function which maps an array element to some value. */
export type ArrayFunc<T, O> = (elem: T, index: number, arr: T[]) => O;

/** A function which compares two types. */
export type ArrayComparator<T> = (a: T, b: T) => number;

/**
 * Proxied interface which allows manipulating array-based data. All functions on a data array produce a NEW array
 * (i.e., the arrays are immutable).
 */
export interface DataArray<T> {
  /** The total number of elements in the array. */
  length: number;

  values: T[];

  /** Filter the data array down to just elements which match the given predicate. */
  where(predicate: ArrayFunc<T, boolean>): DataArray<T>;
  /** Alias for 'where' for people who want array semantics. */
  filter(predicate: ArrayFunc<T, boolean>): DataArray<T>;

  /** Map elements in the data array by applying a function to each. */
  map<U>(f: ArrayFunc<T, U>): DataArray<U>;
  /** Map elements in the data array by applying a function to each, then flatten the results to produce a new array. */
  flatMap<U>(f: ArrayFunc<T, U[]>): DataArray<U>;
  /** Mutably change each value in the array, returning the same array which you can further chain off of. */
  mutate(f: ArrayFunc<T, unknown>): DataArray<unknown>;

  /** Limit the total number of entries in the array to the given value. */
  limit(count: number): DataArray<T>;
  /**
   * Take a slice of the array. If `start` is undefined, it is assumed to be 0; if `end` is undefined, it is assumed
   * to be the end of the array.
   */
  slice(start?: number, end?: number): DataArray<T>;
  /** Concatenate the values in this data array with those of another iterable / data array / array. */
  concat(other: Iterable<T>): DataArray<T>;

  /** Return the first index of the given (optionally starting the search) */
  indexOf(element: T, fromIndex?: number): number;
  /** Return the first element that satisfies the given predicate. */
  find(pred: ArrayFunc<T, boolean>): T | undefined;
  /** Find the index of the first element that satisfies the given predicate. Returns -1 if nothing was found. */
  findIndex(pred: ArrayFunc<T, boolean>, fromIndex?: number): number;
  /** Returns true if the array contains the given element, and false otherwise. */
  includes(element: T): boolean;

  /**
   * Return a string obtained by converting each element in the array to a string, and joining it with the
   * given separator (which defaults to ', ').
   */
  join(sep?: string): string;

  /**
   * Return a sorted array sorted by the given key; an optional comparator can be provided, which will
   * be used to compare the keys in leiu of the default dataview comparator.
   */
  sort<U>(key: ArrayFunc<T, U>, direction?: "asc" | "desc", comparator?: ArrayComparator<U>): DataArray<T>;

  /**
   * Return an array where elements are grouped by the given key; the resulting array will have objects of the form
   * { key: <key value>, rows: DataArray }.
   */
  groupBy<U>(key: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<{ key: U; rows: DataArray<T> }>;

  /**
   * Return distinct entries. If a key is provided, then rows with distinct keys are returned.
   */
  distinct<U>(key?: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<T>;

  /** Return true if the predicate is true for all values. */
  every(f: ArrayFunc<T, boolean>): boolean;
  /** Return true if the predicate is true for at least one value. */
  some(f: ArrayFunc<T, boolean>): boolean;
  /** Return true if the predicate is FALSE for all values. */
  none(f: ArrayFunc<T, boolean>): boolean;

  /** Return the first element in the data array. Returns undefined if the array is empty. */
  first(): T;
  /** Return the last element in the data array. Returns undefined if the array is empty. */
  last(): T;

  /** Map every element in this data array to the given key, and then flatten it.*/
  to(key: string): DataArray<unknown>;
  /**
   * Recursively expand the given key, flattening a tree structure based on the key into a flat array. Useful for handling
   * hierarchical data like tasks with 'subtasks'.
   */
  expand(key: string): DataArray<unknown>;

  /** Run a lambda on each element in the array. */
  forEach(f: ArrayFunc<T, void>): void;

  /** Convert this to a plain javascript array. */
  array(): T[];

  /** Allow iterating directly over the array. */
  [Symbol.iterator](): Iterator<T>;

  /** Map indexes to values. */
  [index: number]: unknown;
  /** 
	 * Automatic flattening of fields. Equivalent to implicitly 
	 * calling `array.to("field")` */
  [field: string]: unknown;
}

/**
 * **DataToArray**
 * 
 * Iterates over a dictionary and proxies the key/values through but
 * in cases where the value _extends_ Dataview's `DataArray` type it will
 * convert it into just a standard Javascript array.
 */
export type DataToArray<T extends Record<string, unknown>> = ExpandRecursively<{
	[K in keyof T]: T[K] extends DataArray<infer U>
		? U[] | null
		: T[K];
}>;

export interface FileStats {
  /**
   * Time of creation, represented as a unix timestamp, in milliseconds.
   * @public
   */
  ctime: number;
  /**
   * Time of last modification, represented as a unix timestamp, in milliseconds.
   * @public
   */
  mtime: number;
  /**
   * Size on disk, as bytes.
   * @public
   */
  size: number;
}


export interface TemplateFile  {
  stat: FileStats;

  /**
   * Filename without extension
   */
  basename: string;
  /**
   * the file's extension; often "md"
   */
  extension: string;

  name: string;

  parent?: TemplateFile;

  /**
   * the full path to the file including the filename
   */
  path: string;


  saving?: boolean;
  deleted: boolean;
}



/**
 * **DataviewPage**
 * 
 * A representation of a "page" returned by 
 */
export type DvPage = { file: DvFileProperties } & FmPropSuggestions;

export type DvPageWithArray = { file:  DvFilePropertiesAsArray } & FmPropSuggestions;

/**
 * **Link**
 * 
 * A reference to a file (extends dataview's Link to allow future "hover" functionality)
 */
export interface Link extends DvLink {
	/** a fully qualified path to a file in the vault */
	path: string;
	type: "file" | "folder";
	display?: string;
	hover?: string;
	embed: boolean;
}

/**
 * A more explicit typing of `Link` which requires the link to
 * be to a **file**.
 */
export interface FileLink extends Link {
	type: "file"
}

/**
 * A more explicit typing of `Link` which requires the link to
 * be to a **folder**.
 */

export interface FolderLink extends Link {
	type: "folder"
}

/**
 * The "file" property on a Dataview page.
 */
export type DvFileProperties = {
	/** _aliases_ for this page's name */
    aliases: DataArray<string>;
	/** the _date_ the page was created */
    cday: DateTime;
	/** _date_ and _time_ that page was created */
    ctime: DateTime;
    etags: DataArray<string>;
	/** the file's extension (often `md` but not always) */
    ext: string;
	/** the **folder** which this page is contained in */
    folder: string;
	/** the frontmatter defined on this page */
    frontmatter: Frontmatter;
	/** pages which _link to_ the given page */
    inlinks: DataArray<Link>,
	/** a `Link` to the page *//** a `Link` to the page */
    link: Link,
    lists: DataArray<unknown>,
	/** date that page was last modified */
    mday: DateTime,
	/** date and time that page was last modified */		
    mtime: DateTime,
	/** The file's name (without extension) */
    name: string;
	/**
	 * The other pages in the vault which this page _links to_
	 */
    outlinks: DataArray<Link>,
	/** The fully qualified path to the page (including filename and extension) */
    path: string;
    size: number;
    starred: boolean;
    tags: DataArray<string>,
    tasks: DataArray<unknown>,
	file: never
}

type DvFileDataProps = "aliases" | "etags" | "inlinks" | "lists" | "outlinks" | "tags" | "tasks";

export type DvFilePropertiesAsArray = Omit<DvFileProperties, DvFileDataProps> & {
	/** _aliases_ for this page's name */
	aliases: string[];
	etags: string[];
	/** pages which _link to_ the given page */
	inlinks: Link[];
	lists: unknown[];
	/**
	 * The other pages in the vault which this page _links to_
	 */
	outlinks: Link[];
	tags: string[];
	tasks: unknown[]
}


export type DataViewFilter = (f: ({file: DvPage})) => boolean;



export interface DataViewQueryApi {

  /**
   * Query for a list of pages
   */
  pages: (query: string) => DataArray<DvFileProperties>

  /**
   * Query for a singular page
   */
  page: (query: string  | TemplateFile)=> DvPage;
  fileLink: (file: string, embed?: boolean, displayAs?: string) => Link;
  pagePaths: (query: string | TemplateFile | TemplateFile[])=> string[];

  // render
  el(element: string, text: string): void;
  header(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): void;
  paragraph(text: string): void;
  span(text: string): void;
  execute(query: string): void;
  executeJs(inlineCode: string): void;

  view(path: string, params: Record<string, unknown>): Promise<void>;


  /**
   * Output a table to page
   */
  table(cols: string[], data: unknown[]): void;
  /**
   * Output a list to page
   */
  list(data: unknown[]): void;

}

export type DvPageCacheEntry = {
	aliases: Set<string>;
	ctime: DateTime;
	day?: DateTime;
	/** a representation of the frontmatter in the form of a `Map` */
	fields: Map<string, unknown>;
	/** a dictionary representation of the frontmatter */
	frontmatter: Frontmatter;
	links: Link[];
	lists: unknown[];
	mtime: DateTime;
	/** fully qualified path include file's name and extension */
	path: string;
	size: number;
	/** tags on page */
	tags: Set<Tag>
}

export type DataviewRootApi = {
	pages: Map<string, DvPageCacheEntry>;
}

export interface DataviewSettings {
  allowHtml: boolean;
  dataviewJsKeyword: string;
  defaultDateFormat: string;
  enableDataviewJs: boolean;
  enableInlineDataview: boolean;
  enableInlineDataviewJS: boolean;
  inlineJsQueryPrefix: string;
  inlineQueriesInCodeblocks: boolean;
  inlineQueryPrefix: string;
  maxRecursiveRenderDepth: number;
  prettyRenderInlineFields: boolean;
  recursiveSubTaskCompletion: boolean;
  refreshEnabled: boolean;
  refreshInterval: number;
  renderNullAs: string;
  showResultCount: true;
  tableGroupColumnName: string;
  tableIdColumnName: string;
  taskCompletionText: string;
  taskCompletionTracking: boolean;
  taskCompletionUseEmojiSHorthand: boolean;
  warnOnEmptyResult: boolean;
}
