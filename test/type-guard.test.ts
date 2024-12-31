import { } from "@type-challenges/utils";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { isDvPage } from "../src/type-guards";
import { getPageInfo } from "../src/page/getPageInfo";
import KindModelPlugin from "../src/main";
import { createInstance } from "./data/plugin";

let dvPageData: string;
let plugin: KindModelPlugin;

describe("Type Guard Tests", () => {
	beforeAll(() => {
		dvPageData = readFileSync("./test/data/dv-page.json", "utf-8");
		plugin = createInstance()
	})


	it("isDvPage() - positive test", () => {
		const dv = JSON.parse(dvPageData);
		const test = isDvPage(dv);

		expect(test).toBe(true);
	});

	
	it("isDvPage() - negative test", () => {
		const info = getPageInfo(plugin)(JSON.parse(dvPageData));
		const test1 = isDvPage(info);
	  
	  // @ts-ignore
	  type cases = [
		/** type tests */
	  ];
	  
	});
	

});
