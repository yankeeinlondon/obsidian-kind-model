import { } from "@type-challenges/utils";
import { describe, expect, it } from "vitest";
import KindModelPlugin from "../src/main";
import { decomposeTag } from "../src/api/buildingBlocks";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe.skip("decomposeTag(p)(tag)", () => {
	const plugin = new KindModelPlugin({} as any, {} as any)

  it("happy path", () => {
	const foobar = decomposeTag(plugin)("#kind/foobar");

	expect(foobar.type).toEqual("kind");
	
	// @ts-ignore
	type cases = [
	  /** type tests */
	];
  });

});
