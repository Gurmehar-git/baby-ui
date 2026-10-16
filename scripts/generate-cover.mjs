// One-off local generator for the README cover: no Vite/SvelteKit dependency, so it
// runs standalone with `node scripts/generate-cover.mjs`. Re-run whenever the pitch changes.
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "takumi-js";
import { googleFonts } from "takumi-js/helpers";
import { specFiles } from "./gen/specs.mjs";

const root = resolve(import.meta.dirname, "..");
// Retired specs still ship to the registry but no longer count as the library.
const specs = (
	await Promise.all(specFiles().map(([, file]) => readFile(file, "utf8")))
).filter((src) => !/^\s*retired: true,/m.test(src));
const svg = (w, h, body) =>
	`data:image/svg+xml;base64,${Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
	).toString("base64")}`;
const logo = (await readFile(resolve(root, "apps/site/static/logo.svg"), "utf8")).replace(
	"#151515",
	"#0a0a0a",
);
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

// Brand marks in ink, from the same CDN the site hero uses.
const brand = async (slug) =>
	`data:image/svg+xml;base64,${Buffer.from(await (await fetch(`https://cdn.simpleicons.org/${slug}/0a0a0a`)).text()).toString("base64")}`;
const [reactMark, svelteMark] = await Promise.all([brand("react"), brand("svelte")]);

const INK = "#0a0a0a";
const BARS = [38, 52, 44, 66, 58, 74, 62, 86, 70, 92, 80, 100];

// The site's --ease-out, cubic-bezier(0.16, 1, 0.3, 1), with dots at equal time steps.
function easingCurve(w, h) {
	const pad = 14;
	const [x1, y1, x2, y2] = [0.16, 1, 0.3, 1];
	const at = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
	const px = (x) => pad + x * (w - pad * 2);
	const py = (y) => h - pad - y * (h - pad * 2);
	const dots = Array.from({ length: 13 }, (_, i) => i / 12)
		.map((t, i) => {
			const r = i === 12 ? 6 : 3.5;
			return `<circle cx="${px(at(t, x1, x2))}" cy="${py(at(t, y1, y2))}" r="${r}" fill="${INK}" fill-opacity="${0.25 + (i / 12) * 0.75}"/>`;
		})
		.join("");
	return svg(
		w,
		h,
		`<path d="M${px(0)} ${py(0)} L${px(1)} ${py(1)}" stroke="${INK}" stroke-opacity="0.12" stroke-dasharray="4 5" fill="none"/>
		<path d="M${px(0)} ${py(0)} C${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>${dots}`,
	);
}

// Squares that fade out from one corner along a ripple.
function pixelField(w, h) {
	const size = 14;
	const gap = 5;
	const cells = [];
	for (let y = 0; y * (size + gap) < h; y++) {
		for (let x = 0; x * (size + gap) < w; x++) {
			const d = Math.hypot(x, y * 1.3);
			const o = Math.max(0.05, 1 - d / 12 + Math.sin(d * 1.4) * 0.12);
			cells.push(
				`<rect x="${x * (size + gap)}" y="${y * (size + gap)}" width="${size}" height="${size}" rx="4" fill="${INK}" fill-opacity="${o.toFixed(2)}"/>`,
			);
		}
	}
	return svg(w, h, cells.join(""));
}

// Two overlapping rings for the paired ports.
function rings(w, h) {
	const cy = h / 2;
	const r = 46;
	const a = w / 2 - 26;
	const b = w / 2 + 26;
	return svg(
		w,
		h,
		`		<clipPath id="lens"><circle cx="${a}" cy="${cy}" r="${r}"/></clipPath>
		<circle cx="${a}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="2.5"/>
		<circle cx="${b}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="2.5"/>
		<circle cx="${b}" cy="${cy}" r="${r}" fill="${INK}" fill-opacity="0.9" clip-path="url(#lens)"/>`,
	);
}

