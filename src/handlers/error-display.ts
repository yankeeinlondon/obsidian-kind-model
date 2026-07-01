/**
 * Enhanced error display utilities for KM blocks.
 * Provides rich error messages with suggestions and documentation links.
 */
import type { ArkErrors } from "arktype";
import { escapeHtml } from "~/utils/html";
import { getAllHandlers, getHandlerMetadata } from "./registry";

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      }
      else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Suggest the closest match from a list of valid options.
 */
export function suggestClosestOption(
  invalidKey: string,
  validKeys: string[],
): string | null {
  let closest: string | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const key of validKeys) {
    const distance = levenshteinDistance(invalidKey.toLowerCase(), key.toLowerCase());
    if (distance < minDistance && distance <= 3) {
      minDistance = distance;
      closest = key;
    }
  }

  return closest;
}

/**
 * Get all valid handler names.
 */
export function getValidHandlerNames(): string[] {
  return getAllHandlers().map(h => h.name);
}

/**
 * Get valid option keys for a handler.
 */
export function getValidOptionKeys(handlerName: string): string[] {
  const meta = getHandlerMetadata(handlerName);
  if (!meta?.optionsSchema) {
    return [];
  }

  const keys: string[] = [];
  try {
    const def = (meta.optionsSchema as any).internal?.structure;
    if (def) {
      for (const key of Object.keys(def)) {
        if (key !== "+") {
          keys.push(key.replace(/\?$/, ""));
        }
      }
    }
  }
  catch {
    // Ignore
  }
  return keys;
}

/**
 * Format ArkType validation errors into HTML content.
 */
export function formatArkTypeErrors(
  errors: ArkErrors,
  handlerName: string,
): string[] {
  const content: string[] = [];
  const validKeys = getValidOptionKeys(handlerName);

  for (const error of errors) {
    const path = error.path?.length ? error.path.join(".") : "value";

    content.push(`<div class="km-error-item" style="margin-bottom: 8px;">`);
    content.push(`<b>Problem:</b> ${escapeHtml(error.message)}`);

    if (error.expected) {
      content.push(`<br/><b>Expected:</b> <code>${escapeHtml(error.expected)}</code>`);
    }
    if (error.actual !== undefined) {
      content.push(`<br/><b>Received:</b> <code>${escapeHtml(String(error.actual))}</code>`);
    }
    if (path !== "value") {
      content.push(`<br/><b>At:</b> <code>${escapeHtml(path)}</code>`);

      // Check if this is an unknown key error and suggest closest match
      const suggestion = suggestClosestOption(path, validKeys);
      if (suggestion) {
        content.push(`<br/><b>Did you mean:</b> <code>${escapeHtml(suggestion)}</code>`);
      }
    }
    content.push(`</div>`);
  }

  return content;
}

/**
 * Format an unknown handler error with suggestions.
 */
export function formatUnknownHandlerError(
  source: string,
): string[] {
  const content: string[] = [];
  const validHandlers = getValidHandlerNames();

  // Try to extract the handler name from the source
  const match = source.match(/^([A-Z][a-zA-Z]*)/);
  const handlerName = match ? match[1] : source.trim();

  const suggestion = suggestClosestOption(handlerName, validHandlers);

  content.push(`<b>Unknown handler:</b> <code>${escapeHtml(handlerName)}</code>`);

  if (suggestion) {
    content.push(`<br/><b>Did you mean:</b> <code>${escapeHtml(suggestion)}()</code>`);
  }

  content.push(`<br/><br/><b>Available handlers:</b>`);
  content.push(`<ul style="margin-top: 4px;">`);
  for (const handler of getAllHandlers()) {
    content.push(`<li><code>${escapeHtml(handler.name)}</code> - ${escapeHtml(handler.description)}</li>`);
  }
  content.push(`</ul>`);

  return content;
}

/**
 * Format an unknown option error with suggestions.
 */
export function formatUnknownOptionError(
  handlerName: string,
  unknownKey: string,
): string[] {
  const content: string[] = [];
  const validKeys = getValidOptionKeys(handlerName);

  content.push(`<b>Unknown option:</b> <code>${escapeHtml(unknownKey)}</code>`);

  const suggestion = suggestClosestOption(unknownKey, validKeys);
  if (suggestion) {
    content.push(`<br/><b>Did you mean:</b> <code>${escapeHtml(suggestion)}</code>`);
  }

  if (validKeys.length > 0) {
    content.push(`<br/><br/><b>Valid options for ${escapeHtml(handlerName)}:</b>`);
    content.push(`<ul style="margin-top: 4px;">`);
    for (const key of validKeys) {
      content.push(`<li><code>${escapeHtml(key)}</code></li>`);
    }
    content.push(`</ul>`);
  }
  else {
    content.push(`<br/><i>${escapeHtml(handlerName)} does not accept any options.</i>`);
  }

  return content;
}

/**
 * Format a type mismatch error.
 */
export function formatTypeMismatchError(
  handlerName: string,
  optionKey: string,
  expected: string,
  actual: string,
): string[] {
  return [
    `<b>Type mismatch for option:</b> <code>${escapeHtml(optionKey)}</code>`,
    `<br/><b>Expected:</b> <code>${escapeHtml(expected)}</code>`,
    `<br/><b>Received:</b> <code>${escapeHtml(actual)}</code>`,
  ];
}

/**
 * Check if an error is an ArkType validation error.
 */
export function isArkTypeError(error: unknown): error is ArkErrors {
  return !!(
    error
    && typeof error === "object"
    && Symbol.iterator in error
    && "summary" in error
  );
}
