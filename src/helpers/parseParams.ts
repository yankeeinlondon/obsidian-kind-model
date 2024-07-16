/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { 
	AfterFirst,
	As,
	Dictionary, 
	EmptyObject, 
	handleDoneFn,
	HandleDoneFn,
	ExpandRecursively, 
	First, 
	If, 
	isArray, 
	IsDefined, 
	isNumber, 
	isObject,  
	isString,  
	IsUndefined,  
	Keys,  
	last,  
	Narrowable,  
	Split, 
	stripBefore, 
	TupleToUnion, 
	isUndefined,
	isScalar
} from "inferred-types";
import { isError } from "../utils/type_guards/isError";

/**
 * Defines the parameters available to the options hash of a particular
 * `km` query.
 */
export type OptionsDefinition<
	TStr extends readonly string[] = readonly string[],
	TNum extends readonly string[] = readonly string[],
	TStrArr extends readonly string[] = readonly string[],
	TBool extends readonly string[]= readonly string[],
	TEnum extends Record<string, readonly Narrowable[]> = Record<string, readonly Narrowable[]>,
> = {
	/** properties in the options structure which expect **string** values */
	strings: TStr;
	/** properties in the options structure which expect an **array of strings** as a value */
	stringArrays: TStrArr;
	/** properties in the options structure which expect **numeric** values */
	numerics: TNum;
	/** properties in the options structure which a **boolean** values */
	boolean: TBool;
	/** 
	 * a dictionary where _keys_ are the properties being assigned and 
	 * their _values_ are an tuple of literals
	 */
	enums: TEnum;
}

/**
 * an `OptionsDefinition` with nothing defined.
 */
export type EmptyOptionsDefinition = OptionsDefinition<[],[],[],[],EmptyObject>;

/**
 * **OptionsApi**
 * 
 * An API surface to define a queries Option Hash structure.
 */
export type OptionsApi<
	TStr extends readonly string[] = [],
	TNum extends readonly string[] = [],
	TStrArr extends readonly string[] = [],
	TBool extends readonly string[] = [],
	TEnum extends Record<string, readonly Narrowable[]> = EmptyObject,
> = {
	/** properties in the options structure which expect **string** values */
	strings: <T extends readonly string[]>(...s: T) => OptionsApi<T, TNum, TStrArr,TBool, TEnum>;
	/** properties in the options structure which expect an **array of strings** as a value */
	stringArrays: <T extends readonly string[]>(...sa: T) => OptionsApi<TStr, TNum, T, TBool, TEnum>;
	/** properties in the options structure which expect **numeric** values */
	numerics: <T extends readonly string[]>(...n: T) => OptionsApi<TStr, T, TStrArr, TBool, TEnum>;
	/** properties in the options structure which a **boolean** values */
	boolean: <T extends readonly string[]>(...b: T) => OptionsApi<TStr, TNum, TStrArr, T, TEnum>;
	/** 
	 * a dictionary where _keys_ are the properties being assigned and 
	 * their _values_ are an tuple of literals
	 */
	enums: <
		P extends string,
		V extends readonly Narrowable[]
	>(p: P, ...values: V) => OptionsApi<
		TStr, TNum, TStrArr, TBool, 
		// ExpandDictionary<TEnum & Record<P, V>> 
		Omit<TEnum, P> & Record<P,V>
	>;

	done: () => ({
		strings: TStr,
		stringArrays: TStrArr,
		numerics: TNum,
		boolean: TBool,
		enums: TEnum
	});
}

export type OptionsApiCallback = <
	T extends OptionsApi<
		readonly string[],
		readonly string[],
		readonly string[],
		readonly string[],
		Record<string, readonly Narrowable[]>
	>
>(cb: T) => unknown;


/**
 * implementation of the OptionsApi
 */
const options = <
	TStr extends readonly string[],
	TNum extends readonly string[],
	TStrArr extends readonly string[],
	TBool extends readonly string[],
	TEnum extends Record<string, readonly Narrowable[]>,
