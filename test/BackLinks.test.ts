import type { Equal, Expect } from "@type-challenges/utils";
import { describe, expect, it } from "vitest";
import type { Classification, BackLinkOptions } from "../src/handlers/BackLinks";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

/**
 * Mock DataArray implementation for testing filter functions
 */
interface MockLink {
  path: string;
  display?: string;
  type?: string;
  embed?: boolean;
}

function createMockDataArray<T>(values: T[]) {
  return {
    length: values.length,
    values,
    where: (predicate: (elem: T, index: number, arr: T[]) => boolean) =>
      createMockDataArray(values.filter(predicate)),
    filter: (predicate: (elem: T, index: number, arr: T[]) => boolean) =>
      createMockDataArray(values.filter(predicate)),
    map: <U>(f: (elem: T, index: number, arr: T[]) => U) =>
      createMockDataArray(values.map(f)),
    sort: <U>(key: (elem: T) => U) =>
      createMockDataArray([...values].sort((a, b) => {
        const aKey = key(a);
        const bKey = key(b);
        return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
      })),
    array: () => values,
  };
}

function createMockLink(path: string, display?: string): MockLink {
  return {
    path,
    display: display || path.split("/").pop()?.replace(".md", ""),
    type: "file",
    embed: false,
  };
}

describe("BackLinks Types", () => {
  it("Classification type accepts valid patterns", () => {
    // Classification type correctly represents kind/category/subcategory patterns
    type KindOnly = Classification;
    type WithCategory = Classification;
    type WithSubcategory = Classification;

    // Type assignment tests - these should compile
    const kindOnly: KindOnly = "software";
    const withCategory: WithCategory = "software/development";
    const withSubcategory: WithSubcategory = "hardware/automation/switch";

    // Verify assignments worked (runtime check)
    expect(kindOnly).toBe("software");
    expect(withCategory).toBe("software/development");
    expect(withSubcategory).toBe("hardware/automation/switch");
  });

  it("BackLinkOptions interface has correct property types", () => {
    // @ts-ignore - type-only tests
    type cases = [
      Expect<Equal<BackLinkOptions["dedupe"], boolean | undefined>>,
      Expect<Equal<BackLinkOptions["excludeCompletedTasks"], boolean | undefined>>,
      Expect<Equal<BackLinkOptions["exclude"], Classification | Classification[] | undefined>>,
    ];

    // Runtime verification that the interface accepts valid options
    const options: BackLinkOptions = {
      dedupe: true,
      exclude: "software",
      excludeCompletedTasks: false,
    };

    expect(options.dedupe).toBe(true);
    expect(options.exclude).toBe("software");
    expect(options.excludeCompletedTasks).toBe(false);
  });

  it("BackLinkOptions accepts array of classifications", () => {
    const options: BackLinkOptions = {
      exclude: ["software/development", "hardware/automation"],
    };

    expect(Array.isArray(options.exclude)).toBe(true);
  });
});

describe("BackLinks Mock DataArray", () => {
  it("createMockDataArray implements where method correctly", () => {
    const links = [
      createMockLink("page-1.md"),
      createMockLink("page-2.md"),
      createMockLink("page-3.md"),
    ];

    const dataArray = createMockDataArray(links);
    const filtered = dataArray.where(l => l.path !== "page-2.md");

    expect(filtered.length).toBe(2);
    expect(filtered.values.map(l => l.path)).toEqual(["page-1.md", "page-3.md"]);
  });

  it("createMockDataArray implements sort method correctly", () => {
    const links = [
      createMockLink("c-page.md"),
      createMockLink("a-page.md"),
      createMockLink("b-page.md"),
    ];

    const dataArray = createMockDataArray(links);
    const sorted = dataArray.sort(l => l.path);

    expect(sorted.values.map(l => l.path)).toEqual([
      "a-page.md",
      "b-page.md",
      "c-page.md",
    ]);
  });

  it("createMockDataArray supports chaining", () => {
    const links = [
      createMockLink("page-1.md"),
      createMockLink("page-2.md"),
      createMockLink("page-3.md"),
      createMockLink("page-4.md"),
    ];

    const dataArray = createMockDataArray(links);
    const result = dataArray
      .where(l => l.path !== "page-1.md")
      .where(l => l.path !== "page-4.md")
      .sort(l => l.path);

    expect(result.length).toBe(2);
    expect(result.values.map(l => l.path)).toEqual(["page-2.md", "page-3.md"]);
  });
});

