import { createHandler } from "./createHandler";

export const Icons = createHandler("Journal")
	.scalar()
	.options({})
	.handler(async (_evt) => {});
