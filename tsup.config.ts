import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["dist/main.mjs"],
  format: ["cjs"],
  dts: true,
  splitting: false,
  external: ["obsidian"],
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