>(state: OptionsDefinition<TStr,TNum,TStrArr,TBool,TEnum>): OptionsApi<
	TStr, TNum, TStrArr, TBool, TEnum
> => ({
	done: () => state,
	strings: (...p) => options({...state, strings: p}),
	stringArrays: (...p) => options({...state, stringArrays: p}),
	numerics: (...p) => options({...state, numerics: p}),
	boolean: (...p) => options({...state, boolean: p}),
	enums: <
		P extends string,
		V extends readonly Narrowable[]
	>(p: P, ...e: V) => options({
		...state,
		enums: {
			...state.enums,
			[p]: e
		} as Omit<TEnum,P> & Record<P,V>
	})
})

export type InvalidParameters<
	S extends readonly ScalarParam[],
	O extends OptionsDefinition
> = {
	isOk: false;
	msg: string;
	kind: "too-many-parameters" 
	| "invalid-scalars" 
	| "wrong-type-for-options" 
	| "unknown-key-used"
	| "unable-to-parse"
	| "invalid-option-param";
	user_params: string;
	scalarDefn: S;
	optionsDefn: O;
}

export type KmScalarParams<
	S extends readonly ScalarParam[]
> = {
	[K in keyof S]: S[K] extends "string"
		? string 
		: S[K] extends "number"
		? number
		: S[K] extends "boolean"
		? boolean
		: S[K] extends `enum::${infer Values extends string}`
		? TupleToUnion<Split<Values, `,${" " | ""}`>>
		: never;
}

/** properties on options hash which have string type values */
type StringParams<
	T extends readonly string[],
	TResult extends Dictionary = EmptyObject
> = [] extends T 
? TResult
: StringParams<AfterFirst<T>, TResult & Record<First<T>, string>>;

/** properties on options hash which have numeric type values */
type NumericParams<
	T extends readonly string[],
	TResult extends Dictionary = EmptyObject
> = [] extends T 
? TResult
: StringParams<AfterFirst<T>, TResult & Record<First<T>, number>>;

/** properties on options hash which have boolean type values */
type BooleanParams<
	T extends readonly string[],
	TResult extends Dictionary = EmptyObject
> = [] extends T 
? TResult
: StringParams<AfterFirst<T>, TResult & Record<First<T>, boolean>>;

/** properties on options hash which have enum type values */
type EnumParams<
	TDefn extends Dictionary<string>,
	T extends readonly (string & keyof TDefn)[],
	TResult extends Dictionary = EmptyObject
> = [] extends T 
? TResult
: EnumParams<TDefn, AfterFirst<T>, TResult & Record<First<T>, T extends keyof TDefn ? TDefn[T] : never> >;

/**
 * The options hash for a `km` based query.
 */
export type KmOptionsHash<
	O extends OptionsDefinition
> = Partial<ExpandRecursively<
	If<
		IsDefined<O["strings"]>, 
		StringParams<As<O["strings"], string[]>>, 
		EmptyObject
	> & 
	If<
		IsDefined<O["numerics"]>, 
		NumericParams<As<O["numerics"], string[]>>, 
		EmptyObject
	> & 
	If<
		IsDefined<O["boolean"]>, 
		BooleanParams<As<O["boolean"], string[]>>, 
		EmptyObject
	> & 
	If<
		IsDefined<O["enums"]>, 
		EnumParams<
			As<O["enums"], Dictionary<string>>, 
			As<Keys<As<O["enums"], Dictionary>>, readonly (string & keyof O["enums"])[]>
		>, 
		EmptyObject
	>
>>;

/**
 * The parameters type allowed for a given query 
 */
export type KmQueryParams<
	S extends readonly ScalarParam[],
	O extends OptionsDefinition
> = [
	...(
		KmScalarParams<S> extends readonly unknown[]
		? KmScalarParams<S>
		: []
	),
	KmOptionsHash<O>
];

export type ValidParameters<
	S extends readonly ScalarParam[],
	O extends OptionsDefinition
