import type {
  ExpandDictionary,
  ExpandRecursively,
  TypedFunction,
  TypeGuard,
} from "inferred-types";
import type * as Luxon from "luxon";
import type { Component, MarkdownPostProcessorContext, Pos } from "obsidian";
import type { Link as DvLink, Query, Widget } from "obsidian-dataview";
import type { FmPropSuggestions, Frontmatter } from "./frontmatter";
import type { Tag } from "./general";

export interface LuxonWorkspace {
  DateTime: Luxon.DateTime;
  DateInput: Luxon.DateInput;
  Duration: Luxon.Duration;
  FixedOffsetZone: Luxon.FixedOffsetZone;
  IANAZone: Luxon.IANAZone;
  Interval: Luxon.Interval;
  Settings: Luxon.Settings;
  SystemZone: Luxon.SystemZone;
  Zone: Luxon.Zone;
}

export interface SMarkdownPage {
  file: {
    path: string;
    folder: string;
    name: string;
    link: Link;
    outlinks: Link[];
    inlinks: Link[];
    etags: string[];
    tags: string[];
    aliases: string[];
    lists: SListItem[];
    tasks: STask[];
    ctime: Luxon.DateTime;
    cday: Luxon.DateTime;
    mtime: Luxon.DateTime;
    mday: Luxon.DateTime;
    size: number;
    ext: string;
    starred: boolean;

    day?: Luxon.DateTime;
  };

  /** Additional fields added by field data. */
  [key: string]: any;
}

/** Comparison operators which yield true/false. */
export type CompareOp = ">" | ">=" | "<=" | "<" | "=" | "!=";
/** Arithmetic operators which yield numbers and other values. */
export type ArithmeticOp = "+" | "-" | "*" | "/" | "%" | "&" | "|";
/** All valid binary operators. */
export type BinaryOp = CompareOp | ArithmeticOp;
/** A binary operator field which combines two subnodes somehow. */
export interface BinaryOpField {
  type: "binaryop";
  left: Field;
  right: Field;
  op: BinaryOp;
}

/** A function field which calls a function on 0 or more arguments. */
export interface FunctionField {
  type: "function";
  /** Either the name of the function being called, or a Function object. */
  func: Field;
  /** The arguments being passed to the function. */
  arguments: Field[];
}
export interface LambdaField {
  type: "lambda";
  /** An ordered list of named arguments. */
  arguments: string[];
  /** The field which should be evaluated with the arguments in context. */
  value: Field;
}

/** A field which indexes a variable into another variable. */
export interface IndexField {
  type: "index";
  /** The field to index into. */
  object: Field;
  /** The index. */
  index: Field;
}

/** A field which negates the value of the original field. */
export interface NegatedField {
  type: "negated";
  /** The child field to negated. */
  child: Field;
}

/** A (potentially computed) field to select or compare against. */
export type Field
  = | BinaryOpField
      | VariableField
      | LiteralField
      | FunctionField
      | IndexField
      | NegatedField
      | LambdaField
      | ObjectField
      | ListField;

/** Literal representation of some field type. */
export interface LiteralField {
  type: "literal";
  value: Literal;
}

/** A variable field for a variable with a given name. */
export interface VariableField {
  type: "variable";
  name: string;
}

/** A list, which is an ordered collection of fields. */
export interface ListField {
  type: "list";
  values: Field[];
}

/** An object, which is a mapping of name to field. */
export interface ObjectField {
  type: "object";
  values: Record<string, Field>;
}

////////////////////////
// <-- List Items --> //
////////////////////////

/** A serialized list item. */
export type SListItem = SListEntry | STask;

/** Shared data between list items. */
export interface SListItemBase {
  /** The symbol used to start this list item, like '1.' or '1)' or '*'. */
  symbol: string;
  /** A link to the closest thing to this list item (a block, a section, or a file). */
  link: Link;
  /** The section that contains this list item. */
  section: Link;
  /** The path of the file that contains this item. */
  path: string;