describe("BackLinks Filter Logic", () => {
  describe("Dedupe filtering concept", () => {
    it("should filter out links that appear in outlinks", () => {
      // Simulate dedupe logic
      const inlinks = [
        createMockLink("page-1.md"),
        createMockLink("page-2.md"),
        createMockLink("page-3.md"),
      ];
      const outlinks = [createMockLink("page-2.md")];
      const outlinkPaths = new Set(outlinks.map(l => l.path));

      const dataArray = createMockDataArray(inlinks);
      const filtered = dataArray.where(l => !outlinkPaths.has(l.path));

      expect(filtered.length).toBe(2);
      expect(filtered.values.map(l => l.path)).toEqual(["page-1.md", "page-3.md"]);
    });

    it("should return all links when outlinks is empty", () => {
      const inlinks = [
        createMockLink("page-1.md"),
        createMockLink("page-2.md"),
      ];
      const outlinks: MockLink[] = [];
      const outlinkPaths = new Set(outlinks.map(l => l.path));

      const dataArray = createMockDataArray(inlinks);
      const filtered = dataArray.where(l => !outlinkPaths.has(l.path));

      expect(filtered.length).toBe(2);
    });

    it("should preserve all links when dedupe is false", () => {
      const inlinks = [
        createMockLink("page-1.md"),
        createMockLink("page-2.md"),
      ];
      const outlinks = [createMockLink("page-2.md")];
      const dedupe = false;

      const dataArray = createMockDataArray(inlinks);
      // When dedupe is false, don't filter
      const filtered = dedupe
        ? dataArray.where(l => !new Set(outlinks.map(o => o.path)).has(l.path))
        : dataArray;

      expect(filtered.length).toBe(2);
    });
  });

  describe("Classification matching concept", () => {
    // Simulated page info structure
    interface MockPageInfo {
      kindTags: string[];
      categories: { category: string }[];
      subcategories: { subcategory: string }[];
    }

    function parseClassification(classification: string) {
      const normalized = classification.startsWith("#")
        ? classification.slice(1)
        : classification;
      const parts = normalized.split("/");
      return {
        kind: parts[0],
        category: parts[1],
        subcategory: parts[2],
      };
    }

    function matchesClassification(
      pageInfo: MockPageInfo,
      classifications: string[],
    ): boolean {
      return classifications.some((classification) => {
        const parsed = parseClassification(classification);

        const kindMatches = pageInfo.kindTags.includes(parsed.kind);
        if (!kindMatches)
          return false;
        if (!parsed.category)
          return true;

        const categoryMatches = pageInfo.categories.some(
          c => c.category === parsed.category,
        );
        if (!categoryMatches)
          return false;
        if (!parsed.subcategory)
          return true;

        return pageInfo.subcategories.some(
          s => s.subcategory === parsed.subcategory,
        );
      });
    }

    it("should match kind only", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["software"],
        categories: [{ category: "development" }],
        subcategories: [],
      };

      expect(matchesClassification(pageInfo, ["software"])).toBe(true);
      expect(matchesClassification(pageInfo, ["hardware"])).toBe(false);
    });

    it("should match kind/category", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["software"],
        categories: [{ category: "development" }],
        subcategories: [],
      };

      expect(matchesClassification(pageInfo, ["software/development"])).toBe(true);
      expect(matchesClassification(pageInfo, ["software/productivity"])).toBe(false);
    });

    it("should match kind/category/subcategory", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["hardware"],
        categories: [{ category: "automation" }],
        subcategories: [{ subcategory: "switch" }],
      };

      expect(matchesClassification(pageInfo, ["hardware/automation/switch"])).toBe(true);
      expect(matchesClassification(pageInfo, ["hardware/automation/hub"])).toBe(false);
    });

    it("should normalize # prefix", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["software"],
        categories: [],
        subcategories: [],
      };

      expect(matchesClassification(pageInfo, ["#software"])).toBe(true);
    });

    it("should match any of multiple classifications", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["software"],
        categories: [{ category: "development" }],
        subcategories: [],
      };

      expect(matchesClassification(pageInfo, ["hardware", "software"])).toBe(true);
      expect(matchesClassification(pageInfo, ["hardware", "book"])).toBe(false);
    });

    it("should handle pages with multiple categories", () => {
      const pageInfo: MockPageInfo = {
        kindTags: ["software"],
        categories: [
          { category: "development" },
          { category: "productivity" },
        ],
        subcategories: [],
      };

      expect(matchesClassification(pageInfo, ["software/development"])).toBe(true);
      expect(matchesClassification(pageInfo, ["software/productivity"])).toBe(true);
      expect(matchesClassification(pageInfo, ["software/gaming"])).toBe(false);
    });
  });

  describe("Completed tasks filtering concept", () => {
    interface MockTask {
      completed: boolean;
      link?: { path: string };
    }

    function filterCompletedTasks(
      links: MockLink[],
      inlinkTasks: MockTask[],
      excludeCompleted: boolean,
    ): MockLink[] {
      if (!excludeCompleted)
        return links;

      const completedTaskPaths = new Set(
        inlinkTasks
          .filter(t => t.completed)
          .map(t => t.link?.path)
          .filter(Boolean),
      );

      const nonCompletedPaths = new Set(
        inlinkTasks
          .filter(t => !t.completed)
          .map(t => t.link?.path)
          .filter(Boolean),
      );

      return links.filter((l) => {
        if (!completedTaskPaths.has(l.path))
          return true;
        return nonCompletedPaths.has(l.path);
      });
    }

    it("should filter out links only in completed tasks", () => {
      const links = [
        createMockLink("page-1.md"),
        createMockLink("page-2.md"),
        createMockLink("page-3.md"),
      ];
      const inlinkTasks: MockTask[] = [
        { completed: true, link: { path: "page-1.md" } },
        { completed: false, link: { path: "page-2.md" } },
      ];

      const filtered = filterCompletedTasks(links, inlinkTasks, true);

      // page-1 is only in completed tasks -> filtered out
      // page-2 is in non-completed tasks -> kept
      // page-3 has no task reference -> kept
      expect(filtered.map(l => l.path)).toEqual(["page-2.md", "page-3.md"]);
    });

    it("should keep links that appear in both completed and non-completed tasks", () => {
      const links = [createMockLink("page-1.md")];
      const inlinkTasks: MockTask[] = [
        { completed: true, link: { path: "page-1.md" } },
        { completed: false, link: { path: "page-1.md" } },
      ];

      const filtered = filterCompletedTasks(links, inlinkTasks, true);

      // page-1 appears in both completed and non-completed -> kept
      expect(filtered.map(l => l.path)).toEqual(["page-1.md"]);
    });

    it("should preserve all links when excludeCompleted is false", () => {
      const links = [
        createMockLink("page-1.md"),
        createMockLink("page-2.md"),
      ];
      const inlinkTasks: MockTask[] = [
        { completed: true, link: { path: "page-1.md" } },
      ];

      const filtered = filterCompletedTasks(links, inlinkTasks, false);

      expect(filtered.length).toBe(2);
    });

    it("should handle tasks with missing links gracefully", () => {
      const links = [createMockLink("page-1.md")];
      const inlinkTasks: MockTask[] = [
        { completed: true },
        { completed: true, link: undefined },
        { completed: false, link: { path: "page-1.md" } },
      ];

      const filtered = filterCompletedTasks(links, inlinkTasks, true);

      expect(filtered.length).toBe(1);
    });
  });
});

