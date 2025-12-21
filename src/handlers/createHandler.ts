/* eslint style/no-tabs: ["off"] */
import { type } from "arktype";
import type { Type } from "arktype";
import type { Dictionary, PascalCase } from "inferred-types";
import type KindModelPlugin from "~/main";
import type {
  Handler,
  HandlerEvent,
  ObsidianCodeblockEvent,
  OptionParams,
  OptionsDefn,
  ScalarDefn,
  ScalarParams,
} from "~/types";
import {
  createFnWithProps,
  stripParenthesis,
  toPascalCase,
} from "inferred-types";
import { renderApi } from "~/api";
import { HandlerError } from "~/errors";
import { createTable, parseQueryParams, parseQueryParamsWithArkType } from "~/helpers";
import { getPageInfoBlock } from "~/page";
import { getPageFromKindTag } from "~/page/getPageFromTag";
import { isError } from "~/type-guards";
import type { InferOptions, InferScalar } from "./schema";

function clientHandler(p: KindModelPlugin) {
  return <
    THandler extends string,
    S extends readonly ScalarDefn[],
    O extends OptionsDefn,
    THandlerFn extends Handler<THandler, ScalarParams<S>, OptionParams<O>>,
  >(
    handler: THandler,
    handlerFn: THandlerFn,
    scalarParams: S,
    optionParams: O,
    evt: ObsidianCodeblockEvent,
  ) =>
    createFnWithProps(
      async (): Promise<boolean | Error> => {
        const page = getPageInfoBlock(p)(evt);
        /** RegExp which tests whether this handler should try to handle or not */
        // Note: Need double backslash to escape parens in the regex string
        // Use [\s\S]* instead of .* to match across newlines (multiline content)
        const re = new RegExp(`${handler}\\(([\\s\\S]*)\\)`);
        let _event: HandlerEvent<THandler, ScalarParams<S>, OptionParams<O>>;
        /** error template */
        const err = HandlerError.rebase({
          evt,
          page,
          handler,
          workingOn: "initialization",
        });

        if (page) {
          // test whether to run handler
          if (re.test(evt.source)) {
            // we'll handle this event
            try {
              const match = evt.source.match(re);
              const raw = match
                ? stripParenthesis(
                    Array.from(match as RegExpMatchArray)[1],
                  )
                : "";

              p.debug(`Handler ${handler} parsing`, { source: evt.source, match, raw });

              const result = parseQueryParams(p)(
                handler,
                raw,
                scalarParams,
                optionParams,
              );

              p.debug(`Handler ${handler} parse result`, { isError: isError(result), result });

              if (isError(result)) {
                p.warn(`Handler ${handler} returning error:`, result.message);
                return result;
              }
              else {
                const [scalar, options] = result;

                const event: HandlerEvent<
                  THandler,
                  ScalarParams<S>,
                  OptionParams<O>
                > = {
                  debug: p.debug,
                  info: p.info,
                  warn: p.warn,
                  error: p.error,
                  report: err,
                  getPageFromKindTag: getPageFromKindTag(p),
                  plugin: p,
                  page,
                  source: evt.source,
                  ctx: evt.ctx,
                  re,
                  raw,
                  createTable: createTable(
                    p,
                    page,
                    { handler, handlerParams: raw || "" },
                  ),

                  dv: p.dv,
                  render: renderApi(p)(evt.el, evt.ctx.sourcePath),

                  scalar,
                  options,
                };

                const _handled = await handlerFn(event);
                p.debug(`Code Block event processed by ${handler}.`, {
                  page,
                  scalar,
                  options,
                });

                return true;
              }
            }
            catch (e) {
              return err.proxy(e);
            }
          }
          else {
            // this is not the right handler for the payload
            return false;
          }
        }
        else {
          // couldn't create a page!
          return err(
            `Unable to create a PageInfoBlock from the page in which the code block being parsed was found!`,
            { sourcePath: evt.ctx.sourcePath },
          );
        }
      },
      // properties
      {
        handlerName: handler,
      },
    );
}

