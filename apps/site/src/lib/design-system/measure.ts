/** sRGB bytes for any CSS colour, resolved by the browser (tokens, color-mix, oklch, alpha). */
function rgba(css: string, probe: CanvasRenderingContext2D, under?: string): number[] {
	probe.clearRect(0, 0, 1, 1);
	if (under) {
		probe.fillStyle = under;
		probe.fillRect(0, 0, 1, 1);
	}
	probe.fillStyle = css;
	probe.fillRect(0, 0, 1, 1);
	return [...probe.getImageData(0, 0, 1, 1).data];
}

function luminance([r = 0, g = 0, b = 0]: number[]): number {
	const lin = (c: number) => {
		const s = c / 255;
		return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Reads `--name` through a probe element, so var() and color-mix() come back resolved. */
export function tokenColor(name: string, host: HTMLElement): string {
	const el = document.createElement("span");
	el.style.color = `var(${name})`;
	host.append(el);
	const value = getComputedStyle(el).color;
	el.remove();
	return value;
}

let ctx: CanvasRenderingContext2D | null = null;

/** WCAG contrast of `fg` composited over `bg` (alpha foregrounds are blended first). */
export function contrast(fg: string, bg: string): number {
	ctx ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
	if (!ctx) return 0;
	const back = rgba(bg, ctx);
	const front = rgba(fg, ctx, bg);
	const [a, b] = [luminance(front), luminance(back)].sort((x, y) => y - x);
	return ((a ?? 0) + 0.05) / ((b ?? 0) + 0.05);
}

/** Calls `run` now and whenever the theme class or size of `node` changes. */
export function watchLayout(node: HTMLElement, run: () => void): () => void {
	run();
	const sizes = new ResizeObserver(run);
	sizes.observe(node);
	const theme = new MutationObserver(run);
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style", "data-theme"],
	});
	return () => {
		sizes.disconnect();
		theme.disconnect();
	};
}
