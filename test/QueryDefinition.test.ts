import { Equal, Expect } from "@type-challenges/utils";
import { describe, it } from "vitest";
import { OptionParams, FromScalarDefn, ScalarParams } from "../src/types";
import { createHandler } from "../src/handlers"
import { KindTable } from "../src/handlers/Kind";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("Handler Types", () => {

  it("FromScalarDefn", () => {
	type FooStr = FromScalarDefn<"Foo AS string">;
	type FooNum = FromScalarDefn<"Foo AS number">;
	type FooOpt = FromScalarDefn<"Foo AS opt(bool)">;
	type FooEnum = FromScalarDefn<"Foo AS enum(foo,bar,baz)">;
	type FooEnum2 = FromScalarDefn<"Foo AS enum(foo, bar, baz)">;
	type FooCol = FromScalarDefn<"Foo AS column(foo)">;
	type FooCols = FromScalarDefn<"Foo AS columns(foo,bar)">;

	
	// @ts-ignore
	type cases = [
		Expect<Equal<FooStr, { Foo: string }>>,
		Expect<Equal<FooNum, { Foo: number }>>,
		Expect<Equal<FooOpt, { Foo: boolean | undefined }>>,
		Expect<Equal<FooEnum, { Foo: "foo" | "bar" | "baz" }>>,
		Expect<Equal<FooEnum2, { Foo: "foo" | "bar" | "baz" }>>,
		Expect<Equal<FooCol, { Foo: ["column", "foo"] }>>,
		Expect<Equal<FooCols, { Foo: ["columns", ["foo", "bar"] ] }>>,
	];
  });


  
  it("ScalarParams<T>", () => {
	type Foo = "Foo AS string";
	type Bar = "Bar AS number";

	type S = ScalarParams<[Foo,Bar]>;
	
	// @ts-ignore
	type cases = [
	  Expect<Equal<S, { Foo: string; Bar: number }>>
	];
	
  });

  
  it("FromHandlerOptions<O>", () => {
	type T1 = OptionParams<{foo: "bool"; bar: "opt(string)"}>;
	
	// @ts-ignore
	type cases = [
	  Expect<Equal<T1, { foo: boolean; bar: string | undefined }>>
	];
	
  });

});

describe("Handler Runtime", () => {

  it("Global Handler", () => {
	const Kind = createHandler("Kind")({
		scalar: [
			"kind AS string",
			"category AS opt(string)",
			"subcategory AS opt(string)",
		],
		options: {
			remove_columns: "enum(when,desc,links)",
			add_columns: "columns()"
		}
	});
  });
  

});

