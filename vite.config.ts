import vuePlugin from "@vitejs/plugin-vue";
import { execFileSync } from "node:child_process";
import path from "pathe";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
	  "test/": `${path.resolve(__dirname, "test")}/`,
    },
  },
  plugins: [
    vuePlugin(), 
    {
      // pushes new JS files to vault so they can be viewed
      // in real time.
      name: "push-on-update",
      apply: "build",
      async closeBundle() {
        console.log("Change detected");
        execFileSync(`${process.env.PWD}/push`, {
          shell: true,
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
        "luxon",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
      ],
    },
    sourcemap: true,
    watch: {
      include: /src\/.*\.ts/,
    },
    emptyOutDir: false,
    outDir: "./dist",
  },
});
