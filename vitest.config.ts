import path from "pathe";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
      "test/": `${path.resolve(__dirname, "test")}/`,
      // Mock obsidian module for tests
      "obsidian": path.resolve(__dirname, "test/__mocks__/obsidian.ts"),
      // Also mock obsidian-dataview which depends on obsidian
      "obsidian-dataview": path.resolve(__dirname, "test/__mocks__/obsidian-dataview.ts"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    include: ["test/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    // Use vmThreads to avoid happy-dom process cleanup issues
    pool: "vmThreads",
  },
});
