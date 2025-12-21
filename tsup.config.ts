import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["dist/main.mjs"],
  format: ["cjs"],
  dts: true,
  splitting: false,
  external: [
    "obsidian",
    "luxon",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    // Node.js built-ins used by dependencies (available in Electron)
    "node:util",
  ],
  sourcemap: true,
  clean: false,
  treeshake: true,
  outExtension: ({ format }) => {
    return {
      js: format === "cjs" ? ".js" : ".js",
      dts: format === "cjs" ? ".ts" : ".ts",
    };
  },
  tsconfig: "./tsconfig.json",
});
