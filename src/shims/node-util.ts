/**
 * Minimal browser/mobile-safe shim for Node's `node:util`.
 *
 * Obsidian on desktop runs in Electron (Node available), but on iOS/Android
 * there is no Node runtime, so a bundled dependency's top-level
 * `import { inspect } from "node:util"` would throw at module-eval time and
 * prevent the whole plugin from loading. Only `inspect` is consumed (by
 * `inferred-types` for debug/error formatting), so a lightweight JSON-based
 * fallback is sufficient.
 */

export function inspect(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(
      value,
      (_key, val) => (typeof val === "bigint" ? val.toString() : val),
    ) ?? String(value);
  }
  catch {
    return String(value);
  }
}

export default { inspect };
