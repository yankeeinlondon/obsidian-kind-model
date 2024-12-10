import { isObject } from "inferred-types";

/**
 * type guard which validates that `val` is a Obsidian `Component` type
 */
export function isObsidianComponent(val: unknown) {
  return isObject(val)
    && "load" in val
    && "onload" in val
    && "unload" in val
    && "registerEvent" in val
    && "registerDomEvent" in val
    && "registerInterval" in val;
}
