import { BasePageContext } from "~/types";

export const isBasePageContext = (v: unknown): v is BasePageContext => {
	return typeof v === "object" &&
		v !== null &&
		(v as Record<string, unknown>)?.__kind === "BasePageContext"
		? true
		: false;
};
