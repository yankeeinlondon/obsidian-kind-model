
import { 
	AfterFirst, 
	As, 
	Contains,  
	Dictionary,  
	EmptyObject,  
	ExpandDictionary,  
	Filter, 
	First, 
	isObject, 
	isScalar, 
	Join, 
	Keys, 
	ObjectKey, 
	OptionalSpace, 
	Retain, 
	RetainAfter, 
	Scalar, 
	Split, 
	stripAfter, 
	StripAfter, 
	stripBefore, 
	TupleToUnion 
} from "inferred-types";
import { kind_defn } from "../handlers/kind_table";
import KindModelPlugin from "../main";
import { video_defn } from "../handlers/video_gallery";
import { page_entry_defn } from "../handlers/page_entry";

export type Column = `column()`;
export type Columns = `columns()`;

export type TypeToken = "string" 
| "opt(string)" 
| "number" 
| "opt(number)"
| "bool"
| "opt(bool)"
| Column
| Columns
| `enum(${string})`;

export type ScalarName = string;
export type ScalarDefn = `${ScalarName} AS ${TypeToken}`;

export type QueryCmd = "Kind" | "PageEntry" | "Videos" | "Book" | "BackLinks" | "Unknown Command";

export type QueryDefinition = {
	kind: "query-defn";
	type: QueryCmd;
	scalar: ScalarDefn[];
	options: Record<string, TypeToken>; 
}




export type ScalarRequired<T extends QueryDefinition> = Filter<
	T["scalar"],
	`${string}opt(${string}`
>;

export type ScalarOptional<T extends QueryDefinition> = Retain<
	T["scalar"],
	`${string}opt(${string}`
>;

type Name<T extends ScalarDefn> = StripAfter<T, " AS">;
type Opt<T extends string> = T extends `${string}opt(${infer I})`
? `${I} | undefined`
: never;

type Quote<T extends readonly string[]> = {
	[K in keyof T]: `"${T[K]}"`
};

type Enumerate<T extends string> = T extends `${string}enum(${infer Values extends string})`
? Join<As<Quote<Split<Values, `,${OptionalSpace}`>>, readonly string[]>, ", ">
: never;

type Type<T extends ScalarDefn> = Contains<T, "opt("> extends true
? Opt<RetainAfter<T, "AS ">>
: Contains<T, "enum("> extends true
? Enumerate<T>
: RetainAfter<T, "AS ">;

type _ScalarDescription<T extends ScalarDefn[]> = {
	[K in keyof T]: T[K] extends ScalarDefn
	? `${Name<T[K]>}: ${Type<T[K]>}`
	: never
}



type MaybeOpt<TDef extends string, TType> = Contains<TDef, "opt("> extends true
	? TType | undefined
	: TType;

type EnumUnion<T extends string> = T extends `${string}enum(${infer Values})${string}`
? TupleToUnion<Split<Values, `,${OptionalSpace}`>>
: never;

type _ScalarParams<T extends ScalarDefn[]> =  {
	[K in keyof T]: Contains<T[K], "string"> extends true
	? MaybeOpt<T[K], string>
	: Contains<T[K], "number"> extends true
	? MaybeOpt<T[K], number>
	: Contains<T[K], "bool"> extends true
	? MaybeOpt<T[K], boolean>
	: Contains<T[K], "enum("> extends true
	? MaybeOpt<T[K], EnumUnion<T[K]>>
	: never
}

/**
 * Determines the _types_ of the scalar parameters for a given `QueryDefinition`
 */
export type ScalarParams<T extends QueryDefinition> = _ScalarParams<T["scalar"]>;

type OptionType<T extends string> = Contains<T, "string"> extends true
? MaybeOpt<T, string>
: Contains<T, "number"> extends true
? MaybeOpt<T, number>
: Contains<T, "bool"> extends true
? MaybeOpt<T, boolean>
: Contains<T, "enum("> extends true
? MaybeOpt<T, EnumUnion<T>>
: never;

type _OptionParam<
	TKeys extends readonly (ObjectKey & keyof TObj)[],
	TObj extends Dictionary,
	TType extends Dictionary = EmptyObject
> = [] extends TKeys
? ExpandDictionary<TType>
: _OptionParam<
	AfterFirst<TKeys>, 
	TObj, 
	TType & Record<
		First<TKeys>, 
		OptionType<As<TObj[First<TKeys>], string>>
	>
>;


/**
 * **OptionParam**`<T>`
 * 
 * Provides the type for the options hash for a given `QueryDefinition`
 */
export type OptionParam<T extends QueryDefinition> = _OptionParam<
	As<Keys<T["options"]>, readonly (ObjectKey & keyof T["options"])[]>, 
	T["options"]
>;

export type QueryScalarCounts<T extends QueryDefinition> = {
	total: T["scalar"]["length"];
	required: ScalarRequired<T>["length"];
	optional: ScalarOptional<T>["length"];
}

const opt = <T extends ScalarDefn>(value: T) => {
	let opt_type: string = stripBefore(value, "opt(").slice(0,-1);

	return `${opt_type} | undefined`
}
const enumValues = <T extends ScalarDefn>(v: T) => {
	let values = stripBefore(v?.trim(), "enum(").slice(0,-1)
		.split(/,\s{0,1}/)
		.map(i => `"${i}"`);

	return values.join(" | ");
}

