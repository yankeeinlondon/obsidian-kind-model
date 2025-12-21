/**
 * Shared parsing utilities for KM codeblock context detection.
 * Used by both autocomplete and linter (Phase 3 and 4).
 */

/**
 * Represents the current parsing context within a KM codeblock.
 */
export interface ParseContext {
  /** The handler name if detected, e.g., "BackLinks" */
  handlerName: string | null;
  /** Whether the cursor is inside the handler's parentheses */
  isInsideParens: boolean;
  /** Whether the cursor is inside an options hash `{}` */
  isInsideOptionsHash: boolean;
  /** The current option key being typed (if any) */
  currentOptionKey: string | null;
  /** Whether the cursor is inside a string literal */
  isInsideString: boolean;
  /** Current position/offset in the text */
  cursorOffset: number;
  /** Any scalar arguments before the options hash */
  scalarArgs: string[];
}

/**
 * Parse the context at a specific cursor position within KM block text.
 *
 * @param text - The full text content up to the cursor
 * @param cursorPos - The cursor position within the text
 * @returns The parsing context
 */
export function parseKmContext(text: string, cursorPos: number): ParseContext {
  const result: ParseContext = {
    handlerName: null,
    isInsideParens: false,
    isInsideOptionsHash: false,
    currentOptionKey: null,
    isInsideString: false,
    cursorOffset: cursorPos,
    scalarArgs: [],
  };

  // Get handler name (starts with capital letter, followed by optional chars before paren)
  const handlerMatch = text.match(/^([A-Z][a-zA-Z]*)/);
  if (handlerMatch) {
    result.handlerName = handlerMatch[1];
  }

  // Track parentheses and braces depth
  let parenDepth = 0;
  let braceDepth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;

  for (let i = 0; i < cursorPos && i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : "";

    // Handle escape sequences
    if (prevChar === "\\") {
      continue;
    }

    // Handle string state
    if (char === "'" && !inDoubleQuote && !inTemplate) {
      inSingleQuote = !inSingleQuote;
    }
    else if (char === "\"" && !inSingleQuote && !inTemplate) {
      inDoubleQuote = !inDoubleQuote;
    }
    else if (char === "`" && !inSingleQuote && !inDoubleQuote) {
      inTemplate = !inTemplate;
    }

    // Skip counting brackets inside strings
    if (inSingleQuote || inDoubleQuote || inTemplate) {
      continue;
    }

    // Track bracket depth
    if (char === "(") {
      parenDepth++;
    }
    else if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    }
    else if (char === "{") {
      braceDepth++;
    }
    else if (char === "}") {
      braceDepth = Math.max(0, braceDepth - 1);
    }
  }

  result.isInsideString = inSingleQuote || inDoubleQuote || inTemplate;
  result.isInsideParens = parenDepth > 0;
  result.isInsideOptionsHash = braceDepth > 0;

  // Extract current option key if inside options hash
  if (result.isInsideOptionsHash && !result.isInsideString) {
    const optionKeyMatch = extractCurrentOptionKey(text, cursorPos);
    result.currentOptionKey = optionKeyMatch;
  }

  // Extract scalar args (text between first paren and options hash or closing paren)
  result.scalarArgs = extractScalarArgs(text);

  return result;
}

/**
 * Extract the option key being typed at the cursor position.
 */
function extractCurrentOptionKey(text: string, cursorPos: number): string | null {
  // Look backwards from cursor to find the start of the current key
  let keyStart = cursorPos;
  while (keyStart > 0) {
    const char = text[keyStart - 1];
    if (char === "{" || char === "," || char === ":" || /\s/.test(char)) {
      break;
    }
    keyStart--;
  }

  const potentialKey = text.slice(keyStart, cursorPos).trim();

  // Only return if it looks like a key (alphanumeric, not a value)
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(potentialKey)) {
    return potentialKey;
  }

  return null;
}

/**
 * Extract scalar arguments from handler invocation.
 */
function extractScalarArgs(text: string): string[] {
  const args: string[] = [];

  // Find the content between handler name and options hash or end
  const parenMatch = text.match(/^[A-Z][a-zA-Z]*\((.*)$/);
  if (!parenMatch) {
    return args;
  }

  const argsContent = parenMatch[1];

  // Find where options hash starts (if any)
  let optionsStart = -1;
  let parenDepth = 0;
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < argsContent.length; i++) {
    const char = argsContent[i];
    const prevChar = i > 0 ? argsContent[i - 1] : "";

    if (prevChar !== "\\" && (char === "\"" || char === "'")) {
      if (!inString) {
        inString = true;
        stringChar = char;
      }
      else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (char === "(") {
        parenDepth++;
      }
      else if (char === ")") {
        parenDepth--;
      }
      else if (char === "{" && parenDepth === 0) {
        optionsStart = i;
        break;
      }
    }
  }

  // Extract the scalar portion
  const scalarPortion = optionsStart >= 0
    ? argsContent.slice(0, optionsStart)
    : argsContent.replace(/\)$/, "");

  // Split by comma, respecting strings
  const parts = splitByComma(scalarPortion);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) {
      args.push(trimmed);
    }
  }

  return args;
}

/**
 * Split a string by commas, respecting string literals.
 */
function splitByComma(text: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : "";

    if (prevChar !== "\\" && (char === "\"" || char === "'")) {
      if (!inString) {
        inString = true;
        stringChar = char;
      }
      else if (char === stringChar) {
        inString = false;
      }
    }

    if (char === "," && !inString) {
      parts.push(current);
      current = "";
    }
    else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

/**
 * Check if cursor is at the start of a line (before any handler name).
 */
export function isAtLineStart(text: string): boolean {
  return text.trim().length === 0 || /^[A-Z]*$/.test(text.trim());
}

/**
 * Check if the text indicates we're inside an options hash.
 */
export function isInsideOptionsHash(text: string): boolean {
  const ctx = parseKmContext(text, text.length);
  return ctx.isInsideOptionsHash;
}

/**
 * Get the handler name from context.
 */
export function getHandlerFromContext(text: string): string | null {
  const ctx = parseKmContext(text, text.length);
  return ctx.handlerName;
}

/**
 * Get the start position for option completion.
 */
export function getOptionStart(cursorPos: number, text: string): number {
  // Look backwards to find the start of the current word
  let start = cursorPos;
  while (start > 0) {
    const char = text[start - 1];
    if (!/[a-zA-Z0-9_]/.test(char)) {
      break;
    }
    start--;
  }
  return start;
}

/**
 * Determine if we should show handler completions (at start of line).
 */
export function shouldShowHandlerCompletions(text: string): boolean {
  const trimmed = text.trim();
  // Show handlers if nothing typed yet or typing a partial handler name
  return trimmed.length === 0 || /^[A-Z][a-zA-Z]*$/.test(trimmed);
}

/**
 * Determine if we should show option key completions.
 */
export function shouldShowOptionKeyCompletions(ctx: ParseContext): boolean {
  return ctx.isInsideOptionsHash
    && !ctx.isInsideString
    && ctx.currentOptionKey !== null;
}

/**
 * Check if we're after a colon (expecting a value).
 */
export function isExpectingValue(text: string): boolean {
  // Look for pattern like "key:" or "key: " at end
  return /:\s*$/.test(text.trim());
}

/**
 * Get the option key we're providing a value for.
 */
export function getOptionKeyForValue(text: string): string | null {
  const match = text.match(/([a-zA-Z_][a-zA-Z0-9_]*):\s*$/);
  return match ? match[1] : null;
}
