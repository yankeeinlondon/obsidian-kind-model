import type KindModelPlugin from "~/main";
import { isArray, isEmpty } from "inferred-types";

/**
 * responsible for making sure that settings is correctly shaped
 */
export async function shapeSettings(p: KindModelPlugin) {
  let changed = false;

  if (!isArray(p.settings.kindPaths)) {
    p.settings.kindPaths = [];
    changed = true;
  }

  if (isEmpty(p.settings.log_level)) {
    p.settings.log_level = "warn";
    changed = true;
  }

  const EXPECTED_PROPS = [
    "kindPaths",
    "log_level",
    "kindDefnBaseDir",
    "typeDefnBaseDir",
  ];

  for (const key of Object.keys(p.settings)) {
    if (!EXPECTED_PROPS.includes(key)) {
      delete (p.settings as any)[key];
      changed = true;
    }
  }

  if (changed) {
    await p.saveSettings();
  }
}
