
import { describe, expect, it } from "vitest";

import tree from "test/data/markdoc-tree.json";
import page from "test/data/dv-page.json";
import {traverse, find_links} from "../src/helpers/pageContent"
import { ExternalLink } from "../src/types/general";
import { isDvPage } from "../src/type-guards";


// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("traverse() utility", () => {

  it("extract links from Markdoc's renderable tree", () => {
	if (isDvPage(page)) {
		let links: ExternalLink[] = []
		const cb = find_links(links, [], page);

		traverse(tree, cb)

		expect(links.length).toBe(1);

		
		// type cases = [
		//   /** type tests */
		// ];
		// const cases: cases = [];
	} else {
		throw new Error("dv-page test data not a valid DvPage!!!");
	}
  });

});
