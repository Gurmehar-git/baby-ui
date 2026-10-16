/**
 * Glides `pill` to whichever row carries `data-highlighted`, and fades it when none does. The
 * first highlight after a fade jumps into place instead of sliding from the last one.
 */
export function glideHighlight(list: HTMLElement, pill: HTMLElement): () => void {
	let shown = false;
	const sync = () => {
		const row = list.querySelector<HTMLElement>("[data-highlighted]");
		if (!row) {
			shown = false;
			pill.style.opacity = "0";
			return;
		}
		if (!shown) pill.style.transitionProperty = "opacity";
		pill.style.translate = `0 ${row.offsetTop}px`;
		pill.style.height = `${row.offsetHeight}px`;
		pill.style.opacity = "1";
		if (!shown) {
			pill.getBoundingClientRect();
			pill.style.transitionProperty = "";
		}
		shown = true;
	};
	const observer = new MutationObserver(sync);
	observer.observe(list, {
		subtree: true,
		attributes: true,
		attributeFilter: ["data-highlighted"],
	});
	sync();
	return () => observer.disconnect();
}
