import type {
  AfterFirst,
  CsvToStrUnion,
  CsvToTuple,
  Dictionary,
  EmptyObject,
  ExpandDictionary,
  First,
} from "inferred-types";
import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type { createTable } from "src/helpers";
import type { PageInfoBlock } from "./Page";
import type KindModelPlugin from "~/main";
import type { getPageFromKindTag } from "~/page/getPageFromTag";
import { RenderApi } from "~/api";
import { DataViewApi } from "./dataview_types";

/**
 * A handler's query parameters definition.
 */
export interface QueryDefinition<
  _S extends readonly ScalarDefn[] = ScalarDefn[],
  _O extends Record<string, TypeToken> = Record<string, TypeToken>,
> {
  scalar: ScalarDefn[];
  options: OptionsDefn;
}

/**
 * Determines the _types_ of the scalar parameters for a given `QueryDefinition`
 */
export type ScalarParams<
  T extends readonly ScalarDefn[],
  U extends Dictionary = EmptyObject,
> = [] extends T
  ? ExpandDictionary<U>
  : ScalarParams<AfterFirst<T>, U & FromScalarDefn<First<T>>>;

export type Column = `column(${string})`;
export type ColumnType = ["column", string];
export type Columns = `columns(${string})`;
export type ColumnsType = ["columns", string];

export type TypeToken =
  | "string"
  | "opt(string)"
  | "number"
  | "opt(number)"
  | "bool"
  | "boolean"
  | "opt(bool)"
  | `array(string)`
  | `array(number)`
  | `array(enum(${string}))`
  | `opt(array(string))`
  | `opt(array(number))`
  | Column
  | Columns
  | `enum(${string})`
  | `opt(enum(${string}))`;

export type ScalarName = string;
/** the definition of a scalar variable */
export type ScalarDefn = `${ScalarName} AS ${TypeToken}`;
/** the definition of an options hash  */
export type OptionsDefn = Record<string, TypeToken>;

/** type util which converts a `TypeToken` to it's representative type */
export type FromTypeToken<T extends TypeToken> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "bool"
      ? boolean
      : T extends "boolean"
        ? boolean
        : T extends "opt(string)"
          ? string | undefined
          : T extends "opt(number)"
            ? number | undefined
            : T extends "opt(bool)"
              ? boolean | undefined
              : T extends "opt(boolean)"
                ? boolean | undefined
                : T extends `enum(${infer Enum})`
                  ? CsvToStrUnion<Enum>
                  : T extends `opt(enum(${infer Enum}))`
                    ? CsvToStrUnion<Enum> | undefined
                    : T extends `array(string)`
                      ? string[]
                      : T extends `array(number)`
                        ? number[]
                        : T extends `array(enum(${infer Enum}))`
                          ? CsvToStrUnion<Enum>[]
                          : T extends `column(${infer Name})`
                            ? ["column", Name]
                            : T extends `columns(${infer Names})`
                              ? [
                                  "columns",
                                  CsvToTuple<Names>,
                                ]
                              : never;

/**
 * Type utility to transform a string definition of a Scalar property
 * to a key/value pair.
 */
export type FromScalarDefn<T extends ScalarDefn> = T extends `${infer Name} AS ${infer Type extends TypeToken}`
  ? Record<Name, FromTypeToken<Type>>
  : never;

export type OptionParams<T extends Record<string, TypeToken> | undefined> = T extends undefined
  ? EmptyObject
  : T extends Record<string, TypeToken>
    ? { [K in keyof T]: FromTypeToken<T[K]>; }
    : never;

/**
 * **HandlerApi**
 *
 * Exposes the `test` and `params` metadata of a `Handler` function.
 */
export interface HandlerApi {
  /**
   * A handler provides a function to test whether the string provided
   * inside a `km` query matches the command.
   */
  test: (val: string) => boolean;

  /**
   * Defines the _scalar_ parameters which lead the parameters expected
   * followed by the key/value _options_ hash.
   */
  params: QueryDefinition;
}

/**
 * The payload provided by Obsidian when a registered codeblock event
 * is fired.
 */
export interface ObsidianCodeblockEvent {
  source: string;
  el: HTMLElement;
  ctx: MarkdownPostProcessorContext & Component;
}

/**
 * A handler is given a `HandlerResponse` when `km` block matches the
 * handler's RegExp pattern.
 */
export interface HandlerEvent<
  _THandler extends string,
  TScalar extends Dictionary,
  TOpt extends Dictionary,
> {
  debug: KindModelPlugin["debug"];
  info: KindModelPlugin["info"];
  warn: KindModelPlugin["warn"];
  error: KindModelPlugin["error"];

  getPageFromKindTag: ReturnType<typeof getPageFromKindTag>;

  /** 
   * The Render API surface
   */
  render: RenderApi;

  /** KindModelPlugin for logging and API access */
  plugin: KindModelPlugin;
  /**
   * The `PageInfoBlock` for the page which contains the Code Block
   * being evaluated
   */
  page: PageInfoBlock;

  /** the DataView API surface */
  dv: DataViewApi;

  /**
   * Context about the Markdown
   */
  ctx: Component & MarkdownPostProcessorContext;

  /**
   * **createTable**`(...startingCols)` -> `(handler, opt)` -> `(data)` -> void
   *
   * Helper for `km` handlers which builds a table and renders it using
   * `Dataview`'s table renderer.
   *
   * - Step one is to provide the "default columns" you will define with the
   * callback handler
   * - Step two is to provide a callback function which will map a column
   * to it's render value; the callback function is given a `PageInfo` for
   * the given record.
   * - Step three -- the final step -- is to pass it a `DataArray` of results
   * to render, at this point you can also express a set of options into an
   * options hash to handle certain conditions.
   */
  createTable: ReturnType<typeof createTable>;

  /**
   * The string content found in the code block
   */
  source: string;
  /**
   * The RegExp used to identify whether the handler should
   * be invoked.
   */
  re: RegExp;
  /**
   * The _raw_ string content contained within the
   * parenthesis of a `km` handler.
   */
  raw: string;
  /**
   * A key/value dictionary of scalar values passed in by caller
   */
  scalar: TScalar;
  /**
   * The handler's option hash.
   */
  options: TOpt;
}

/**
 * A handler function which returns:
 *
 * - `true` if handled successfully
 * - `false` if not handled
 * - `Error` if problem occurred during the handling process.
 */
export type Handler<
  THandler extends string,
  TScalar extends Dictionary,
  TOpt extends Dictionary,
> = (event: HandlerEvent<THandler, TScalar, TOpt>) => Promise<boolean | Error>;
