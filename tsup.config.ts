import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["dist/main.mjs"],
  format: ["cjs"],
  dts: false,
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
