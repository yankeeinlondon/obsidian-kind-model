import type { Iso8601 } from "inferred-types";
import type { RequestUrlParam } from "obsidian";
import type { GetIconFromObsidian, ObsidianSvgElement } from "~/types";

export interface CommonHeaders {
  "cache-control"?: string;
  "content-encoding"?: string;
  "content-security-policy"?: string;
  "content-type"?: string;
  "date"?: Iso8601;
  "server"?: string;
}

export interface UrlResponse {
  url: string;
  status: number;
  headers: CommonHeaders;
  arrayBuffer: ArrayBuffer;
  json: () => Promise<string>;
  text: string;
}

/**
 * Uses the method provided by Obsidian in the global namespace to make network
 * requests without the CORS issues associated with `fetch`.
 */
export async function requestUrl(req: RequestUrlParam) {
  const resp = await (globalThis as any).requestUrl(req);
  resp.url = req.url;

  return resp as UrlResponse;
}

/**
 * The `getIcon` method provided by **Obsidian** on the global object.
 */
export function getIcon(filePath: string): ObsidianSvgElement | null {
  const getICON = (globalThis as any).getIcon as GetIconFromObsidian;
  return getICON(filePath) as ObsidianSvgElement | null;
}
