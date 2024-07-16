import {  Iso8601 } from "inferred-types";
import { RequestUrlParam } from "obsidian";

export type CommonHeaders = {
	"cache-control"?: string;
	"content-encoding"?: string;
	"content-security-policy"?: string;
	"content-type"?: string;
	"date"?: Iso8601;
	"server"?: string;
	
}

export type UrlResponse = {
	url: string;
	status: number;
	headers: CommonHeaders;
	arrayBuffer: ArrayBuffer;
	json(): Promise<string>;
	text: string;
}

/**
 * Uses the method provided by Obsidian in the global namespace to make network
 * requests without the CORS issues associated with `fetch`.
 */
export const requestUrl = async (req: RequestUrlParam) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let resp = await (globalThis as any).requestUrl(req);
	resp.url = req.url;

	return resp as UrlResponse;
}
