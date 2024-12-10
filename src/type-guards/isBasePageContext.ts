import type { BasePageContext } from "~/types";

export function isBasePageContext(v: unknown): v is BasePageContext {
  return !!(typeof v === "object"
    && v !== null
    && (v as Record<string, unknown>)?.__kind === "BasePageContext");
}