const css = `
	* { box-sizing: border-box; margin: 0; padding: 0; }
	.root {
		position: relative; display: flex; width: 1280px; height: 640px; overflow: hidden;
		background-color: #f4f4f4; font-family: Inter; color: #0a0a0a;
	}
	.copy { position: absolute; top: 72px; left: 80px; width: 560px; display: flex; flex-direction: column; }
	.brand { display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
	.brand img { width: 36px; height: 36px; }
	.headline { margin-top: 44px; font-size: 54px; font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; }
	.caption { margin-top: 20px; font-size: 22px; line-height: 1.45; color: rgba(10,10,10,0.55); }
	.stats {
		margin-top: 40px; display: flex; align-items: stretch; align-self: flex-start; gap: 40px;
	}
	.stat { display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0; }
	.value { display: flex; align-items: center; height: 30px; font-size: 26px; font-weight: 700; letter-spacing: -0.03em; }
	.name { font-size: 13px; font-weight: 500; color: rgba(10,10,10,0.5); }
	.marks { display: flex; align-items: center; }
	.mark {
		display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px;
		background-color: #ffffff;
	}
	.overlap { margin-left: -8px; }
	.mark img { width: 17px; height: 17px; }

	.stage { position: absolute; top: 98px; left: 664px; width: 576px; display: flex; flex-direction: column; gap: 16px; }
	.row { display: flex; gap: 16px; }
	.card {
		display: flex; flex-direction: column; padding: 20px; border-radius: 18px; background-color: #ffffff;
	}
	.tile { display: flex; align-items: center; justify-content: center; padding: 0; overflow: hidden; }
	.label { font-size: 13px; font-weight: 500; color: rgba(10,10,10,0.5); }
	.big { margin-top: 6px; font-size: 32px; font-weight: 700; letter-spacing: -0.03em; }
	.bars { display: flex; align-items: flex-end; gap: 7px; height: 96px; margin-top: 16px; }
	.bar { width: 15px; border-radius: 5px 5px 2px 2px; background-color: #0a0a0a; }
`;

const html = `
	<div class="root">
		<div class="stage">
			<div class="row">
				<div class="card tile" style="width: 280px; height: 214px;"><img src="${easingCurve(252, 186)}" /></div>
				<div class="card tile" style="width: 280px; height: 214px;"><img src="${pixelField(246, 180)}" /></div>
			</div>
			<div class="row">
				<div class="card" style="width: 310px; height: 214px;">
					<span class="label">Revenue</span>
					<span class="big">$48,210</span>
					<div class="bars">${BARS.map((h) => `<span class="bar" style="height: ${h}%;"></span>`).join("")}</div>
				</div>
				<div class="card tile" style="width: 250px; height: 214px;"><img src="${rings(250, 214)}" /></div>
			</div>
		</div>
		<div class="copy">
			<div class="brand"><img src="${logoSrc}" />Baby UI</div>
			<div class="headline">Animated, accessible components for React and Svelte.</div>
			<div class="caption">Copy-paste through the shadcn CLI. One token layer, every component in both frameworks.</div>
			<div class="stats">
				<div class="stat"><span class="value">${Math.floor(specs.length / 10) * 10}+</span><span class="name">Components</span></div>
				<div class="stat">
					<span class="value marks"><span class="mark"><img src="${reactMark}" /></span><span class="mark overlap"><img src="${svelteMark}" /></span></span>
					<span class="name">Two ports, one spec</span>
				</div>
				<div class="stat"><span class="value">Apache-2.0</span><span class="name">Open source</span></div>
			</div>
		</div>
	</div>
`;

const fonts = await googleFonts({
	families: [{ name: "Inter", weight: [400, 500, 600, 700] }],
});

const png = await render(html, { width: 1280, height: 640, css, fonts });

const outPath = resolve(root, ".github/assets/cover.png");
await writeFile(outPath, png);
console.log(`Wrote ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
