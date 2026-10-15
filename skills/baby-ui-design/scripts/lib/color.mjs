const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** OKLCH (L 0..1) to gamma sRGB 0..1, clipped to the gamut like a browser. */
export function oklchToRgb(L, C = 0, h = 0) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map((v) => clamp01(unlin(v)));
}

/** A CSS colour literal to { rgb: [0..1 x3], alpha, oklch? }; null for anything it can't resolve. */
export function parseColor(text) {
	const value = text.trim().toLowerCase();
	const hex = value.match(/^#([0-9a-f]{3,8})$/);
	if (hex) {
		let h = hex[1];
		if (h.length <= 4) h = [...h].map((c) => c + c).join("");
		const n = (i) => Number.parseInt(h.slice(i, i + 2), 16) / 255;
		return { rgb: [n(0), n(2), n(4)], alpha: h.length === 8 ? n(6) : 1 };
	}
	const ok = value.match(
		/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/,
	);
	if (ok) {
		const L = Number(ok[1]) / (ok[2] ? 100 : 1);
		const alpha = ok[5] === undefined ? 1 : Number(ok[5]) / (ok[6] ? 100 : 1);
		return {
			rgb: oklchToRgb(L, Number(ok[3]), Number(ok[4])),
			alpha,
			oklch: [L, Number(ok[3]), Number(ok[4])],
		};
	}
	const rgb = value.match(
		/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%?))?\s*\)$/,
	);
	if (rgb) {
		const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]) / (rgb[5] ? 100 : 1);
		return { rgb: [rgb[1], rgb[2], rgb[3]].map((v) => Number(v) / 255), alpha };
	}
	return null;
}

/** `top` laid over an opaque `under`, both from parseColor. */
export const over = (top, under) => ({
	rgb: top.rgb.map((v, i) => v * top.alpha + under.rgb[i] * (1 - top.alpha)),
	alpha: 1,
});

export function luminance({ rgb }) {
	const [r, g, b] = rgb.map(lin);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast; a translucent foreground is composited over the background first. */
export function contrast(fg, bg) {
	const front = fg.alpha < 1 ? over(fg, bg) : fg;
	const [a, b] = [luminance(front), luminance(bg)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
}
