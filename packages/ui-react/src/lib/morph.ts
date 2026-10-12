import { tv } from "tailwind-variants";

/**
 * Keeps `frame` as wide as its active child (`data-on="true"`), written as a pixel width so a CSS
 * width transition morphs it. Inactive children should be out of flow, so first paint is right.
 */
export function trackActiveWidth(frame: HTMLElement): () => void {
	const sync = () => {
		const on = frame.querySelector<HTMLElement>(':scope > [data-on="true"]');
		if (on) frame.style.width = `${on.offsetWidth}px`;
	};
	const resize = new ResizeObserver(sync);
	for (const child of frame.children) resize.observe(child);
	const mutation = new MutationObserver(sync);
	mutation.observe(frame, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: ["data-on"],
	});
	sync();
	return () => {
		resize.disconnect();
		mutation.disconnect();
	};
}

/** A stacked swap: the frame clips, faces share one cell and the inactive face is out of flow. */
export const morph = tv({
	slots: {
		frame:
			"relative inline-grid overflow-clip [clip-path:inset(-0.6em_-3px)] transition-[width] duration-(--duration-base) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		face: "col-start-1 row-start-1 w-max whitespace-nowrap transition-[opacity,translate,filter] duration-(--duration-base) ease-[var(--ease-ui-out)] data-[on=false]:absolute data-[on=false]:top-0 data-[on=false]:left-0 data-[on=false]:-translate-y-[0.3em] data-[on=false]:opacity-0 data-[on=false]:blur-[2px] motion-reduce:transition-none",
		icon: "col-start-1 row-start-1 grid place-items-center transition-[opacity,scale,filter] duration-(--duration-fast) ease-[var(--ease-ui-out)] data-[on=false]:scale-60 data-[on=false]:opacity-0 data-[on=false]:blur-[2px] motion-reduce:transition-none",
	},
});
