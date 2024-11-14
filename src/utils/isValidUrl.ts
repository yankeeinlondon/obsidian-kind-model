/**
 * Validates that the passed in value is a valid URL
 */
export const isValidURL = (str: string): boolean => {
	try {
	  new URL(str);
	  return true;
	} catch (_) {
	  return false;
	}
}
