import { launch, openPage } from "./browser.mjs";

/** Opens `url` in a fresh headless browser, optionally dark or with reduced motion, and runs `fn`. */
export async function withPage(
	url,
	{ width = 1280, dark = false, reduce = false, settle = 2500, ready = "body" } = {},
	fn,
) {
	const browser = await launch();
	const deadline = setTimeout(() => {
		browser.close();
		process.exit(2);
	}, 120_000);
	try {
		const page = await openPage(browser.port, { width, height: 900 });
		const features = [{ name: "prefers-color-scheme", value: dark ? "dark" : "light" }];
		if (reduce) features.push({ name: "prefers-reduced-motion", value: "reduce" });
		await page.send("Emulation.setEmulatedMedia", { features });
		await page.goto(url);
		// Lazy demos show a loader first; wait for real content, then let entrances finish.
		await page.until(
			`(() => { const el = document.querySelector(${JSON.stringify(ready)}); return !!el && el.children.length > 0 && !/Loading/.test(el.textContent ?? ""); })()`,
			30_000,
		);
		await page.wait(settle);
		// Sites that theme by class (shadcn) ignore the media query, so set the class too.
		await page.evaluate(
			`document.documentElement.classList.toggle("dark", ${dark}); document.documentElement.style.colorScheme = "${dark ? "dark" : "light"}"`,
		);
		await page.wait(300);
		return await fn(page);
	} finally {
		clearTimeout(deadline);
		browser.close();
	}
}

/** In-page helpers, injected once: composited colours and contrast through a 1px canvas. */
export const HELPERS = `(() => {
	if (window.__bui) return;
	const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
	const px = (css, under) => {
		ctx.clearRect(0, 0, 1, 1);
		if (under) { ctx.fillStyle = under; ctx.fillRect(0, 0, 1, 1); }
		ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1);
		return [...ctx.getImageData(0, 0, 1, 1).data];
	};
	const lum = ([r, g, b]) => [r, g, b].map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
	// The first opaque background up the tree; null when a gradient or image sits in the way.
	const backdrop = (el) => {
		const layers = [];
		for (let n = el; n; n = n.parentElement) {
			const cs = getComputedStyle(n);
			if (cs.backgroundImage !== "none") return null;
			const c = cs.backgroundColor;
			if (c && c !== "transparent" && !/rgba\\(\\s*0,\\s*0,\\s*0,\\s*0\\s*\\)/.test(c)) {
				layers.push(c);
				if (px(c)[3] === 255) break;
			}
		}
		let base = "rgb(255,255,255)";
		if (document.documentElement.classList.contains("dark")) base = getComputedStyle(document.body).backgroundColor || "rgb(0,0,0)";
		return layers.reverse().reduce((under, c) => { const p = px(c, under); return "rgb(" + p[0] + "," + p[1] + "," + p[2] + ")"; }, base);
	};
	const ratio = (fg, bg) => { const a = lum(px(fg, bg)), b = lum(px(bg)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
	const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05 && !el.closest("[aria-hidden=true],[inert],.sr-only"); };
	const label = (el) => !el ? "(gone)" : (el.getAttribute("data-slot") || el.tagName.toLowerCase()) + (el.id ? "#" + el.id : "") + " \\"" + (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30) + "\\"";
	window.__bui = { backdrop, ratio, visible, label };
})()`;
