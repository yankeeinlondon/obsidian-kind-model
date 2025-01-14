/**
 * Validates that the passed in value is a valid URL
 */
export function isValidURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  }
  catch {
    return false;
  }
}
