export const wait = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("wait delay expired")
		}, delay)
	})
}