  /** The line this item starts on. */
  line: number;
  /** The number of lines this item spans. */
  lineCount: number;
  /** The internal Obsidian tracker of the exact position of this line. */
  position: Pos;
  /** The line number of the list that this item is part of. */
  list: number;
  /** If present, the block ID for this item. */
  blockId?: string;
  /** The line number of the parent item to this list, if relevant. */
  parent?: number;
  /** The children elements of this list item. */
  children: SListItem[];
  /** Links contained inside this list item. */
  outlinks: Link[];

  /** The raw text of this item. */
  text: string;
  /**
   * If present, overrides 'text' when rendered in task views. You should not mutate 'text' since it is used to
   * validate a list item when editing it.
   */
  visual?: string;
  /** Whether this item has any metadata annotations on it. */
  annotated?: boolean;

  /** Any tags present in this task. */
  tags: string[];

  /** @deprecated use 'children' instead. */
  subtasks: SListItem[];
  /** @deprecated use 'task' instead. */
  real: boolean;
  /** @deprecated use 'section' instead. */
  header: Link;

  /** Additional fields added by annotations. */
  [key: string]: any;
}

/** A serialized list item as seen by users; this is not a task. */
export interface SListEntry extends SListItemBase {
  task: false;
}

/** A serialized task. */
export interface STask extends SListItemBase {
  task: true;
  /** The status of this task, the text between the brackets ('[ ]'). Will be a space if the task is currently unchecked. */
  status: string;
  /** Indicates whether the task has any value other than empty space. */
  checked: boolean;
  /** Indicates whether the task explicitly has been marked "completed" ('x' or 'X'). */
  completed: boolean;
  /** Indicates whether the task and ALL subtasks have been completed. */
  fullyCompleted: boolean;

