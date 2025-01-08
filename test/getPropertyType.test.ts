import { } from "@type-challenges/utils";
import { isMetric } from "inferred-types";
import { describe, expect, it } from "vitest";
import { getPropertyType } from "../src/api/getPropertyType";


// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe.skip("getPropertyType(val)", () => {

  it("SVG", () => {
	const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#888888" d="M13.26 10.5h2v1h-2z"/><path fill="#888888" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M8.4 15L8 13.77H6.06L5.62 15H4l2.2-6h1.62L10 15Zm8.36-3.5a1.47 1.47 0 0 1-1.5 1.5h-2v2h-1.5V9h3.5a1.47 1.47 0 0 1 1.5 1.5ZM20 15h-1.5V9H20Z"/><path fill="#888888" d="M6.43 12.77h1.16l-.58-1.59z"/></svg>';
	const svg2 = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 256 256\"><path fill=\"#888888\" d=\"M88 112a8 8 0 0 1 8-8h80a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h80a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m136-88v120a24 24 0 0 1-24 24H32a24 24 0 0 1-24-23.89V88a8 8 0 0 1 16 0v96a8 8 0 0 0 16 0V64a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16m-16 0H56v120a23.84 23.84 0 0 1-1.37 8H208a8 8 0 0 0 8-8Z\"/></svg>" as string;
	const lst = [svg,svg2];
	const mixed = [svg,svg2, "foo"];

	expect(getPropertyType(svg)).toBe("svg::inline");
	expect(getPropertyType(svg2)).toBe("svg::inline");
	expect(getPropertyType(lst)).toBe("list::svg::inline");
	expect(getPropertyType(mixed)).toBe("list::mixed::svg::inline,string");
	
  });


  
  it("Metric", () => {
	const m1 = "100mph" as string;
	const m2 = "7km";
	const m3 = "7 km";

	const f1 = "100";
	const f2 = 100;
	const f3 = "100uuu"

	expect(isMetric(m1)).toBe(true);
	expect(isMetric(m2)).toBe(true);
	expect(isMetric(m3)).toBe(true);

	expect(isMetric(f1)).toBe(false);
	expect(isMetric(f2)).toBe(false);
	expect(isMetric(f3)).toBe(false);
  });
  
  
  it("Repos", () => {
	const gh = "https://github.com/org/repo" as string;
	const r1 = gh;
	const r2 = "https://bitbucket.org/";

	expect(getPropertyType(r1)).toBe("url::repo");
	expect(getPropertyType(r2)).toBe("url::repo");
  });

  it("Social", () => {
	const s1 = "https://www.facebook.com/"
	const s2 = "https://www.instagram.com/"

	expect(getPropertyType(s1)).toBe("url::social");
	expect(getPropertyType(s2)).toBe("url::social");
  })

  it("Retail", () => {
	const costCo = "https://www.costco.com";
	const apple = "https://store.apple.com";

	expect(getPropertyType(costCo)).toBe("url::retail");
	expect(getPropertyType(apple)).toBe("url::retail");
  });

  it("YouTube", () => {
	const yt1 = `https://youtu.be/PJp_6T45X6o?si=HXZYphoAHAmg9cHL`

	expect(getPropertyType(yt1)).toBe("url::youtube");
  })
  
});
