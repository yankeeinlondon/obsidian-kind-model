import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for the KM Block auto-refresh system.
 *
 * Since the actual KmBlockTracker depends on Obsidian APIs,
 * we test the core logic patterns in isolation.
 */

// Mock types matching the real implementation
interface MockKmBlockContext {
  el: { innerHTML: string };
  ctx: { sourcePath: string };
  source: string;
  callback: (source: string, el: any, ctx: any) => Promise<void>;
}

/**
 * Simplified KmBlockTracker for testing core logic
 */
class TestableKmBlockTracker {
  private blocks: Map<string, Set<MockKmBlockContext>> = new Map();
  private refreshTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private debounceMs = 100;
  private mountedElements: Set<any> = new Set();

  // Track refresh calls for testing
  public refreshCalls: string[] = [];

  register(filepath: string, context: MockKmBlockContext): void {
    if (!this.blocks.has(filepath)) {
      this.blocks.set(filepath, new Set());
    }
    this.blocks.get(filepath)!.add(context);
    this.mountedElements.add(context.el);
  }

  unregister(filepath: string, context: MockKmBlockContext): void {
    const fileBlocks = this.blocks.get(filepath);
    if (fileBlocks) {
      fileBlocks.delete(context);
      if (fileBlocks.size === 0) {
        this.blocks.delete(filepath);
      }
    }
    this.mountedElements.delete(context.el);
  }

  unregisterAll(filepath: string): void {
    const fileBlocks = this.blocks.get(filepath);
    if (fileBlocks) {
      for (const ctx of fileBlocks) {
        this.mountedElements.delete(ctx.el);
      }
    }
    this.blocks.delete(filepath);
  }

  getBlockCount(): number {
    let count = 0;
    for (const blocks of this.blocks.values()) {
      count += blocks.size;
    }
    return count;
  }

  getBlockCountForFile(filepath: string): number {
    return this.blocks.get(filepath)?.size ?? 0;
  }

  isElementMounted(el: any): boolean {
    return this.mountedElements.has(el);
  }

  simulateUnmount(el: any): void {
    this.mountedElements.delete(el);
  }

