/* eslint style/no-tabs: ["off"] */
import type { PascalCase } from "inferred-types";
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
import { isKindError } from "@yankeeinlondon/kind-error";
import {
	createFnWithProps,
	stripParenthesis,
	toPascalCase,
} from "inferred-types";
import { renderApi } from "~/api";
import { createTable, parseQueryParams } from "~/helpers";
import { getPageInfoBlock } from "~/page";
import { getPageFromKindTag } from "~/page/getPageFromTag";
import { HandlerError } from "~/errors";
import { isError } from "~/type-guards";

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
				const re = new RegExp(`${handler}\((.*)\)`);
				let _event: HandlerEvent<THandler, ScalarParams<S>, OptionParams<O>>;
				/** error template */
				let err = HandlerError.rebase({
					evt,
					page,
					handler,
					workingOn: "initialization"
				});

				if (page) {
					// test whether to run handler
					if (re.test(evt.source)) {
						// we'll handle this event
						try {

							const raw = evt.source.match(re)
								? stripParenthesis(
									Array.from(evt.source.match(re) as RegExpMatchArray)[1],
								)
								: "";

							const result = parseQueryParams(p)(
								handler,
								raw,
								scalarParams,
								optionParams,
							);
							if (isError(result)) {
								return result
							} else {
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
						} catch (e) {
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
 * a _higher order_ function used to created a fully formed
 * `km` handler.
 */
export function createHandler<T extends string>(handler: T) {
	return addParams(toPascalCase(handler) as PascalCase<T>);
}