  /** If present, then the time that this task was created. */
  created?: Literal;
  /** If present, then the time that this task was due. */
  due?: Literal;
  /** If present, then the time that this task was completed. */
  completion?: Literal;
  /** If present, then the day that this task can be started. */
  start?: Literal;
  /** If present, then the day that work on this task is scheduled. */
  scheduled?: Literal;
}

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

  where: (predicate: ArrayFunc<T, boolean>) => DataArray<T>;
  /** Alias for 'where' for people who want array semantics. */
  filter: (predicate: ArrayFunc<T, boolean>) => DataArray<T>;

  /** Map elements in the data array by applying a function to each. */
  map: <U>(f: ArrayFunc<T, U>) => DataArray<U>;
  /** Map elements in the data array by applying a function to each, then flatten the results to produce a new array. */
  flatMap: <U>(f: ArrayFunc<T, U[]>) => DataArray<U>;
  /** Mutably change each value in the array, returning the same array which you can further chain off of. */
  mutate: (f: ArrayFunc<T, unknown>) => DataArray<unknown>;

  /** Limit the total number of entries in the array to the given value. */
  limit: (count: number) => DataArray<T>;
  /**
   * Take a slice of the array. If `start` is undefined, it is assumed to be 0; if `end` is undefined, it is assumed
   * to be the end of the array.
   */
  slice: (start?: number, end?: number) => DataArray<T>;
  /** Concatenate the values in this data array with those of another iterable / data array / array. */
  concat: (other: Iterable<T>) => DataArray<T>;

  /** Return the first index of the given (optionally starting the search) */
  indexOf: (element: T, fromIndex?: number) => number;
  /** Return the first element that satisfies the given predicate. */
  find: (pred: ArrayFunc<T, boolean>) => T | undefined;
  /** Find the index of the first element that satisfies the given predicate. Returns -1 if nothing was found. */
  findIndex: (pred: ArrayFunc<T, boolean>, fromIndex?: number) => number;
  /** Returns true if the array contains the given element, and false otherwise. */
  includes: (element: T) => boolean;

  /**
   * Return a string obtained by converting each element in the array to a string, and joining it with the
   * given separator (which defaults to ', ').
   */
  join: (sep?: string) => string;

  /**
   * Return a sorted array sorted by the given key; an optional comparator can be provided, which will
   * be used to compare the keys in leiu of the default dataview comparator.
   */
  sort: <U>(
    key: ArrayFunc<T, U>,
    direction?: "asc" | "desc",
    comparator?: ArrayComparator<U>,
  ) => DataArray<T>;

  /**
   * Return an array where elements are grouped by the given key; the resulting array will have objects of the form
   * { key: <key value>, rows: DataArray }.
   */
  groupBy: <U>(
    key: ArrayFunc<T, U>,
    comparator?: ArrayComparator<U>,
  ) => DataArray<{ key: U; rows: DataArray<T> }>;

  /**
   * Return distinct entries. If a key is provided, then rows with distinct keys are returned.
   */
  distinct: <U>(
    key?: ArrayFunc<T, U>,
    comparator?: ArrayComparator<U>,
  ) => DataArray<T>;

  /** Return true if the predicate is true for all values. */
  every: (f: ArrayFunc<T, boolean>) => boolean;
  /** Return true if the predicate is true for at least one value. */
  some: (f: ArrayFunc<T, boolean>) => boolean;
  /** Return true if the predicate is FALSE for all values. */
  none: (f: ArrayFunc<T, boolean>) => boolean;

  /** Return the first element in the data array. Returns undefined if the array is empty. */
  first: () => T;
  /** Return the last element in the data array. Returns undefined if the array is empty. */
  last: () => T;

  /** Map every element in this data array to the given key, and then flatten it. */
  to: (key: string) => DataArray<unknown>;
  /**
   * Recursively expand the given key, flattening a tree structure based on the key into a flat array. Useful for handling
   * hierarchical data like tasks with 'subtasks'.
   */
  expand: (key: string) => DataArray<unknown>;

  /** Run a lambda on each element in the array. */
  forEach: (f: ArrayFunc<T, void>) => void;

  /** Convert this to a plain javascript array. */
  array: () => T[];

  settings?: DataviewSettings;

  /** Allow iterating directly over the array. */
  [Symbol.iterator]: (() => Iterable<T[]>) & (() => Iterator<T>);

  /** Map indexes to values. */
  [index: number]: unknown;
  /**
   * Automatic flattening of fields. Equivalent to implicitly
   * calling `array.to("field")`
   */
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
  [K in keyof T]: T[K] extends DataArray<infer U> ? U[] | null : T[K];
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

/**
 * I believer this comes from Templater not dataview
 */