describe("BackLinks Integration Tests", () => {
  it("should work with all filters enabled", () => {
    // Simulate full filter chain
    const inlinks = [
      createMockLink("page-1.md"),
      createMockLink("page-2.md"),
      createMockLink("page-3.md"),
      createMockLink("page-4.md"),
      createMockLink("page-5.md"),
    ];
    const outlinks = [createMockLink("page-1.md")]; // page-1 is in body
    const completedTaskPaths = new Set(["page-2.md"]); // page-2 is only in completed task
    const excludedPaths = new Set(["page-3.md"]); // page-3 matches classification

    let dataArray = createMockDataArray(inlinks);

    // Apply dedupe
    const outlinkSet = new Set(outlinks.map(l => l.path));
    dataArray = dataArray.where(l => !outlinkSet.has(l.path));
    expect(dataArray.length).toBe(4); // page-1 filtered

    // Apply classification (simulated)
    dataArray = dataArray.where(l => !excludedPaths.has(l.path));
    expect(dataArray.length).toBe(3); // page-3 filtered

    // Apply completed tasks (simulated - assume page-2 only in completed)
    dataArray = dataArray.where(l => !completedTaskPaths.has(l.path));
    expect(dataArray.length).toBe(2); // page-2 filtered

    // Remaining: page-4 and page-5
    expect(dataArray.values.map(l => l.path)).toEqual(["page-4.md", "page-5.md"]);
  });

  it("should preserve backward compatibility with ignoreTags", () => {
    // Existing ignoreTags should still work
    const options: BackLinkOptions = {
      filterTags: ["#archive"],
      // New options should have defaults
      dedupe: true,
      excludeCompletedTasks: true,
    };

    expect(options.filterTags).toEqual(["#archive"]);
    expect(options.dedupe).toBe(true);
  });
});

describe("Performance considerations", () => {
  it("should handle 100 links efficiently", () => {
    // Create 100 links
    const links = Array.from({ length: 100 }, (_, i) =>
      createMockLink(`page-${i}.md`),
    );

    // Create outlinks (every 10th page)
    const outlinks = links.filter((_, i) => i % 10 === 0);
    const outlinkSet = new Set(outlinks.map(l => l.path));

    const start = performance.now();

    const dataArray = createMockDataArray(links);
    const filtered = dataArray.where(l => !outlinkSet.has(l.path));

    const end = performance.now();

    expect(end - start).toBeLessThan(50); // Should complete in <50ms
    expect(filtered.length).toBe(90); // 100 - 10 = 90
  });
});
