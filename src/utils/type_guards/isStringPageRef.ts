/**
 * tests to see if the value passed in is:
 * 
 * - a string
 * - starts and ends with `[[` and `]]` respectively
 */
export const isStringPageRef = (v: unknown): v is `[[${string}]]` => {
	return typeof v === "string" && v.startsWith("[[") && v.endsWith("]]")
		? true
		: false;
}