export interface TemplateFile {
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
export type DvPage = ExpandDictionary<
  { file: DvFileProperties; _hash?: string } & FmPropSuggestions
>;

export type DvPageWithArray = {
  file: DvFilePropertiesAsArray;
} & FmPropSuggestions;

/**
 * **Link**
 *
 * A reference to a file (extends dataview's Link to allow future "hover" functionality)
 */
export interface Link extends DvLink {
  /** a fully qualified path to a file in the vault */
  path: string;
  type: "file" | "folder" | "header" | "block";
  display?: string;
  hover?: string;
  embed: boolean;
}

/**
 * A more explicit typing of `Link` which requires the link to
 * be to a **file**.
 */
export interface FileLink extends Link {
  type: "file";
}

export interface HeaderLink extends Link {
  type: "header";
}

export interface BlockLink extends Link {
  type: "block";
}

/**
 * A more explicit typing of `Link` which requires the link to
 * be to a **folder**.
 */

export interface FolderLink extends Link {
  type: "folder";
}

/**
 * The "file" property on a Dataview page.
 */
export interface DvFileProperties {
  /** _aliases_ for this page's name */
  aliases: DataArray<string>;
  /** the _date_ the page was created */
  cday: Luxon.DateTime;
  /** _date_ and _time_ that page was created */
  ctime: Luxon.DateTime;
  etags: DataArray<string>;
  /** the file's extension (often `md` but not always) */
  ext: string;
  /** the **folder** which this page is contained in */
  folder: string;
  /** the frontmatter defined on this page */
  frontmatter: Frontmatter;
  /** pages which _link to_ the given page */
  inlinks: DataArray<Link>;
  /** a `Link` to the page */ /** a `Link` to the page */ link: Link;
  lists: DataArray<unknown>;
  /** date that page was last modified */
  mday: Luxon.DateTime;
  /** date and time that page was last modified */
  mtime: Luxon.DateTime;
  /** The file's name (without extension) */
  name: string;
  /**
   * The other pages in the vault which this page _links to_
   */
  outlinks: DataArray<Link>;
  /** The fully qualified path to the page (including filename and extension) */
  path: string;
  size: number;
  starred: boolean;
  tags: DataArray<string>;
  tasks: DataArray<unknown>;
}

type DvFileDataProps
  = | "aliases"
      | "etags"
      | "inlinks"
      | "lists"
      | "outlinks"
      | "tags"
      | "tasks";

export type DvFilePropertiesAsArray = Omit<
  DvFileProperties,
  DvFileDataProps
> & {
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
  tasks: unknown[];
};

/** Settings when querying the dataview API. */
export interface QueryApiSettings {
  /** If present, then this forces queries to include/exclude the implicit id field (such as with `WITHOUT ID`). */
  forceId?: boolean;
}

export type DataViewFilter = (f: { file: DvPage }) => boolean;

/** Shorthand for a mapping from keys to values. */
export interface DataObject {
  [key: string]: Literal;
}
/** The literal types supported by the query engine. */
export type LiteralType
  = | "boolean"
      | "number"
      | "string"
      | "date"
      | "duration"
      | "link"
      | "array"
      | "object"
      | "function"
      | "null"
      | "html"
      | "widget";
/** The raw values that a literal can take on. */
export type Literal
  = | boolean
      | number
      | string
      | Luxon.DateTime
      | Luxon.Duration
      | Link
      | Array<Literal>
      | DataObject
      | TypedFunction
      | null
      | HTMLElement
      | Widget;

/** A grouping on a type which supports recursively-nested groups. */
export interface GroupElement<T> {
  key: Literal;
  rows: Grouping<T>;
}
export type Grouping<T> = T[] | GroupElement<T>[];

/** The meaning of the 'id' field for a data row - i.e., where it came from. */
export type IdentifierMeaning
  = | { type: "group"; name: string; on: IdentifierMeaning }
      | { type: "path" };

/** The result of executing a table query. */
export interface TableResult {
  type: "table";
  headers: string[];
  values: Literal[][];
  idMeaning: IdentifierMeaning;
}
/** The result of executing a list query. */
export interface ListResult {
  type: "list";
  values: Literal[];
  primaryMeaning: IdentifierMeaning;
}
/** The result of executing a task query. */
export interface TaskResult {
  type: "task";
  values: Grouping<SListItem>;
}
/** The result of executing a calendar query. */
export interface CalendarResult {
  type: "calendar";
  values: {
    date: Luxon.DateTime;
    link: Link;
    value?: Literal[];
  }[];
}

/** The result of executing a query of some sort. */
export type QueryResult
  = | TableResult
      | ListResult
      | TaskResult
      | CalendarResult;

export class DvSuccess<T, E> {
  public successful: true;

  public constructor(public value: T) {
    this.successful = true;
  }

  public map<U>(f: (a: T) => U): DvResult<U, E> {
    return new DvSuccess(f(this.value));
  }

  public flatMap<U>(f: (a: T) => DvResult<U, E>): DvResult<U, E> {
    return f(this.value);
  }

  public mapErr<U>(_f: (e: E) => U): DvResult<T, U> {
    return this as any as DvResult<T, U>;
  }

  public bimap<T2, E2>(
    succ: (a: T) => T2,
    _fail: (b: E) => E2,
  ): DvResult<T2, E2> {
    return this.map(succ) as any;
  }

