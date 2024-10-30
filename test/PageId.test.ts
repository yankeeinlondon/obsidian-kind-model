import { Expect, Equal } from "@type-challenges/utils";
import { describe, it } from "vitest";
import { PageId } from "../src/types/PageId";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("PageId<T>", () => {

  it("happy path", () => {
	type P = PageId<["path"]>;
	type T = PageId<["tag"]>;
	type PT = PageId<["path","tag"]>;
	type E = PageId<[]>;

	type EPath = E["path"];
	type ETag = E["tag"];

	
	// @ts-ignore
	type cases = [
		Expect<Equal<P["path"], string>>,
		Expect<Equal<P["tag"], string | undefined>>,
		
		Expect<Equal<T["tag"], string>>,
		Expect<Equal<T["path"], string | undefined>>,

		Expect<Equal<PT["path"], string>>,
		Expect<Equal<PT["tag"], string>>,

		Expect<Equal<EPath, string | undefined>>,
		Expect<Equal<ETag, string | undefined>>,
	];
  });

});