/**
 * Hybrid client handler for TypeToken scalars + ArkType options.
 * Used by handlers that use .scalar().optionsSchema() pattern.
 */
function clientHandlerHybrid(p: KindModelPlugin) {
  return <
    THandler extends string,
    S extends readonly ScalarDefn[],
    TOptions extends Dictionary,
    THandlerFn extends Handler<THandler, ScalarParams<S>, TOptions>,
  >(
    handler: THandler,
    handlerFn: THandlerFn,
    scalarParams: S,
    optionsSchema: Type<TOptions>,
    evt: ObsidianCodeblockEvent,
  ) =>
    createFnWithProps(
      async (): Promise<boolean | Error> => {
        const page = getPageInfoBlock(p)(evt);
        const re = new RegExp(`${handler}\\(([\\s\\S]*)\\)`);
        const err = HandlerError.rebase({
          evt,
          page,
          handler,
          workingOn: "initialization",
        });

        if (page) {
          if (re.test(evt.source)) {
            try {
              const match = evt.source.match(re);
              const raw = match
                ? stripParenthesis(Array.from(match as RegExpMatchArray)[1])
                : "";

              p.debug(`Handler ${handler} parsing (Hybrid)`, { source: evt.source, match, raw });

              // Use old TypeToken parser for scalars
              const result = parseQueryParams(p)(
                handler,
                raw,
                scalarParams,
                {} as any, // Empty TypeToken options (will validate with ArkType below)
              );

              p.debug(`Handler ${handler} parse result (Hybrid)`, { isError: isError(result), result });

              if (isError(result)) {
                p.warn(`Handler ${handler} returning error:`, result.message);
                return result;
              }
              else {
                const [scalar, rawOptions] = result;

                // Validate options with ArkType
                const optionsResult = optionsSchema(rawOptions);
                if (optionsResult instanceof type.errors) {
                  return err(
                    `Invalid options: ${optionsResult.summary}`,
                  );
                }

                const options = optionsResult;

                const event: HandlerEvent<THandler, ScalarParams<S>, TOptions> = {
                  debug: p.debug,
                  info: p.info,
                  warn: p.warn,
                  error: p.error,
                  report: err,
                  getPageFromKindTag: getPageFromKindTag(p),
                  plugin: p,
                  page,
                  source: evt.source,
                  ctx: evt.ctx,
                  re,
                  raw,
                  createTable: createTable(p, page, { handler, handlerParams: raw || "" }),
                  dv: p.dv,
                  render: renderApi(p)(evt.el, evt.ctx.sourcePath),
                  scalar,
                  options,
                };

                const _handled = await handlerFn(event);
                p.debug(`Code Block event processed by ${handler} (Hybrid).`, {
                  page,
                  scalar,
                  options,
                });

                return _handled === undefined ? true : _handled;
              }
            }
            catch (err) {
              return isError(err) ? err : new Error(String(err));
            }
          }
          else {
            return false;
          }
        }
        else {
          return err("page not found");
        }
      },
      { handlerName: handler },
    );
}

/**
 * Client handler for ArkType-based schemas.
 * This validates options using ArkType for rich error messages and type inference.
 */