  async refreshFile(filepath: string): Promise<void> {
    // Clear existing timer if any
    const existingTimer = this.refreshTimers.get(filepath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounced timer
    return new Promise((resolve) => {
      const timer = setTimeout(async () => {
        this.refreshTimers.delete(filepath);
        await this.doRefresh(filepath);
        resolve();
      }, this.debounceMs);

      this.refreshTimers.set(filepath, timer);
    });
  }

  async refreshFileImmediate(filepath: string): Promise<void> {
    await this.doRefresh(filepath);
  }

  private async doRefresh(filepath: string): Promise<void> {
    const fileBlocks = this.blocks.get(filepath);
    if (!fileBlocks || fileBlocks.size === 0) {
      return;
    }

    this.refreshCalls.push(filepath);

    const staleBlocks: MockKmBlockContext[] = [];

    for (const context of fileBlocks) {
      // Check if element is still mounted
      if (!this.isElementMounted(context.el)) {
        staleBlocks.push(context);
        continue;
      }

      try {
        await context.callback(context.source, context.el, context.ctx);
      }
      catch (error) {
        // Handle error silently in tests
      }
    }

    // Clean up stale blocks
    for (const stale of staleBlocks) {
      fileBlocks.delete(stale);
    }

    if (fileBlocks.size === 0) {
      this.blocks.delete(filepath);
    }
  }

  clear(): void {
    this.blocks.clear();
    for (const timer of this.refreshTimers.values()) {
      clearTimeout(timer);
    }
    this.refreshTimers.clear();
    this.mountedElements.clear();
    this.refreshCalls = [];
  }
}

describe("KmBlockTracker", () => {
  let tracker: TestableKmBlockTracker;

  beforeEach(() => {
    tracker = new TestableKmBlockTracker();
  });

  afterEach(() => {
    tracker.clear();
  });

  describe("registration", () => {
    it("should register a block for a filepath", () => {
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test.md", context);

      expect(tracker.getBlockCount()).toBe(1);
      expect(tracker.getBlockCountForFile("test.md")).toBe(1);
    });

    it("should register multiple blocks for the same filepath", () => {
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: vi.fn(),
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);

      expect(tracker.getBlockCount()).toBe(2);
      expect(tracker.getBlockCountForFile("test.md")).toBe(2);
    });

    it("should register blocks for different filepaths", () => {
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test1.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test2.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test1.md", context1);
      tracker.register("test2.md", context2);

      expect(tracker.getBlockCount()).toBe(2);
      expect(tracker.getBlockCountForFile("test1.md")).toBe(1);
      expect(tracker.getBlockCountForFile("test2.md")).toBe(1);
    });
  });

  describe("unregistration", () => {
    it("should unregister a specific block", () => {
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: vi.fn(),
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);
      tracker.unregister("test.md", context1);

      expect(tracker.getBlockCount()).toBe(1);
    });

    it("should remove filepath when last block is unregistered", () => {
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test.md", context);
      tracker.unregister("test.md", context);

      expect(tracker.getBlockCount()).toBe(0);
      expect(tracker.getBlockCountForFile("test.md")).toBe(0);
    });

    it("should unregister all blocks for a filepath", () => {
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: vi.fn(),
      };
      const context3: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "other.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);
      tracker.register("other.md", context3);
      tracker.unregisterAll("test.md");

      expect(tracker.getBlockCount()).toBe(1);
      expect(tracker.getBlockCountForFile("test.md")).toBe(0);
      expect(tracker.getBlockCountForFile("other.md")).toBe(1);
    });
  });

  describe("refresh", () => {
    it("should call callback on refresh", async () => {
      const callback = vi.fn();
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback,
      };

      tracker.register("test.md", context);
      await tracker.refreshFileImmediate("test.md");

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        "BackLinks()",
        context.el,
        context.ctx,
      );
    });

    it("should call callback for all blocks in a file", async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: callback1,
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: callback2,
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);
      await tracker.refreshFileImmediate("test.md");

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should not call callback for blocks in different files", async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test1.md" },
        source: "BackLinks()",
        callback: callback1,
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test2.md" },
        source: "BackLinks()",
        callback: callback2,
      };

      tracker.register("test1.md", context1);
      tracker.register("test2.md", context2);
      await tracker.refreshFileImmediate("test1.md");

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
    });

    it("should do nothing when refreshing a file with no blocks", async () => {
      await tracker.refreshFileImmediate("nonexistent.md");

      expect(tracker.refreshCalls).toEqual([]);
    });

    it("should track refresh calls", async () => {
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test.md", context);
      await tracker.refreshFileImmediate("test.md");
      await tracker.refreshFileImmediate("test.md");

      expect(tracker.refreshCalls).toEqual(["test.md", "test.md"]);
    });
  });

  describe("stale block cleanup", () => {
    it("should remove unmounted elements on refresh", async () => {
      const callback = vi.fn();
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback,
      };

      tracker.register("test.md", context);
      tracker.simulateUnmount(context.el);
      await tracker.refreshFileImmediate("test.md");

      expect(callback).not.toHaveBeenCalled();
      expect(tracker.getBlockCount()).toBe(0);
    });

    it("should keep mounted elements and remove only unmounted ones", async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: callback1,
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: callback2,
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);
      tracker.simulateUnmount(context1.el);
      await tracker.refreshFileImmediate("test.md");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(tracker.getBlockCount()).toBe(1);
    });
  });

  describe("debouncing", () => {
    it("should debounce rapid refresh calls", async () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      const context: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback,
      };

      tracker.register("test.md", context);

      // Trigger multiple rapid refresh calls
      tracker.refreshFile("test.md");
      tracker.refreshFile("test.md");
      tracker.refreshFile("test.md");

      // Callback should not be called yet
      expect(callback).not.toHaveBeenCalled();

      // Advance past debounce timeout
      await vi.advanceTimersByTimeAsync(150);

      // Should only be called once despite multiple triggers
      expect(callback).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it("should refresh each file independently", async () => {
      vi.useFakeTimers();

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test1.md" },
        source: "BackLinks()",
        callback: callback1,
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test2.md" },
        source: "BackLinks()",
        callback: callback2,
      };

      tracker.register("test1.md", context1);
      tracker.register("test2.md", context2);

      tracker.refreshFile("test1.md");
      tracker.refreshFile("test2.md");

      await vi.advanceTimersByTimeAsync(150);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe("error handling", () => {
    it("should continue with other blocks if one callback throws", async () => {
      const errorCallback = vi.fn().mockRejectedValue(new Error("Test error"));
      const successCallback = vi.fn();
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "BackLinks()",
        callback: errorCallback,
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test.md" },
        source: "Kind('software')",
        callback: successCallback,
      };

      tracker.register("test.md", context1);
      tracker.register("test.md", context2);
      await tracker.refreshFileImmediate("test.md");

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).toHaveBeenCalled();
    });
  });

  describe("clear", () => {
    it("should clear all tracked blocks", () => {
      const context1: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test1.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };
      const context2: MockKmBlockContext = {
        el: { innerHTML: "" },
        ctx: { sourcePath: "test2.md" },
        source: "BackLinks()",
        callback: vi.fn(),
      };

      tracker.register("test1.md", context1);
      tracker.register("test2.md", context2);
      tracker.clear();

      expect(tracker.getBlockCount()).toBe(0);
    });
  });
});

