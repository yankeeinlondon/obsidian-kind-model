import { Tag } from "types/general";

export const isTag = (val: unknown): val is Tag => {
	return typeof val === "string" && /#[a-zA-Z0-9\\_]+/.test(val)
}
