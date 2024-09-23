import KindModelPlugin from "main";

export const on_layout_change = (plugin: KindModelPlugin) => {

plugin.registerEvent(
	plugin.app.workspace.on("layout-change", () => {
		plugin.info("Layout Change")
	})
);

}