describe("Auto-refresh integration scenarios", () => {
  let tracker: TestableKmBlockTracker;

  beforeEach(() => {
    tracker = new TestableKmBlockTracker();
  });

  afterEach(() => {
    tracker.clear();
  });

  it("should support the dedupe refresh scenario", async () => {
    /**
     * Scenario: User has Blue Bedroom page with BackLinks block.
     * Alexa Echo links to Blue Bedroom.
     * 1. Initially Alexa is in page body (outlink) -> filtered by dedupe
     * 2. User removes Alexa from body
     * 3. File saves -> metadataCache.changed fires
     * 4. BackLinks block refreshes -> now shows Alexa Echo
     */
    let outlinkPaths = new Set(["Alexa Echo.md"]);
    const inlinks = ["Alexa Echo.md", "Other Page.md"];

    const renderResult = { content: "" };
    const callback = vi.fn(async () => {
      // Simulate BackLinks rendering with dedupe
      const deduped = inlinks.filter(l => !outlinkPaths.has(l));
      renderResult.content = deduped.join(", ");
    });

    const context: MockKmBlockContext = {
      el: { innerHTML: "" },
      ctx: { sourcePath: "Blue Bedroom.md" },
      source: "BackLinks()",
      callback,
    };

    tracker.register("Blue Bedroom.md", context);

    // Initial render - Alexa is in body
    await tracker.refreshFileImmediate("Blue Bedroom.md");
    expect(renderResult.content).toBe("Other Page.md");

    // User removes Alexa from body
    outlinkPaths = new Set(); // Alexa no longer an outlink

    // File saves, triggers refresh
    await tracker.refreshFileImmediate("Blue Bedroom.md");
    expect(renderResult.content).toBe("Alexa Echo.md, Other Page.md");
  });

  it("should handle page with multiple km blocks", async () => {
    /**
     * Scenario: Page has both BackLinks and Kind blocks.
     * Both should refresh when page changes.
     */
    const backlinksResult = { called: false };
    const kindResult = { called: false };

    const backlinksContext: MockKmBlockContext = {
      el: { innerHTML: "" },
      ctx: { sourcePath: "test.md" },
      source: "BackLinks()",
      callback: async () => {
        backlinksResult.called = true;
      },
    };

    const kindContext: MockKmBlockContext = {
      el: { innerHTML: "" },
      ctx: { sourcePath: "test.md" },
      source: "Kind('software')",
      callback: async () => {
        kindResult.called = true;
      },
    };

    tracker.register("test.md", backlinksContext);
    tracker.register("test.md", kindContext);
    await tracker.refreshFileImmediate("test.md");

    expect(backlinksResult.called).toBe(true);
    expect(kindResult.called).toBe(true);
  });

  it("should not affect other pages when one page changes", async () => {
    /**
     * Scenario: Two pages open with BackLinks blocks.
     * Editing one should only refresh that one.
     */
    const page1Result = { refreshCount: 0 };
    const page2Result = { refreshCount: 0 };

    const page1Context: MockKmBlockContext = {
      el: { innerHTML: "" },
      ctx: { sourcePath: "page1.md" },
      source: "BackLinks()",
      callback: async () => {
        page1Result.refreshCount++;
      },
    };

    const page2Context: MockKmBlockContext = {
      el: { innerHTML: "" },
      ctx: { sourcePath: "page2.md" },
      source: "BackLinks()",
      callback: async () => {
        page2Result.refreshCount++;
      },
    };

    tracker.register("page1.md", page1Context);
    tracker.register("page2.md", page2Context);

    // Only page1 changes
    await tracker.refreshFileImmediate("page1.md");

    expect(page1Result.refreshCount).toBe(1);
    expect(page2Result.refreshCount).toBe(0);
  });
});
