import KindModelPlugin from "~/main";
import { dvApi } from "~/globals";
import { wait } from "~/utils";

type Task = () => unknown;

const MAX=50;

export function runAfterDataviewReady(k: KindModelPlugin) {
	if(dvApi.index.initialized) {
		k.dvStatus = "ready"
	}
	return async <T extends Task>(task: T) => {
		let attempts = 0;

		while(k.dvStatus !== "ready" && attempts < MAX) {
			await wait(200);
			if(dvApi.index.initialized) {
				k.dvStatus = "ready"
			}
			attempts++;
		}
		console.log("");
		if (attempts === MAX) {
			k.warn("timed out waiting for Dataview!")
		} else {
			k.debug("running delayed query");
			await task();
		}

	}
}
