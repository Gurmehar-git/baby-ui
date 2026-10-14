import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(
	new URL("../packages/tokens/src/tokens.css", import.meta.url),
	"utf8",
);

function block(selector) {
	const body = css.match(
		new RegExp(`^${selector.replace(".", "\\.")} \\{([\\s\\S]*?)^\\}`, "m"),
	)?.[1];
	assert.ok(body, `${selector} block`);
	return Object.fromEntries(
		[...body.matchAll(/(--[\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g)].map(
			([, name, l, c, h]) => [name, [Number(l) / 100, Number(c), Number(h)]],
		),
	);
}

const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const unlin = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function luminance([L, C, h]) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const rgb = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map((v) => lin(Math.min(1, Math.max(0, unlin(v)))));
	return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

const ratio = (x, y) => {
	const [a, b] = [luminance(x), luminance(y)].sort((p, q) => q - p);
	return (a + 0.05) / (b + 0.05);
};

const light = block(":root");
const dark = { ...light, ...block(".dark") };
const STEPS = ["--background", "--card", "--muted", "--segment"];
const SURFACES = [...STEPS, "--popover"];

test("dark surfaces climb in visible steps", () => {
	for (let i = 1; i < STEPS.length; i++) {
		const r = ratio(dark[STEPS[i]], dark[STEPS[i - 1]]);
		assert.ok(r >= 1.07, `${STEPS[i]} over ${STEPS[i - 1]}: ${r.toFixed(2)}:1`);
	}
	assert.deepEqual(dark["--secondary"], dark["--muted"], "secondary is the muted step");
});

test("dark popover stays near the page, so chips and secondary buttons stand out inside it", () => {
	const [l] = dark["--popover"];
	assert.ok(l >= dark["--background"][0] && l <= dark["--card"][0], `--popover L ${l}`);
	const r = ratio(dark["--muted"], dark["--popover"]);
	assert.ok(r >= 1.15, `--muted inside --popover: ${r.toFixed(2)}:1`);
});

test("secondary text clears 4.5:1 on every surface, both modes", () => {
	for (const [mode, t] of [
		["light", light],
		["dark", dark],
	])
		for (const s of SURFACES.filter((n) => n !== "--segment")) {
			const r = ratio(t["--muted-foreground"], t[s]);
			assert.ok(r >= 4.5, `${mode} --muted-foreground on ${s}: ${r.toFixed(2)}:1`);
		}
});

test("dark neutrals share one hue, so no surface reads warmer or greyer than its neighbours", () => {
	for (const s of SURFACES) {
		const [, c, h] = dark[s];
		assert.ok(c > 0 && c <= 0.004 && h === 265, `${s} is oklch(_ ${c} ${h})`);
	}
});