function clientHandlerWithArkType(p: KindModelPlugin) {
  return <
    THandler extends string,
    TScalar extends Dictionary,
    TOptions extends Dictionary,
    THandlerFn extends Handler<THandler, TScalar, TOptions>,
  >(
    handler: THandler,
    handlerFn: THandlerFn,
    scalarSchema: Type<TScalar> | null,
    optionsSchema: Type<TOptions> | null,
    evt: ObsidianCodeblockEvent,
  ) =>
    createFnWithProps(
      async (): Promise<boolean | Error> => {
        const page = getPageInfoBlock(p)(evt);
        const re = new RegExp(`${handler}\\(([\\s\\S]*)\\)`);

        const err = HandlerError.rebase({
          evt,
          page,
          handler,
          workingOn: "initialization",
        });

        if (page) {
          if (re.test(evt.source)) {
            try {
              const match = evt.source.match(re);
              const raw = match
                ? stripParenthesis(
                    Array.from(match as RegExpMatchArray)[1],
                  )
                : "";

              p.debug(`Handler ${handler} parsing (ArkType)`, { source: evt.source, match, raw });

              const result = parseQueryParamsWithArkType(p)(
                handler,
                raw,
                scalarSchema,
                optionsSchema,
              );

              p.debug(`Handler ${handler} parse result (ArkType)`, { isError: isError(result), result });

              if (isError(result)) {
                p.warn(`Handler ${handler} returning error:`, result.message);
                return result;
              }
              else {
                const [scalar, options] = result;

                const event: HandlerEvent<THandler, TScalar, TOptions> = {
                  debug: p.debug,
                  info: p.info,
                  warn: p.warn,
                  error: p.error,
                  report: err,
                  getPageFromKindTag: getPageFromKindTag(p),
                  plugin: p,
                  page,
                  source: evt.source,
                  ctx: evt.ctx,
                  re,
                  raw,
                  createTable: createTable(
                    p,
                    page,
                    { handler, handlerParams: raw || "" },
                  ),

                  dv: p.dv,
                  render: renderApi(p)(evt.el, evt.ctx.sourcePath),

                  scalar,
                  options,
                };

                const _handled = await handlerFn(event);
                p.debug(`Code Block event processed by ${handler} (ArkType).`, {
                  page,
                  scalar,
                  options,
                });

                return true;
              }
            }
            catch (e) {
              return err.proxy(e);
            }
          }
          else {
            return false;
          }
        }
        else {
          return err(
            `Unable to create a PageInfoBlock from the page in which the code block being parsed was found!`,
            { sourcePath: evt.ctx.sourcePath },
          );
        }
      },
      {
        handlerName: handler,
      },
    );
}

function addParams<THandler extends string>(handler: THandler) {
  return {
    /**
     * Define the _scalar_ parameters this handler expects.
     *
     * ```ts
     * const Example = createHandler("Example")
     *     .scalar({
     * 		    "Foo as string",
     * 		    "Bar as opt(number)"
     *     });
     * ```
     */
    scalar: <S extends readonly ScalarDefn[]>(...scalarParams: S) => ({
      /**
       * Define the _options_ hash this handler expects.
       */
      options: <O extends OptionsDefn>(optionParams: O = {} as O) => ({
        /**
         * Provide the actual handler function; remember that
         * the handler should be an async function.
         */
        handler:
					<TEvent extends Handler<THandler, ScalarParams<S>, OptionParams<O>>>(
					  handlerFn: TEvent,
					) =>
					  (p: KindModelPlugin) => {
					    return (evt: ObsidianCodeblockEvent) =>
					      clientHandler(p)(
					        handler,
					        handlerFn,
					        scalarParams,
					        optionParams,
					        evt,
					      );
					  },
      }),
    }),
  };
}

/**
 * Extended fluent API for ArkType-based handlers.
 * Provides both legacy TypeToken and new ArkType schema options.
 */