  public orElse(_value: T): T {
    return this.value;
  }

  public cast<U>(): DvResult<U, E> {
    return this as any;
  }

  public orElseThrow(_message?: (e: E) => string): T {
    return this.value;
  }
}

export class DvFailure<T, E> {
  public successful: false;
  public error: E;

  public constructor(error: E) {
    this.error = error;
    this.successful = false;
  }

  public map<U>(_f: (a: T) => U): DvResult<U, E> {
    return this as any as DvFailure<U, E>;
  }

  public flatMap<U>(_f: (a: T) => DvResult<U, E>): DvResult<U, E> {
    return this as any as DvFailure<U, E>;
  }

  public mapErr<U>(f: (e: E) => U): DvResult<T, U> {
    return new DvFailure(f(this.error));
  }

  public bimap<T2, E2>(
    _succ: (a: T) => T2,
    fail: (b: E) => E2,
  ): DvResult<T2, E2> {
    return this.mapErr(fail) as any;
  }

  public orElse(value: T): T {
    return value;
  }

  public cast<U>(): DvResult<U, E> {
    return this as any;
  }

  public orElseThrow(message?: (e: E) => string): T {
    if (message)
      throw new Error(message(this.error));
    else throw new Error(`${this.error}`);
  }
}

export type DvResult<T, E> = DvSuccess<T, E> | DvFailure<T, E>;

export interface ExportSettings {
  /** Whether or not HTML should be used for formatting in exports. */
  allowHtml: boolean;
}

export interface DataViewApi {
  luxon: LuxonWorkspace;

  /**
   * **pages**`(query, [originFile])`
   *
   * Returns an array of page objects corresponding to pages which match the
   * source query.
   */
  pages: (query?: string, originFile?: string) => DataArray<DvPage>;

  /**
   * **page**`(path, [originFile])`
   *
   * Map a _page path_ to the actual data contained within that page.
   */
  page: (query: string | Link, originFile?: string) => DvPage | undefined;

  /**
   * **fileLink**`(path, [embed],[display])`
   *
   * Create a dataview file link to the given path.
   */
  fileLink: (path: string, embed?: boolean, displayAs?: string) => FileLink;

  /**
   * **sectionLink**`(path, [embed],[display])`
   *
   * Create a dataview section link to the given path.
   */
  sectionLink: (path: string, embed?: boolean, display?: string) => HeaderLink;

  /**
   * **blockLink**`(path, [embed],[display])`
   *
   * Create a dataview block link to the given path.
   */
  blockLink: (path: string, embed?: boolean, display?: string) => BlockLink;

  /**
   * Return an array of paths (as strings) corresponding to pages which match the query.
   */
  pagePaths: (query?: string, originFile?: string) => string[];

  /**
   * Convert an input element or array into a Dataview data-array. If the
   * input is already a data array, it is returned unchanged.
   */
  array: (raw: unknown) => DataArray<any>;
  /**
   * Return true if the given value is a javascript array OR a dataview data array.
   */
  isArray: TypeGuard<DataArray<any> | Array<any>, unknown>;
  /**
   * Return true if the given value is a dataview data array;
   * this returns FALSE for plain JS arrays.
   */
  isDataArray: TypeGuard<DataArray<any>, unknown>;

  /**
   * **date**`(pathLike)`
   *
   * Attempt to extract a date from a string, link or date.
   */
  date: (pathLike: string | Link | Luxon.DateTime) => Luxon.DateTime | null;
  /**
   * **duration**`(pathLike)`
   *
   * Attempt to extract a duration from a string or duration.
   */
  duration: (str: string | Luxon.Duration) => Luxon.Duration | null;

  /**
   * **parse**`(value)`
   *
   * Parse a raw textual value into a complex Dataview type, if possible.
   */
  parse: (value: string) => Literal;

