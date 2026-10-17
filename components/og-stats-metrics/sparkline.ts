export const AREA_W = 820;
export const AREA_H = 440;

/** Maps values onto the backdrop box: `line` for a polyline, `area` closes it to the bottom edge. */
export function sparklinePath(values: number[], w = AREA_W, h = AREA_H) {
	if (values.length < 2) return null;
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const round = (n: number) => Math.round(n * 10) / 10;
	const x = (i: number) => round((i / (values.length - 1)) * w);
	// Low point near the bottom edge keeps the line under the text on the left; peak sits a sixth down.
	const y = (v: number) => round(h * 0.92 - ((v - min) / span) * h * 0.74);
	const line = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
	return { line, area: `${line} ${w},${h} 0,${h}` };
}
