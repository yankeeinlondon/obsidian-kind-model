import type {
	AnyObject,
	Contains,
	Scalar,
	Tuple,
	TypedFunction,
} from "inferred-types";
import type KindModelPlugin from "~/main";
import type { DataArray, PageInfo, PageInfoBlock, PageReference, ShowApi } from "~/types";
import {
	isDefined,
	keysOf,
} from "inferred-types";
import { showApi } from "~/api";
import { getPageInfo } from "~/page";

const NO_PLUGIN = ["showCreatedDate", "showModifiedDate"] as const;
const NO_PAGE = ["createLinksFromTag"] as const;

type Partial<
	T extends TypedFunction,
> = Parameters<T> extends [any, ...(infer REST)]
	? (...args: REST) => ReturnType<T>
	: never;

/**
 * Provides an API based off of the `ShowApi` but where the plugin
 * and the **page** for the given record have already been provided
 * to the API.
 */
export type QueryRecord = {
	[K in keyof ShowApi]: ReturnType<ShowApi[K]> extends TypedFunction
	? Contains<typeof NO_PAGE, K> extends true
	? ReturnType<ShowApi[K]>
	: Partial<ReturnType<ShowApi[K]>>
	: Contains<typeof NO_PAGE, K> extends true
	? ShowApi[K]
	: Partial<ShowApi[K]>
} & {
	page: PageInfo;
};

export type TableCallback<T extends readonly string[]> = <A extends QueryRecord>(
	cb: A
) => string[];

export interface TableOpt<
	TCols extends readonly string[],
> {
	/**
	 * specify columns which should be removed from table if all records are empty
	 */
	hideColumnIfEmpty?: readonly (TCols[number])[] | ["all"];
	/**
	 * specify a render value for a _column_ (or set of columns) to display
	 * when a given row/page doesn't have a value for this column.
	 */
	valueIfEmpty?: <THideEmpty extends readonly (TCols[number])[] | ["all"]>(
		...hide: THideEmpty
	) => TCols[] | ["all"];
	/**
	 * **createTable** provides a default render for situations where
	 * there is are no rows in the queries resultset but you can provide
	 * an override which can be a string or any other value (it will be
	 * rendered with **Dataview**'s `renderValue()`).
	 */
	renderWhenNoRecords?: () => Scalar | AnyObject | Tuple;

	/**
	 * You can specify the name of the handler to get some better defaults
	 * but it's not required.
	 */
	handler?: string;

	/**
	 * You may optionally pass in the parameters for handler function
	 */
	handlerParams?: string;

	/**
	 * the generic term "record" will be used in expressions where
	 * no data is found but that can be modified to a more explicit
	 * description of what was being quried for.
	 */
	predicate?: string;
}

/**
 * **createTable**`(plugin, page)` -> `(...startingCols)` -> `(handler)` -> `(data, opt)` -> void
 *
 * Helper for `km` handlers which builds a table and renders it using
 * `Dataview`'s table renderer.
 *
 * - Step one is to _initialize_ with `KindModelPlugin` and `PageInfoBlock`
 * - Step two is to provide the "default columns" you will define with the
 * callback handler
 * - Step three is to provide a callback function which will map a column
 * to it's render value; the callback function is given a `PageInfo` for
 * the given record.
 * - Step four -- the final step -- is to pass it a `DataArray` of results
 * to render, at this point you can also express a set of options into an
 * options hash to handle certain conditions.
 */
export function createTable<
	P extends KindModelPlugin,
	TBaseOpt extends TableOpt<any> | undefined,
>(
	plugin: P,
	pg: PageInfoBlock,
	baseOpt?: TBaseOpt,
) {
	const partial = showApi(plugin);
	const { render } = pg;
	const api = <P extends PageInfo>(page: P) => keysOf(partial).reduce(
		(acc, key) => NO_PLUGIN.includes(key as any)
			? ({
				...acc,
				[key]: (...args: any[]) => {
					return NO_PAGE.includes(key as any)
						? (partial[key] as Function)(...args)
						: (partial[key] as Function)(page, ...args);
				},
			})
			: ({
				...acc,
				[key]: (...args: any[]) => {
					return NO_PAGE.includes(key as any)
						? (partial[key] as Function)(...args)
						: (partial[key] as Function)(page, ...args);
				},
			}),
		{ page },
	) as unknown as QueryRecord;

	return <
		TCols extends readonly string[],
	>(
		...cols: TCols
	) => <
		TCb extends TableCallback<TCols>,
	>(
		cb: TCb,
		optCallback?: TableOpt<TCols> | undefined,
	) => {
			const opt = {
				...(baseOpt || {}),
				...(optCallback || {}),
			};

			return async <T extends DataArray<any>>(
				records: T,
			) => {
				const recArr = Array.from(records) as PageReference[];
				if (recArr.length === 0) {
					plugin.debug(`empty table`);
					if (opt?.renderWhenNoRecords) {
						render.renderValue(opt.renderWhenNoRecords());
						return true;
					}
					else {
						const predicate = opt.predicate || "records";
						render.renderValue(
							opt?.handler
								? isDefined(opt?.handlerParams)
									? `- the <b>${opt.handler}(${opt.handlerParams})</b> handler found no ${predicate}.`
									: `- the <b>${opt.handler}</b> handler found no ${predicate}.`
								: `- no ${predicate} found.`,
						);
						return true;
					}
				}
				plugin.debug(`pre-rendering table`, recArr);

				const results = recArr.map((rec) => {
					const page = getPageInfo(plugin)(rec) as PageInfo;
					const surface = api(page);

					return cb(surface);
				});
				plugin.debug(`rendering table`, cols, results);

				await render.table(
					[...cols],
					results,
				);
				return true;
			}; // done
		};
}