const opt_hash = <T extends QueryDefinition>(defn: T) => {
	const keys = Object.keys(defn.options) as string[];
	const kv = keys.reduce(
		(acc, key) => [
			...acc,
			defn.options[key as keyof T["options"]].includes("opt(")
				? `${key}?: ${opt(`X AS ${defn.options[key]}`)}`
				: defn.options[key as keyof T["options"]].includes("enum(")
				? `${key}?: ${enumValues(`X AS ${defn.options[key]}`)}`
				: `${key}?: ${stripBefore(`X AS ${defn.options[key]}`, "AS ")}`
		], []
	);

	return `{\n    ${kv.join(",\n    ")}\n  }`
}

const query_signature = <T extends QueryDefinition>(defn: T)=> {
	const scalars = defn["scalar"].map(i => {
		let name = stripAfter(i, " AS");
		let kv = i.includes("opt(")
			? `${name}?: ${opt(i)}`
			: i.includes("enum(")
			? `${name}: ${enumValues(i)}`
			: `${name}: ${stripBefore(i, "AS ")}`;

		return kv
	});
	const signature = `${defn.type}(\n  ${scalars.join(",\n  ")},\n  options?: ${opt_hash(defn)}\n) => void`

	return signature as string as QuerySignature<T>;
}

export const describe_query = <T extends QueryDefinition>(defn: T) => {
	return [
		"",
		"<br>",
		"",
		"```ts",
		query_signature(defn),
		"```",
		""
	].join("\n") as string as `
${QuerySignature<T>}

WHERE options is optional but offers the following props:
`
}

export const query_scalar_counts = <T extends QueryDefinition>(defn: T): QueryScalarCounts<T> => ({
	total: defn?.scalar?.length || 0,
	required: defn?.scalar?.filter(i => !i.contains("opt(")) || 0,
	optional: defn?.scalar?.filter(i => i.contains("opt(")) || 0,
}) as unknown as QueryScalarCounts<T>;

/**
 * **QUERY_DEFN_LOOKUP**
 * 
 * A lookup table who's keys represent `QueryCmd`'s and the values
 * are their `QueryDefinition`.
 */
export const QUERY_DEFN_LOOKUP = {
	Kind: kind_defn,
	Videos: video_defn,
	PageEntry: page_entry_defn
} as const;

type EvaluatedQueryParams<
	TScalar extends Scalar[],
	TOptions extends Dictionary
> = {
	isOk: true,
	scalar: TScalar;
	options: TOptions;
} | {
	isOk: false;
	error: Error;
	param_str: string;
}

/**
 * **evaluate_query_params**`(re, source)`
 * 
 * Isolates and evaluates the parameters inside the query.
 * Returns: 
 * ```ts
 * type Rtn = [
 * 		scalar: Scalar[], 
 * 		options: Record<string, unknown>  
 * ]
 * ```
 */
export const evaluate_query_params = <P extends KindModelPlugin>(p: P) => 
<
	TRe extends RegExp,
	TSource extends string,
	TDefn extends QueryDefinition
>(
	re: TRe, 
	source: TSource,
	defn: TDefn
): EvaluatedQueryParams<ScalarParams<TDefn>, OptionParam<TDefn>> => {
	let param_str: string = source.match(re) 
	? Array.from(source.match(re) as RegExpMatchArray)[1]?.trim() || ""
	: "";

	try {
		let params: unknown[] = param_str === ""
			? []
			: JSON.parse(`[ ${param_str} ]`);
		const response: EvaluatedQueryParams<ScalarParams<TDefn>, OptionParam<TDefn>> = {
			isOk: true,
			scalar: params.filter(i => isScalar(i)) as ScalarParams<TDefn>,
			options: (params.find(i => isObject(i)) || {} ) as OptionParam<TDefn>
		};

		p.debug({defn, response})
		const scalarCounts = query_scalar_counts(defn);

		if (response?.scalar?.length > scalarCounts.total) {
			return {
				isOk: false,
				error: new Error(`Too many scalar parameters passed into ${defn?.type || "XXX"}(); expected a maximum of ${defn?.scalar.length}, got ${response?.scalar.length}`),
				param_str
			}
		}
		if (scalarCounts.required> 0 && scalarCounts.required > response?.scalar.length) {
			return {
				isOk: false,
				error: new Error(`the ${defn.type}() query type requires at least ${defn.scalar?.length} scalar parameters but only ${response?.scalar?.length} were received!`),
				param_str
			}
		}

		const keys = Object.keys(response?.options || {});
		const known_keys = Object.keys(defn.options || {});
		const unknownKeys = keys.filter(i => !known_keys.includes(i));

		if(unknownKeys.length > 0) {
			return {
				isOk: false,
				error: new Error(`Properties were provided to the options hash which are not known key's of the options type: ${unknownKeys.join(', ')}! The valid keys for this options hash are: ${known_keys.join(", ")}`),
				param_str
			}
		}

		return response;
	} catch(e) {
		return {
			isOk: false,
			error: e as Error,
			param_str
		};
	}
}
