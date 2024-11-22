import {
	createFnWithProps,
	kindError,
	toPascalCase,
	stripParenthesis,
} from "inferred-types";
import { PascalCase } from "inferred-types/dist/types";
import { getPageInfoBlock } from "~/api";
import { parseQueryParams } from "~/helpers/parseParams";
import KindModelPlugin from "~/main";
import { isError } from "~/type-guards";
import {
	Handler,
	OptionParams,
	ScalarDefn,
	ScalarParams,
	ObsidianCodeblockEvent,
	HandlerEvent,
	OptionsDefn,
} from "~/types";

const clientHandler =
	(p: KindModelPlugin) =>
	<
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
				let _event: HandlerEvent<
					THandler,
					ScalarParams<S>,
					OptionParams<O>
				>;
				/** error template */
				const err = kindError(`InvalidQuery<${handler}>`, {
					evt,
					page,
				});

				if (page) {
					// test whether to run handler
					if (re.test(evt.source)) {
						const raw = evt.source.match(re)
							? stripParenthesis(
									Array.from(
										evt.source.match(
											re,
										) as RegExpMatchArray,
									)[1],
								)
							: "";

						const result = parseQueryParams(p)(
							handler,
							raw,
							scalarParams,
							optionParams,
						);
						if (isError(result)) {
							// handle output
							return result;
						} else {
							const [scalar, options] = result;

							const event: HandlerEvent<
								THandler,
								ScalarParams<S>,
								OptionParams<O>
							> = {
								plugin: p,
								page,
								source: evt.source,
								ctx: evt.ctx,
								re,
								raw,

								scalar,
								options,
							};

							const _handled = await handlerFn(event);
							p.debug(
								`Code Block event processed by ${handler}.`,
								{ page, scalar, options },
							);

							return true;
						}
					} else {
						// this is not the right handler for the payload
						return false;
					}
				} else {
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

const addParams = <THandler extends string>(handler: THandler) => ({
	/**
	 * Define the _scalar_ parameters this handler expects.
	 *
	 * ```ts
	 * const Example = createHandler("Example")
	 * 		.scalar({
	 * 			"Foo as string",
	 * 			"Bar as opt(number)"
	 * 		});
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
				<
					TEvent extends Handler<
						THandler,
						ScalarParams<S>,
						OptionParams<O>
					>,
				>(
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
});

/**
 * a _higher order_ function used to created a fully formed
 * `km` handler.
 */
export const createHandler = <T extends string>(handler: T) =>
	addParams(toPascalCase(handler) as PascalCase<T>);
