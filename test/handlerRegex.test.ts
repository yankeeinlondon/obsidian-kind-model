import { describe, expect, it } from "vitest";
import { escapeRegExp } from "../src/utils/html";

function handlerInvocationRegex(handler: string): RegExp {
  return new RegExp(`^\\s*${escapeRegExp(handler)}\\s*\\(([\\s\\S]*)\\)\\s*$`);
}

const HANDLER_NAME_RE = /[A-Z][a-zA-Z]*\(/g;
function countHandlerInvocations(source: string): number {
  const matches = source.match(HANDLER_NAME_RE);
  return matches ? matches.length : 0;
}

describe("Multi-invocation detection", () => {
  it("returns 0 for empty source", () => {
    expect(countHandlerInvocations("")).toBe(0);
  });

  it("returns 1 for single handler", () => {
    expect(countHandlerInvocations("Kind(\"software\")")).toBe(1);
  });

  it("detects multiple invocations", () => {
    expect(countHandlerInvocations("Kind(\"software\")\nKind(\"hardware\")")).toBe(2);
  });

  it("detects different handlers", () => {
    expect(countHandlerInvocations("Kind(\"software\")\nBackLinks()")).toBe(2);
  });

  it("does not count lowercase words", () => {
    expect(countHandlerInvocations("some text with lowercase()")).toBe(0);
  });
});

describe("Handler regex pattern", () => {
  const createHandlerRegex = handlerInvocationRegex;

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

  describe("Anchoring and escaping", () => {
    it("should NOT match handler text in the middle of content", () => {
      const re = createHandlerRegex("Kind");
      expect(re.test("some text Kind(\"software\")")).toBe(false);
    });

    it("should NOT match handler text with trailing content", () => {
      const re = createHandlerRegex("Kind");
      expect(re.test("Kind(\"software\") extra")).toBe(false);
    });

    it("should match with leading/trailing whitespace", () => {
      const re = createHandlerRegex("Kind");
      expect(re.test("  Kind(\"software\")  ")).toBe(true);
    });

    it("should NOT match handler-like text embedded in content", () => {
      const re = createHandlerRegex("BackLinks");
      expect(re.test("see BackLinks() for more")).toBe(false);
    });

    it("should handle handler names with regex special chars", () => {
      const re = createHandlerRegex("My.Handler");
      expect(re.test("My.Handler()")).toBe(true);
    });

    it("matches multiple invocations due to greedy capture (rejected at parser level)", () => {
      const re = createHandlerRegex("Kind");
      const source = "Kind(\"software\")\nKind(\"hardware\")";
      expect(re.test(source)).toBe(true);
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
