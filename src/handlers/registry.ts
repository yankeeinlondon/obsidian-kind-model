/**
 * Handler Registry
 *
 * Central registry for all KM handlers with their ArkType schemas.
 * Used by:
 * - Autocomplete system (Phase 3) to provide handler/option suggestions
 * - Validation system to validate handler parameters
 * - Documentation generation
 *
 * Handlers self-register when their modules are loaded.
 *
 * @module handlers/registry
 */

import type { Type } from "arktype";

/**
 * Metadata about a registered handler.
 * Contains schema information for validation and autocomplete.
 */
export interface HandlerRegistryEntry<
  TScalar = unknown,
  TOptions = unknown,
> {
  /** Handler name (PascalCase, e.g., "BackLinks") */
  name: string;

  /** ArkType schema for scalar (positional) parameters, or null if none/uses TypeToken */
  scalarSchema: Type<TScalar> | null;

  /** ArkType schema for options hash, or null if none */
  optionsSchema: Type<TOptions> | null;

  /**
   * Whether this handler accepts scalar (positional) parameters.
   * - `true`: accepts scalars (either via ArkType schema or TypeToken)
   * - `false`: does not accept scalars (use options hash only)
   */
  acceptsScalars: boolean;

  /** Human-readable description for autocomplete hints */
  description: string;

  /** Example usages for documentation and autocomplete info */
  examples: string[];
}

/**
 * The global handler registry.
 * Handlers register themselves at module load time.
 */
const handlerRegistry = new Map<string, HandlerRegistryEntry>();

/**
 * Register a handler with the registry.
 * Called by handlers during module initialization.
 *
 * @param entry - The handler metadata to register
 *
 * @example
 * ```ts
 * import { type } from "arktype";
 * import { registerHandler } from "./registry";
 *
 * const BackLinksOptions = type({
 *   "dedupe?": "boolean",
 *   "exclude?": "string | string[]",
 * });
 *
 * registerHandler({
 *   name: "BackLinks",
 *   scalarSchema: null,
 *   optionsSchema: BackLinksOptions,
 *   description: "Shows pages that link to the current page",
 *   examples: [
 *     "BackLinks()",
 *     "BackLinks({dedupe: false})",
 *   ],
 * });
 * ```
 */
export function registerHandler<TScalar, TOptions>(
  entry: HandlerRegistryEntry<TScalar, TOptions>,
): void {
  if (handlerRegistry.has(entry.name)) {
    console.warn(`[KM Registry] Handler "${entry.name}" already registered, overwriting.`);
  }
  handlerRegistry.set(entry.name, entry as HandlerRegistryEntry);
}

/**
 * Get metadata for a specific handler by name.
 *
 * @param name - The handler name (case-sensitive)
 * @returns The handler metadata, or undefined if not found
 */
export function getHandlerMetadata(name: string): HandlerRegistryEntry | undefined {
  return handlerRegistry.get(name);
}

/**
 * Get all registered handlers.
 *
 * @returns Array of all handler metadata entries
 */
export function getAllHandlers(): HandlerRegistryEntry[] {
  return Array.from(handlerRegistry.values());
}

/**
 * Get all registered handler names.
 *
 * @returns Array of handler names
 */
export function getHandlerNames(): string[] {
  return Array.from(handlerRegistry.keys());
}

/**
 * Check if a handler is registered.
 *
 * @param name - The handler name to check
 * @returns True if the handler is registered
 */
export function isHandlerRegistered(name: string): boolean {
  return handlerRegistry.has(name);
}

/**
 * Get the count of registered handlers.
 * Useful for debugging and tests.
 *
 * @returns The number of registered handlers
 */
export function getHandlerCount(): number {
  return handlerRegistry.size;
}

/**
 * Clear all registered handlers.
 * Primarily for testing purposes.
 */
export function clearRegistry(): void {
  handlerRegistry.clear();
}

/**
 * Get option keys for a handler's options schema.
 * Used by autocomplete to suggest available options.
 *
 * @param name - The handler name
 * @returns Array of option key names, or empty array if no options
 */
export function getHandlerOptionKeys(name: string): string[] {
  const handler = handlerRegistry.get(name);
  if (!handler?.optionsSchema) {
    return [];
  }

  try {
    // Extract keys from the schema expression
    const expression = handler.optionsSchema.expression;
    if (typeof expression === "string") {
      // Parse keys from expression like "{ dedupe?: boolean, exclude?: string | string[] }"
      const keyMatch = expression.match(/\{([^}]+)\}/);
      if (keyMatch) {
        const content = keyMatch[1];
        // Match key names (with optional ?)
        const keys = content.match(/(\w+)\??:/g);
        if (keys) {
          return keys.map(k => k.replace(/\??:$/, ""));
        }
      }
    }
  }
  catch {
    // If we can't extract keys, return empty array
  }

  return [];
}
