import { ensureLeading } from "inferred-types";
import { formattingApi } from "~/api";

export const asTag = (tag: string) => ensureLeading(tag, "#");

export const asDisplayTag = (
	tag: string,
	asHtml: boolean = false
) => asHtml
	? `<code>${asTag(tag)}</code>`
	: `<code>${asTag(tag)}</code>`;