> = {
	isOk: true;
	msg: string;
	kind: "no-parameters" | "valid-parameters";
	user_params?: string;
	params: KmQueryParams<S,O>;
	scalarDefn: S,
	optionsDefn: O,
}

export type ParameterResult<
	S extends readonly ScalarParam[],
	O extends OptionsDefinition | EmptyOptionsDefinition
> = InvalidParameters<S,O> | ValidParameters<S,O>;


export type ScalarParam = 
| `string AS ${string}`
| `opt(string) AS ${string}`
| `number AS ${string}`
| `opt(number) AS ${string}`
| `boolean AS ${string}`
| `enum::${string} AS ${string}`;

type NonEnumTokenValue = "string" | "opt(string)" | "number" | "opt(number)" | "boolean" | "opt(boolean)";

export type ScalarDefn = [token: NonEnumTokenValue, name: string] | 
[token: "enum", name: string, values: string[]];

/**
 * separates a scalar param's name and token value
 */
type GetScalarDefn<T extends ScalarParam> = T extends `enum::${infer Name extends string} AS ${infer Values extends string}`
? [Values, Name]
: T extends `${string} AS ${string}`
? Split<T, " AS ">
: never; 

const getScalarDefn = <T extends ScalarParam>(param: T) => {
	if (param.startsWith("enum::")) {
		let key_value = stripBefore(param, "enum::");
		let [token, name] = key_value.split(" AS ");
		return ["enum", name, token.split(/,\s{0,1}/)] as ScalarDefn;
	} else {
		return param.split(" AS ") as ScalarDefn;
	}
}

const validate_scalar = <
	TResult,
	TDefn extends ScalarParam
>(result: TResult, param: TDefn): boolean => {
	const [defn, _name, _values] = getScalarDefn(param);
	switch(defn) {
		case "boolean":
			return isBoolean(result);
		case "number":
			return isNumber(result);
		case "string":
			return isString(result);
		case "opt(boolean)": 
			return isBoolean(result) || isUndefined(result);
		case "opt(number)":
			return isNumber(result) || isUndefined(result);
		case "opt(string)":
			return isString(result) || isUndefined(result);
		default: 
			if (defn.startsWith("enum")) {
				const values = stripBefore(defn, "enum::").split(/,\s{0,1}/);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return values.includes(result as any)
			} else {
				return false
			}
	}
}

const option_prop_type = <
	T extends OptionsDefinition
>(key: string, defn: T) => {
	if (defn.strings?.includes(key)) {
		return "string";
	} else if (defn.boolean?.includes(key)) {
		return "boolean";
	} else if (defn.numerics?.includes(key)) {
		return "number";
	} else if (defn.stringArrays?.includes(key)) {
		return "string[]";
	} else if (Object.keys(defn.enums || {}).includes(key)) {
		return "enum";
	} else {
		return "unknown";
	}
}

/**
 * validates that the user options passed in are 
 * all valid _types_ based on the definition provided.
 */
const validate_opts = <
	TUser extends Dictionary,
	TDefn extends OptionsDefinition
>(
	opts: TUser,
	defn: TDefn
): { valid: string[]; invalid: string[]; } => {
	let result: { valid: string[]; invalid: string[]; } = { valid: [], invalid: []};
	Object.keys(opts).forEach(k => {
		switch(option_prop_type(k, defn)) {
			case "boolean":
				if (isBoolean(opts[k])) {
					result.valid.push(k);
				} else {
					result.invalid.push(k);
				}
				break;
			case "number": 
				if (isNumber(opts[k])) {
					result.valid.push(k);
				} else {
					result.invalid.push(k);
				}
				break;
			case "string":
				if (isString(opts[k])) {
					result.valid.push(k);
				} else {
					result.invalid.push(k);
				}
				break;
			case "string[]":
				if (isArray(opts[k])) {
					result.valid.push(k);
				} else {
					result.invalid.push(k);
				}
				break;
			case "enum":
				const enum_values = (
					Array.isArray((defn?.enums || {})[k]) 
					? (defn?.enums || {})[k]
					: []
				) as unknown[];
				if (enum_values.includes(opts[k])) {
					result.valid.push(k);
				} else {
					result.invalid.push(k);
				}
				break;
		}
	});
	return result;
}

