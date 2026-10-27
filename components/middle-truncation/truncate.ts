let context: CanvasRenderingContext2D | null = null;

function canvasContext() {
	if (context) return context;
	const canvas = document.createElement("canvas");
	context = canvas.getContext("2d");
	return context;
}

function graphemes(text: string) {
	if (typeof Intl.Segmenter === "undefined") return Array.from(text);
	const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
	return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

export function textMetrics(element: HTMLElement) {
	const style = getComputedStyle(element);
	return {
		font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
		letterSpacing: Number.parseFloat(style.letterSpacing) || 0,
	};
}

function width(text: string, letterSpacing: number) {
	const measurement = canvasContext()?.measureText(text).width ?? 0;
	return measurement + Math.max(0, graphemes(text).length - 1) * letterSpacing;
}

export function truncateMiddle(
	text: string,
	available: number,
	font: string,
	letterSpacing: number,
	ellipsis = "…",
	end?: number,
	minEnd?: number,
) {
	const parts = graphemes(text);
	const measure = (value: string) => {
		const ctx = canvasContext();
		if (ctx) ctx.font = font;
		return width(value, letterSpacing);
	};
	if (available <= 0 || measure(text) <= available) return text;
	if (measure(ellipsis) >= available) return ellipsis;

	const fixedEnd =
		end === undefined ? undefined : Math.min(Math.max(0, end), parts.length);
	let low = 0;
	let high = fixedEnd === undefined ? parts.length : parts.length - fixedEnd;
	let result = ellipsis;
	while (low <= high) {
		const keep = Math.floor((low + high) / 2);
		const tail =
			fixedEnd ??
			Math.min(parts.length - keep, Math.max(Math.ceil(keep / 2), minEnd ?? 0));
		const head = fixedEnd === undefined ? Math.max(0, keep - tail) : keep;
		const candidate = `${parts.slice(0, head).join("")}${ellipsis}${
			tail > 0 ? parts.slice(-tail).join("") : ""
		}`;
		if (measure(candidate) <= available) {
			result = candidate;
			low = keep + 1;
		} else {
			high = keep - 1;
		}
	}
	return result;
}
