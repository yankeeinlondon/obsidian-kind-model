import KindModelPlugin from "~/main";

/**
 * converts a code block marked as `csv` into a table
 */
export const csv = (plugin: KindModelPlugin) => {
	plugin.registerMarkdownCodeBlockProcessor("csv", (source, el, _ctx) => {
		const rows = source.split("\n").filter((row) => row.length > 0);

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
};
