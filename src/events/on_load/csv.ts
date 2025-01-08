import { Column, htmlTable, renderApi } from "~/api";
import type KindModelPlugin from "~/main";

/**
 * converts a code block marked as `csv` into a table
 */
export function csv(plugin: KindModelPlugin) {
  plugin.registerMarkdownCodeBlockProcessor("csv", (source, el, _ctx) => {
    const rows = source.split("\n").filter(row => row.length > 0);
	plugin.info("csv", {source,el, _ctx})

    const table = el.createEl("table");
    const body = table.createEl("tbody");

    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].split(",");
      const row = body.createEl("tr");

      for (let j = 0; j < cols.length; j++) {
        row.createEl("td", { text: cols[j] });
      }
    }
  });
}

export function csv2(plugin: KindModelPlugin) {
	plugin.registerMarkdownCodeBlockProcessor("csv", (source, el, ctx) => {
		const rows = source.split("\n").filter(row => row.length > 0);
		const data = rows.slice(1).map(i => i.split(","));
		const cols = rows[0].split(",").map(
			(col, idx) => {
				const re = /.*{[#$£€]}.*/;
				return re.test(col)
				? (() => [
					col.replace(/{[#$£€]}/, "").trim().split(/\s+/).join("\n"), 
					{
						"text-align": "end",
						"font-family": "monospace",
						"padding-left": "1rem",
						"font-weight": "300"
					}]) as Column
				: col.trim().split(/\s+/).join("\n")
			}
		);

		const table = htmlTable( plugin)(cols, {
			headings: { 
				"background-color": "rgba(254,254,254,0.07)",
			},
			eachHeading: {
				"text-align": "center",
				"vertical-align": "bottom",
				"padding": "0.5rem",
				"margin-bottom": "0.25rem"
			},
			odd: {
				"background-color": "rgba(255,255,255,0.02)"
			},
			table: {
				"border-radius": "0.5rem",
				"overflow": "hidden"
			}
		});

		plugin.debug("csv", {cols, data})

		renderApi(plugin)(el, ctx.sourcePath).renderValue(
			table(data)
		)


	});
}
