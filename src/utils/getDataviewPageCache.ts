import { DataviewRootApi } from "types/dataview_types";
import KindModelPlugin from "../main";

export const getDataviewPageCache = (plugin: KindModelPlugin) => {

	const base = "DataviewAPI" in globalThis
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		? (globalThis as any).DataviewAPI
		: null;

	if (!base) {
		plugin.error(`Unable to reach the Dataview root API!`);
	} else {
		return base as DataviewRootApi;
	}
}
