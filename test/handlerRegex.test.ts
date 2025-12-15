import { describe, expect, it } from "vitest";

/**
 * Test the handler regex pattern used in createHandler.ts
 * The regex must properly match literal parentheses in handler calls.
 */
describe("Handler regex pattern", () => {
  // This is the pattern from createHandler.ts - uses [\s\S]* to match across newlines
  const createHandlerRegex = (handler: string) => new RegExp(`${handler}\\(([\\s\\S]*)\\)`);

  describe("BackLinks handler", () => {
    const re = createHandlerRegex("BackLinks");

    it("should match BackLinks() with no arguments", () => {
      const source = "BackLinks()";
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe("");
    });

    it("should match BackLinks with simple string argument", () => {
      const source = 'BackLinks("test")';
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe('"test"');
    });

    it("should match BackLinks with object argument", () => {
      const source = "BackLinks({dedupe: false})";
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe("{dedupe: false}");
    });

    it("should match BackLinks with multiple options", () => {
      const source = "BackLinks({dedupe: false, excludeCompletedTasks: true})";
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe("{dedupe: false, excludeCompletedTasks: true}");
    });

    it("should NOT match without parentheses", () => {
      const source = "BackLinks";
      expect(re.test(source)).toBe(false);
    });

    it("should NOT match different handler names", () => {
      const source = "OtherHandler()";
      expect(re.test(source)).toBe(false);
    });

    it("should match multiline content", () => {
      const source = `BackLinks({dedupe: false
})`;
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe(`{dedupe: false
}`);
    });

    it("should match options spread across multiple lines", () => {
      const source = `BackLinks({
  dedupe: false,
  excludeCompletedTasks: true
})`;
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toContain("dedupe: false");
      expect(match?.[1]).toContain("excludeCompletedTasks: true");
    });
  });

  describe("Kind handler", () => {
    const re = createHandlerRegex("Kind");

    it("should match Kind with string arguments", () => {
      const source = 'Kind("software", "development")';
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe('"software", "development"');
    });

    it("should match Kind with mixed arguments", () => {
      const source = 'Kind("software", {limit: 10})';
      expect(re.test(source)).toBe(true);
      const match = source.match(re);
      expect(match?.[1]).toBe('"software", {limit: 10}');
    });
  });

  describe("Incorrect regex patterns (for comparison)", () => {
    it("demonstrates bug with wrong escaping (nested groups)", () => {
      // This WRONG pattern has nested capture groups instead of literal parens
      // eslint-disable-next-line no-useless-escape
      const wrongRe = new RegExp(`BackLinks\((.*)\)`);
      const source = "BackLinks({dedupe: false})";
      const match = source.match(wrongRe);
      // Group 1 includes the opening paren from the source!
      expect(match?.[1]).toBe("({dedupe: false})");
    });

    it("demonstrates bug with .* not matching newlines", () => {
      // This pattern uses .* which doesn't match newlines
      const wrongRe = new RegExp(`BackLinks\\((.*)\\)`);
      const source = `BackLinks({dedupe: false
})`;
      // Should NOT match because .* stops at newline
      expect(wrongRe.test(source)).toBe(false);
    });

    it("shows correct behavior with [\\s\\S]* for multiline", () => {
      const correctRe = createHandlerRegex("BackLinks");
      const source = `BackLinks({dedupe: false
})`;
      // Should match because [\s\S]* matches newlines
      expect(correctRe.test(source)).toBe(true);
      const match = source.match(correctRe);
      expect(match?.[1]).toContain("dedupe: false");
    });
  });
});
