/**
 * FLIP for a reorderable list: record row positions before the array changes,
 * then animate each row from where it was once the DOM has caught up.
 */
export function captureRows(container: HTMLElement, exclude?: string) {
	const first = new Map<string, number>();
	for (const el of container.querySelectorAll<HTMLElement>("[data-flip-key]")) {
		const key = el.dataset.flipKey;
		if (key) first.set(key, el.getBoundingClientRect().top);
	}

	return (duration = 180) => {
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		for (const el of container.querySelectorAll<HTMLElement>("[data-flip-key]")) {
			const key = el.dataset.flipKey;
			if (!key || key === exclude) continue;
			const from = first.get(key);
			if (from === undefined) continue;
			const delta = from - el.getBoundingClientRect().top;
			if (!delta) continue;
			el.animate([{ translate: `0 ${delta}px` }, { translate: "0 0" }], {
				duration,
				easing: "cubic-bezier(0.16, 1, 0.3, 1)",
			});
		}
	};
}