function addParamsWithArkType<THandler extends string>(handler: THandler) {
  return {
    /**
     * Define the _scalar_ parameters this handler expects using TypeToken strings.
     * (Legacy API - maintained for backwards compatibility)
     */
    scalar: <S extends readonly ScalarDefn[]>(...scalarParams: S) => ({
      /**
       * Define the _options_ hash this handler expects using TypeToken strings.
       * (Legacy API)
       */
      options: <O extends OptionsDefn>(optionParams: O = {} as O) => ({
        handler:
					<TEvent extends Handler<THandler, ScalarParams<S>, OptionParams<O>>>(
					  handlerFn: TEvent,
					) =>
					  (p: KindModelPlugin) => {
					    return (evt: ObsidianCodeblockEvent) =>
					      clientHandler(p)(
					        handler,
					        handlerFn,
					        scalarParams,
					        optionParams,
					        evt,
					      );
					  },
      }),

      /**
       * Define the _options_ hash using an ArkType schema.
       * Provides type inference and rich error messages.
       *
       * @example
       * ```ts
       * import { type } from "arktype";
       *
       * const MyHandler = createHandler("MyHandler")
       *   .scalar("kind AS string")
       *   .optionsSchema(type({
       *     "dedupe?": "boolean",
       *     "exclude?": "string | string[]",
       *   }))
       *   .handler(async (evt) => {
       *     // evt.options is fully typed!
       *     const dedupe = evt.options.dedupe; // boolean | undefined
       *     return true;
       *   });
       * ```
       */
      optionsSchema: <TOptions>(schema: Type<TOptions>) => ({
        handler: (
          handlerFn: Handler<THandler, ScalarParams<S>, TOptions>,
        ) =>
          (p: KindModelPlugin) => {
            return (evt: ObsidianCodeblockEvent) =>
              clientHandlerHybrid(p)(
                handler,
                handlerFn,
                scalarParams,
                schema,
                evt,
              );
          },
      }),
    }),

    /**
     * Define scalar parameters using an ArkType schema.
     * For handlers that want ArkType validation for positional params.
     */
    scalarSchema: <TScalar>(scalarSchema: Type<TScalar>) => ({
      /**
       * Define options using an ArkType schema.
       */
      optionsSchema: <TOptions>(optionsSchema: Type<TOptions>) => ({
        handler: (
          handlerFn: Handler<THandler, TScalar, TOptions>,
        ) =>
          (p: KindModelPlugin) => {
            return (evt: ObsidianCodeblockEvent) =>
              clientHandlerWithArkType(p)(
                handler,
                handlerFn,
                scalarSchema,
                optionsSchema,
                evt,
              );
          },
      }),

      /**
       * No options for this handler.
       */
      noOptions: () => ({
        handler: (
          handlerFn: Handler<THandler, TScalar, Record<string, never>>,
        ) =>
          (p: KindModelPlugin) => {
            return (evt: ObsidianCodeblockEvent) =>
              clientHandlerWithArkType(p)(
                handler,
                handlerFn,
                scalarSchema,
                null,
                evt,
              );
          },
      }),
    }),

    /**
     * No scalar parameters, define options with ArkType schema.
     */
    noScalar: () => ({
      optionsSchema: <TOptions>(schema: Type<TOptions>) => ({
        handler: (
          handlerFn: Handler<THandler, Record<string, never>, TOptions>,
        ) =>
          (p: KindModelPlugin) => {
            return (evt: ObsidianCodeblockEvent) =>
              clientHandlerWithArkType(p)(
                handler,
                handlerFn,
                null,
                schema,
                evt,
              );
          },
      }),
    }),
  };
}

/**
 * a _higher order_ function used to created a fully formed
 * `km` handler.
 *
 * @deprecated Use `createHandlerV2` for new handlers to get ArkType support.
 */
export function createHandler<T extends string>(handler: T) {
  return addParams(toPascalCase(handler) as PascalCase<T>);
}

/**
 * Create a KM handler with ArkType schema support.
 *
 * This is the new recommended API for creating handlers. It supports both
 * the legacy TypeToken string-based schema definition and the new ArkType
 * schema-based approach.
 *
 * ## Benefits of ArkType schemas:
 * - Single source of truth for runtime validation AND TypeScript types
 * - Rich, detailed error messages
 * - Type inference without explicit annotations
 *
 * ## Usage
 *
 * ### New ArkType approach (recommended):
 * ```ts
 * import { type } from "arktype";
 *
 * const MyHandler = createHandlerV2("MyHandler")
 *   .noScalar()
 *   .optionsSchema(type({
 *     "dedupe?": "boolean",
 *     "tags?": "string[]",
 *   }))
 *   .handler(async (evt) => {
 *     // evt.options is fully typed from the schema!
 *     return true;
 *   });
 * ```
 *
 * ### Legacy TypeToken approach (for backwards compatibility):
 * ```ts
 * const MyHandler = createHandlerV2("MyHandler")
 *   .scalar("kind AS string")
 *   .options({ dedupe: "opt(bool)" })
 *   .handler(async (evt) => {
 *     return true;
 *   });
 * ```
 */
export function createHandlerV2<T extends string>(handler: T) {
  return addParamsWithArkType(toPascalCase(handler) as PascalCase<T>);
}