  /**
   * **literal**`(value)`
   *
   * Convert a basic JS type into a Dataview type by parsing dates,
   * links, durations, and so on.
   */
  literal: (value: any) => Literal;

  /**
   * **compare**`(a,b)`
   *
   * Compare two arbitrary JavaScript values using Dataview's default
   * comparison rules. Returns a negative value if a < b, 0 if a = b,
   * and a positive value if a > b.
   */
  compare: (a: any, b: any) => number;
  /**
   * **equal**`(a,b)`
   *
   * Return `true` if the two given JavaScript values are equal using
   * Dataview's default comparison rules.
   */
  equal: (a: any, b: any) => boolean;

  /**
   * **clone**`(value)`
   *
   * Deep clone the given literal, returning a new literal which is
   * independent of the original.
   */
  clone: (value: Literal) => Literal;
  /**
   * Execute an arbitrary Dataview query, returning a query result which:
   *
   * 1. Indicates the type of query,
   * 2. Includes the raw AST of the parsed query.
   * 3. Includes the output in the form relevant to that query type.
   *
   * List queries will return a list of objects ({ id, value }); table queries
   * return a header array and a 2D array of values; and task arrays return a
   * Grouping<Task> type which allows for recursive task nesting.
   */
  query: (
    source: string | Query,
    originFile?: string,
    settings?: QueryApiSettings,
  ) => Promise<DvResult<QueryResult, string>>;

  /** Error-throwing version of {@link query}. */
  tryQuery: (
    source: string | Query,
    originFile?: string,
    settings?: QueryApiSettings,
  ) => Promise<DvResult<string, string>>;

  /**
   * **queryMarkdown**`(source,[originFile],[settings])`
   *
   * Execute an arbitrary dataview query, returning the results
   * in well-formatted markdown.
   */
  queryMarkdown: (
    source: string | Query,
    originFile?: string,
    settings?: Partial<QueryApiSettings & ExportSettings>,
  ) => Promise<DvResult<string, string>>;

  /** Error-throwing version of {@link queryMarkdown}. */
  tryQueryMarkdown: (
    source: string | Query,
    originFile?: string,
    settings?: Partial<QueryApiSettings & ExportSettings>,
  ) => Promise<string>;

  /**
   * **evaluate**`(expression,[context],[originFile])`
   *
   * Evaluate a dataview expression (like '2 + 2' or 'link("hello")'),
   * returning the evaluated result. This takes an optional second argument
   * which provides definitions for variables, such as:
   *
   * ```
   * dv.evaluate("x + 6", { x: 2 }) = 8
   * dv.evaluate('link(target)', { target: "Okay" }) = [[Okay]]
   * ```
   *
   * This method returns a Result type instead of throwing an error; you
   * can check the result of the execution via `result.successful` and obtain
   * `result.value` or `result.error`.
   *
   * If you'd rather this method throw on an error, use `dv.tryEvaluate`.
   */
  evaluate: (
    expression: string,
    context?: DataObject,
    originFile?: string,
  ) => DvResult<Literal, string>;

  /** Error-throwing version of `dv.evaluate` */
  tryEvaluate: (
    expression: string,
    context?: DataObject,
    originFile?: string,
  ) => Literal;

  /**
   * Evaluate an expression in the context of the given file.
   */
  evaluateInline: (
    expression: string,
    context?: DataObject,
    originFile?: string,
  ) => DvResult<Literal, string>;

  // render
  // --------------------

  /**
   * Add a HTML element by passing the `tag` and the interior HTML to the element
   */
  el: (tag: string, text: string) => void;
  span: (text: string) => void;
  header: (level: 1 | 2 | 3 | 4 | 5 | 6, text: string) => void;
  paragraph: (text: string) => void;

  /** Render an arbitrary value into a container. */
  renderValue: (
    value: any,
    container: HTMLElement,
    component: Component,
    filePath: string,
    inline: boolean,
  ) => Promise<void>;

