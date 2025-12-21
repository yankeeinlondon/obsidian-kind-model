import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";

/**
 * Context for a registered KM block that can be refreshed
 */
export interface KmBlockContext {
  el: HTMLElement;
  ctx: MarkdownPostProcessorContext & Component;
  source: string;
  callback: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext & Component) => Promise<void>;
}

/**
 * Tracks active KM blocks by their source file path.
 * Allows for auto-refresh when the host file changes.
 */
export class KmBlockTracker {
  /** Map of filepath -> Set of active block contexts */
  private blocks: Map<string, Set<KmBlockContext>> = new Map();

  /** Debounce timers per file */
  private refreshTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /** Debounce delay in ms */
  private debounceMs = 100;

  constructor(private plugin: KindModelPlugin) {}

  /**
   * Register a KM block for potential refresh
   */
  register(
    filepath: string,
    context: KmBlockContext,
  ): void {
    if (!this.blocks.has(filepath)) {
      this.blocks.set(filepath, new Set());
    }
    this.blocks.get(filepath)!.add(context);

    this.plugin.debug(`KM block registered for ${filepath}, total: ${this.blocks.get(filepath)!.size}`);
  }

  /**
   * Unregister a KM block (e.g., when it's unmounted)
   */
  unregister(filepath: string, context: KmBlockContext): void {
    const fileBlocks = this.blocks.get(filepath);
    if (fileBlocks) {
      fileBlocks.delete(context);
      if (fileBlocks.size === 0) {
        this.blocks.delete(filepath);
      }
    }
  }

  /**
   * Unregister all blocks for a filepath
   */
  unregisterAll(filepath: string): void {
    this.blocks.delete(filepath);
    this.plugin.debug(`All KM blocks unregistered for ${filepath}`);
  }

  /**
   * Check if an element is still in the DOM
   */
  private isElementMounted(el: HTMLElement): boolean {
    return document.body.contains(el);
  }

  /**
   * Refresh all KM blocks for a given filepath.
   * Debounced to avoid excessive re-renders.
   */
  async refreshFile(filepath: string): Promise<void> {
    // Clear existing timer if any
    const existingTimer = this.refreshTimers.get(filepath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounced timer
    const timer = setTimeout(async () => {
      this.refreshTimers.delete(filepath);
      await this.doRefresh(filepath);
    }, this.debounceMs);

    this.refreshTimers.set(filepath, timer);
  }

  /**
   * Normalize HTML for comparison by removing transient attributes
   * and whitespace differences that don't affect visual output
   */
  private normalizeHtmlForComparison(html: string): string {
    return html
      // Remove data-task-id and similar dynamic attributes
      .replace(/\s+data-[\w-]+="[^"]*"/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Actually perform the refresh
   */
  private async doRefresh(filepath: string): Promise<void> {
    const fileBlocks = this.blocks.get(filepath);
    if (!fileBlocks || fileBlocks.size === 0) {
      return;
    }

    this.plugin.debug(`Refreshing ${fileBlocks.size} KM blocks for ${filepath}`);

    const staleBlocks: KmBlockContext[] = [];

    for (const context of fileBlocks) {
      // Check if element is still mounted
      if (!this.isElementMounted(context.el)) {
        staleBlocks.push(context);
        continue;
      }

      try {
        // Capture current content for comparison
        const previousHtml = this.normalizeHtmlForComparison(context.el.innerHTML);

        // Create a temporary container to render new content
        const tempContainer = document.createElement("div");
        tempContainer.style.overflowX = "auto";

        // Re-execute the callback into the temp container
        await context.callback(context.source, tempContainer, context.ctx);

        // Compare normalized HTML
        const newHtml = this.normalizeHtmlForComparison(tempContainer.innerHTML);

        if (previousHtml !== newHtml) {
          // Content changed - swap in the new content
          context.el.empty();
          context.el.style.overflowX = "auto";

          // Move children from temp container to actual element
          while (tempContainer.firstChild) {
            context.el.appendChild(tempContainer.firstChild);
          }

          this.plugin.debug(`KM block content changed for ${filepath}, updated DOM`);
        }
        else {
          this.plugin.debug(`KM block content unchanged for ${filepath}, skipped DOM update`);
        }
      }
      catch (error) {
        this.plugin.warn(`Error refreshing KM block: ${error}`);
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

  /**
   * Get the count of tracked blocks
   */
  getBlockCount(): number {
    let count = 0;
    for (const blocks of this.blocks.values()) {
      count += blocks.size;
    }
    return count;
  }

  /**
   * Clear all tracked blocks
   */
  clear(): void {
    this.blocks.clear();
    for (const timer of this.refreshTimers.values()) {
      clearTimeout(timer);
    }
    this.refreshTimers.clear();
  }
}

/**
 * Sets up the metadata change listener to auto-refresh KM blocks
 */
export function setupKmBlockRefresh(plugin: KindModelPlugin): KmBlockTracker {
  const tracker = new KmBlockTracker(plugin);

  // Store on plugin for access from codeblock parser
  (plugin as any).kmBlockTracker = tracker;

  // Listen for metadata changes
  plugin.registerEvent(
    plugin.app.metadataCache.on("changed", (file) => {
      plugin.debug(`Metadata changed for ${file.path}`);
      tracker.refreshFile(file.path);
    }),
  );

  plugin.info("KM block auto-refresh enabled");

  return tracker;
}

/**
 * Get the KM block tracker from the plugin
 */
export function getKmBlockTracker(plugin: KindModelPlugin): KmBlockTracker | undefined {
  return (plugin as any).kmBlockTracker;
}