export type ScalarParamProblem = {index: number; value: unknown; expected_type: string};

export type ParamValidator<
	S extends readonly ScalarParam[],
	O extends OptionsDefinition	
> = (match: RegExpMatchArray | null) => ParameterResult<S,O>;

export const isOkUserParam = (val: unknown): val is ValidParameters<ScalarParam[],OptionsDefinition> => {
	return isObject(val) && "isOk" in val && (val).isOk === true ? true : false;
}

/**
 * Gets the `OptionsDefinition` from the user's callback
 */
type AsOptionsDefn<
OC extends (<T extends OptionsApi>(cb: T) => unknown) | undefined
> = IsUndefined<OC> extends true
	? EmptyOptionsDefinition
	: HandleDoneFn<ReturnType<As<
		OC, 
		(<T extends OptionsApi>(cb: T) => unknown)>
	>>;


/**
 * **parseParams**`(scalar, opts)`
 * 
 * Utility to help parse `km` queries; features:
 * 
 * - makes sure JSON parsing of string has no errors
 * - we will put square brackets around the string input to ensure
 * that params are always an array of things
 * - params will be of the form:
 * 	 	- `[ ...scalar[], options ]`
 * - scalars
 * 		- you can have 0..M scalar types defined with the `scalar`
 * 		- if you choose an `enum::` type for scalar, `::` is delimiter 
 * - options:
 * 		- options 
 */
export const parseParams = <
	S extends readonly ScalarParam[],
