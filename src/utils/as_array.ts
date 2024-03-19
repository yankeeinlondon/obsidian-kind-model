/**
 * ensures that the value passed in is an array
 */
export const as_array = <T>(val: T) => {
	return (
		Array.isArray(val) ? val as T : [val]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) as T extends any[] ? T : [T];
}
