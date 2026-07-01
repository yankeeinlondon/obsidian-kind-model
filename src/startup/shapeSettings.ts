import type KindModelPlugin from "~/main";
import { isArray, isEmpty } from "inferred-types";
import { DEFAULT_SETTINGS, LOG_LEVELS } from "~/utils/Constants";

/**
 * responsible for making sure that settings is correctly shaped
 */
export async function shapeSettings(p: KindModelPlugin) {
  let changed = false;
  const settings = p.settings as unknown as Record<string, unknown>;

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (!(key in settings)) {
      settings[key] = value;
      changed = true;
    }
  }

  if (!isArray(p.settings.kindPaths)) {
    p.settings.kindPaths = [];
    changed = true;
  }
  if (!isArray(p.settings.page_blocks)) {
    p.settings.page_blocks = [];
    changed = true;
  }
  if (!isArray(p.settings.kinds)) {
    p.settings.kinds = [];
    changed = true;
  }
  if (!isArray(p.settings.types)) {
    p.settings.types = [];
    changed = true;
  }
  if (!isArray(p.settings.url_props)) {
    p.settings.url_props = [];
    changed = true;
  }
  if (!isArray(p.settings.url_patterns)) {
    p.settings.url_patterns = [];
    changed = true;
  }

  if (isEmpty(p.settings.log_level) || !LOG_LEVELS.includes(p.settings.log_level)) {
    p.settings.log_level = "warn";
    changed = true;
  }

  const EXPECTED_PROPS = new Set([
    ...Object.keys(DEFAULT_SETTINGS),
    "kindDefnBaseDir",
    "typeDefnBaseDir",
  ]);

  for (const key of Object.keys(settings)) {
    if (!EXPECTED_PROPS.has(key)) {
      delete settings[key];
      changed = true;
    }
  }

  if (changed) {
    await p.saveSettings();
  }
}