>(
	...scalar: S
) => <OC extends (<T extends OptionsApi>(cb: T) => unknown) | undefined>(
	optCallback?: OC
) => {
	const empty: EmptyOptionsDefinition = { 
		strings: [],
		numerics: [],
		boolean: [],
		stringArrays: [],
		enums: {} as EmptyObject
	};

	/** the number of required scalar params */
	let requiredScalar: number = scalar.reduce(
		(count, current) => current.includes("opt(") ? count : count + 1, 0
	);
	/** the number of optional scalar params  */
	let optScalar: number = scalar.reduce(
		(count, current) => current.includes("opt(") ? count+1 : count, 0
	);

	const state = options(empty);

	const optDefn = (
		optCallback
		? handleDoneFn(optCallback(state))
		: empty
	) as unknown as AsOptionsDefn<OC>

	return (match: RegExpMatchArray | null): ParameterResult<
		S,
		AsOptionsDefn<OC>
	> => {
		if (!match) {
			return {
				isOk: true,
				msg: "No parameters passed",
				kind: "no-parameters",
				user_params: undefined,
				params: [],
				optionsDefn: optDefn,
				scalarDefn: scalar,
			} as unknown as ValidParameters<
				S,
				AsOptionsDefn<OC>
			>
		}
		// user DID pass something as param
		const [_, user_params ] = Array.from(match || []);


		/**
		 * The keys known to exist as possible options
		 * parameters
		 */
		let known_opt_keys = [
			...(optDefn?.strings || []),
			...(optDefn?.stringArrays || []),
			...(optDefn?.numerics || []),
			...(optDefn?.boolean || []),
			...Object.keys(optDefn?.enums || {})
		];
		

		try {
			let parsedParams = JSON.parse(
				`[ ${JSON.stringify(user_params)} ]`
			) as readonly unknown[];

			/**
			 * Object entities found in the parameters
			 */
			const objects = parsedParams.map(i => isObject(i));
			/**
			 * the index position of the first object found in params
			 */
			const objIndex = parsedParams.findIndex(i => isObject(i));
			
			/**
			 * the scalars found in params (prior to an object)
			 */
			const scalars = parsedParams.map((i,idx) => 
				isScalar(i) || (objIndex !== -1 && idx>objIndex)
					? i 
					: undefined
				).filter(i => i);

			if (parsedParams.length === scalar.length || parsedParams.length === scalar.length + 1) {
				// number or parameters seems correct
				let invalid_scalars: ScalarParamProblem[] = [];
				for (const [i] of Array(scalar.length).entries()) {
					if (! validate_scalar(parsedParams[i], scalar[i])) {
						invalid_scalars.push({ 
							index: i, 
							value: parsedParams[i],
							expected_type: scalar[i]
						})
					}
				}
				if (invalid_scalars.length > 0) {
					return {
						isOk: false,
						kind: "invalid-scalars",
						msg: `${invalid_scalars.length} of the expected ${scalar.length} scalar parameters were of the wrong type`,
						user_params: user_params,
						optionsDefn: optDefn,
						scalarDefn: scalar,
					} as InvalidParameters<
						S,
						AsOptionsDefn<OC>
					>
				}

				if (parsedParams.length === scalar.length +1 ) {
					// we expect an options hash as last param
					let optParam = last(parsedParams);
					if (optParam && !isObject(optParam)) {
						return {
							isOk: false,
							kind: "wrong-type-for-options",
							msg: `The parameter passed into the position of the options dictionary was of the wrong type [${typeof last(parsedParams)}]`,
							user_params: user_params,
							optionsDefn: optDefn,
							scalarDefn: scalar,
						} as InvalidParameters<
							S,
							AsOptionsDefn<OC>
						>
					}
					/** parameters found that don't exist in opt defn */
					const unknown = Object.keys(optParam as Dictionary).filter(k => !known_opt_keys.includes(k));

					if (unknown.length > 0) {
						return {
							isOk: false,
							kind: "unknown-key-used",
							msg: `the keys ${unknown.join(", ")} are not not known options for this query!`,
							user_params,
							optionsDefn: optDefn,
							scalarDefn: scalar,
						} as InvalidParameters<
							S,
							AsOptionsDefn<OC>
						>
					}

					// we have gotten to the point we known scalar params are good
					// and that a options hash has been provided and that that
					// options hash does not have any extraneous parameters in
					// it.
					const results = validate_opts(optParam as Dictionary, optDefn);
					if (results.invalid.length === 0) {
						return {
							isOk: true,
							user_params,
							params: parsedParams,
							optionsDefn: optDefn,
							scalarDefn: scalar,
						} as unknown as ValidParameters<
							S,
							AsOptionsDefn<OC>
						>
					} else {
						return {
							isOk: false,
							kind: "invalid-option-param",
							user_params,
							optionsDefn: optDefn,
							scalarDefn: scalar,
							msg: `${results.invalid.length} parameters of the options hash provided -- ${results.invalid.join(", ")} -- were of the wrong type.`
						} as InvalidParameters<
							S,
							AsOptionsDefn<OC>
						>
					}

				} else  {
					// no options hash but some scalar params
					return {
						isOk: true,
						user_params,
						params: [...parsedParams, {}],
						optionsDefn: optDefn,
						scalarDefn: scalar,
					} as unknown as ValidParameters<
						S,
						AsOptionsDefn<OC>
					>
				}

			} else if (parsedParams.length > scalar.length + 1) {
				return {
					isOk: false,
					kind: "too-many-parameters",
					msg: `Wrong number parameters passed in: ${parsedParams.length}`,
					user_params,
					optionsDefn: optDefn,
					scalarDefn: scalar,
				} as InvalidParameters<
					S,
					AsOptionsDefn<OC>
				>
			} else {

			}


		} catch (e) {
			return {
				isOk: false,
				msg: isError(e) ? e.msg : String(e),
				user_params,
				kind: "unable-to-parse",
				optionsDefn: optDefn,
				scalarDefn: scalar,
			} as InvalidParameters<
				S,
				AsOptionsDefn<OC>
			>
		}
	}
}
