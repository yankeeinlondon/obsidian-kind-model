import path from "pathe";
import { defineConfig } from "vite";
import { execFileSync } from "node:child_process";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [
		vuePlugin(),
		{
			// pushes new JS files to vault so they can be viewed
			// in real time.
			name: "push-on-update",
			apply: "build",
			async closeBundle() {
				console.log("Change detected");
				execFileSync(`${process.env.PWD}/push`, {shell: true, stdio: "inherit"})
			}
		}
	],
	build: {
		minify: false,
		// Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
		lib: {
			entry: path.resolve(__dirname, './src/main.ts'),
			formats: ["es"]
		},
		rollupOptions: {
			treeshake: true,
			output: {
				// Overwrite default Vite output fileName
				entryFileNames: 'main.mjs',
				assetFileNames: 'styles.css'
			},
			external: [ 
				"obsidian",
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
  		        "@lezer/lr"
			]
		},
		sourcemap: true,
		watch: {
			include: /src\/.*\.ts/,
		}, 
		emptyOutDir: false,
		outDir: '.'
	}
})
