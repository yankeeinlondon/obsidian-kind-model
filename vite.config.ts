import vuePlugin from "@vitejs/plugin-vue";
import { execFileSync } from "node:child_process";
import path from "pathe";
import { defineConfig } from "vite";

const shouldPushToVault = process.env.KM_PUSH_ON_BUILD === "1";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
	  "test/": `${path.resolve(__dirname, "test")}/`,
      // Mobile (iOS/Android) has no Node runtime, so a dependency's top-level
      // `import { inspect } from "node:util"` would crash plugin load. Replace
      // it with a browser-safe shim instead of marking it external.
      "node:util": path.resolve(__dirname, "src/shims/node-util.ts"),
    },
  },
  define: {
    // A bundled date util reads `process.env.TZ` in a top-level IIFE; `process`
    // is undefined on mobile. Statically replace so it falls back to Intl.
    "process.env.TZ": "undefined",
  },
  plugins: [
    vuePlugin(), 
    {
      // pushes new JS files to vault so they can be viewed
      // in real time.
      name: "push-on-update",
      apply: "build",
      async closeBundle() {
        if (!shouldPushToVault) {
          return;
        }
        console.log("Change detected");
        execFileSync(path.resolve(__dirname, "push"), {
          shell: false,
          stdio: "inherit",
        });
      },
    },
  ],
  build: {
    minify: false,
    // Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: path.resolve(__dirname, "./src/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: true,
      output: {
        // Overwrite default Vite output fileName
        entryFileNames: "main.mjs",
        assetFileNames: "styles.css",
      },
      external: [
        "obsidian",
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
    },
    sourcemap: true,
    emptyOutDir: false,
    outDir: "./dist",
  },
});
