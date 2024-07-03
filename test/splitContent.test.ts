import { describe, expect, it } from "vitest";
import { splitContent } from "../src/utils/splitContent";

describe("splitContent(content)", () => {

  it("no yaml", () => {
	const result= splitContent("# There I was, There I was\n\nIn the jungle");

	expect(result.yaml).toBe(undefined);
	expect(result.body).toBe("# There I was, There I was\n\nIn the jungle")
  });

  it("with yaml", () => {
	const result= splitContent(`---\nfoo: "bar"\n---\n# There I was, There I was\n\nIn the jungle`);

	expect(result.body).toBe("# There I was, There I was\n\nIn the jungle")
	expect(result.yaml).toBe(`---\nfoo: "bar"\n---\n`);
  });

  
  it("with H1 and without", () => {
	const h1 = `---\nfoo: "bar"\n---\n# There I was, There I was\n\nIn the jungle`;
	const h2 = `---\nfoo: "bar"\n---\n## There I was, There I was\n\nIn the jungle`;
	const withH1= splitContent(h1);
	const withoutH1= splitContent(h2);

	expect(h1.includes("\n# ")).toBe(true);
	expect(h2.includes("\n# ")).toBe(false);

	expect(withoutH1.h1).toBe(undefined);
	expect(withH1.h1).toBe("There I was, There I was");
  });
  
  

});