  /**
   * **execute**`(source,container,component,filePath)`
   *
   * Execute the given query, rendering results into the given container
   * using the components lifecycle. Your component should be a *real*
   * component which calls onload() on it's child components at some point,
   * or a `MarkdownPostProcessorContext`!
   *
   * Note that views made in this way are live updating and will automatically
   * clean themselves up when the component is unloaded or the container is
   * removed.
   */
  execute: (
    source: string,
    container: HTMLElement,
    component: Component | MarkdownPostProcessorContext,
    filePath: string,
  ) => Promise<void>;

  /**
   * **executeJs**`(code,container,component,filePath)`
   *
   * Execute the given DataviewJS query, rendering results into the given
   * container using the components lifecycle.
   *
   * See {@link execute} for general rendering semantics.
   */
  executeJs: (
    code: string,
    container: HTMLElement,
    component: Component | MarkdownPostProcessorContext,
    filePath: string,
  ) => Promise<void>;

  view: (path: string, params: Record<string, unknown>) => Promise<void>;

  /**
   * **table**`(headers,values,container,component,filePath)`
   *
   * Render a dataview table with the given headers, and the
   * 2D array of values.
   */
  table: (
    headers: string[],
    values: any[] | DataArray<any>,
    container: HTMLElement,
    component: Component,
    filePath: string,
  ) => Promise<void>;

  /**
   * **taskList**`(tasks,groupByFile,container,component,filePath)`
   *
   * Render a dataview task view with the given tasks.
   */
  taskList: (
    tasks: Grouping<SListItem>,
    groupByFile: boolean,
    container: HTMLElement,
    component: Component,
    filePath: string,
  ) => Promise<void>;

  /**
   * **list**(values, container, component, filePath)
   *
   * Render a dataview **list** of the given values by:
   *
   * - adding a sub-container DIV to the passed in _container_
   * - using the `component`'s `addChild()` method to
   * adding a child element which is given the sub-container
   * for rendering purposes
   */
  list: (
    values: unknown[] | DataArray<unknown> | undefined,
    container: HTMLElement,
    component: Component,
    filePath: string,
  ) => Promise<void>;

  /**
   * These utility methods are all contained in the dv.io sub-API,
   * and are all asynchronous
   */
  io: {
    /**
     * **csv**
     *
     * Load a CSV from the given path (a link or string). Relative paths
     * will be resolved relative to the optional origin file (defaulting to
     * the current file if not provided). Return a dataview array, each
     * element containing an object of the CSV values; if the file does not
     * exist, return undefined.
     *
     * ```ts
     * await dv.io.csv("hello.csv") => [{ column1: ..., column2: ...}, ...]
     * ```
     */
    csv: (path: Link | string, originFile?: string) => Promise<unknown>;
    /**
     * **load**
     *
     * Load the contents of the given path (a link or string)
     * asynchronously. Relative paths will be resolved relative to the
     * optional origin file (defaulting to the current file if not
     * provided). Returns the string contents of the file, or undefined if
     * the file does not exist.
     */
    load: (path: Link | string, originFile?: string) => Promise<string>;
    /**
     * **normalize**
     *
     * Convert a relative link or path into an absolute path. If
     * origin-file is provided, then the resolution is doing as if you were
     * resolving the link from that file; if not, the path is resolved
     * relative to the current file.
     */
    normalize: (path: string, originFile?: string) => Promise<unknown>;
  };
}

export interface DvPageCacheEntry {
  aliases: Set<string>;
  ctime: Luxon.DateTime;
  day?: Luxon.DateTime;
  /** a representation of the frontmatter in the form of a `Map` */
  fields: Map<string, unknown>;
  /** a dictionary representation of the frontmatter */
  frontmatter: Frontmatter;
  links: Link[];
  lists: unknown[];
  mtime: Luxon.DateTime;
  /** fully qualified path include file's name and extension */
  path: string;
  size: number;
  /** tags on page */
  tags: Set<Tag>;
}

export interface DataviewRootApi {
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
