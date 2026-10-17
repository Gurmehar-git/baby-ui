/** Computed styles compared per part; layout and type, not anything a demo's content sizes. */
export const STYLE_PROPS = [
	"display",
	"position",
	"flex-direction",
	"align-items",
	"justify-content",
	"gap",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"border-top-width",
	"border-top-left-radius",
	"font-size",
	"font-weight",
	"line-height",
	"color",
	"background-color",
	"opacity",
];

/**
 * Runs in the page: every rendered `data-slot` part (portaled overlays included) with its tag,
 * role and ARIA, size and styles, plus interactive elements that have no accessible name.
 */
export const SNAPSHOT = `(() => {
	const PROPS = ${JSON.stringify(STYLE_PROPS)};
	// Values that hold generated ids differ per render; only their presence is comparable.
	const REF = /^aria-(controls|labelledby|describedby|owns|activedescendant|details|errormessage)$/;
	// A collapsed panel (0fr grid row) has width but no height; it is not shown.
	const shown = (el) => {
		const r = el.getBoundingClientRect();
		const s = getComputedStyle(el);
		return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
	};
	const INTERACTIVE = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=radio], [role=switch], [role=slider], [role=combobox], [role=option]';
	const nameOf = (el) => {
		const by = el.getAttribute("aria-labelledby");
		const labelled = by ? by.split(/\\s+/).map((id) => document.getElementById(id)?.textContent ?? "").join(" ") : "";
		const label = el.id ? document.querySelector('label[for="' + CSS.escape(el.id) + '"]')?.textContent ?? "" : "";
		const wrap = el.closest("label")?.textContent ?? "";
		const alt = [...el.querySelectorAll("img[alt], svg[aria-label]")].map((i) => i.getAttribute("alt") ?? i.getAttribute("aria-label")).join(" ");
		return [el.getAttribute("aria-label"), labelled, label, wrap, el.textContent, el.getAttribute("title"), el.getAttribute("placeholder"), alt]
			.map((t) => (t ?? "").trim())
			.find(Boolean) ?? "";
	};
	const FIELD = 'input:not([type=hidden]), select, textarea, [role=checkbox], [role=switch], [role=slider], [role=combobox], [role=textbox], [role=radio]';
	const IMPLICIT = { button: "button", nav: "navigation", ul: "list", ol: "list", li: "listitem", dialog: "dialog", table: "table", hr: "separator", progress: "progressbar" };
	// "false" is these attributes' default, so it says nothing that leaving them out doesn't.
	const DEFAULT_FALSE = /^aria-(disabled|required|readonly|invalid|busy|hidden|multiselectable)$/;
	const ORIENTATION = { menu: "vertical", listbox: "vertical", tablist: "horizontal", toolbar: "horizontal", slider: "horizontal", separator: "horizontal", menubar: "horizontal" };
	// The name a screen reader announces; aria-label and a linked label are two ways to one name.
	const NAMED = /^aria-(label|labelledby)$/;
	// Semantics, not markup: <h3> and <div role="heading" aria-level="3"> are the same thing.
	const semantics = (el) => {
		const tag = el.tagName.toLowerCase();
		const heading = /^h([1-6])$/.exec(tag);
		const out = {};
		const role = el.getAttribute("role") ?? (heading ? "heading" : tag === "a" && el.hasAttribute("href") ? "link" : IMPLICIT[tag]);
		const hidden = el.getAttribute("aria-hidden") === "true";
		if (role && !(hidden && (role === "presentation" || role === "none"))) out.role = role;
		if (heading) out["aria-level"] = heading[1];
		for (const a of el.attributes) {
			if (!a.name.startsWith("aria-") || NAMED.test(a.name)) continue;
			if (DEFAULT_FALSE.test(a.name) && a.value === "false") continue;
			if (a.name === "aria-orientation" && ORIENTATION[role] === a.value) continue;
			out[a.name] = REF.test(a.name) ? "<ref>" : a.value;
		}
		// Labels only: a button's or day's text is demo copy, and date libraries word days differently.
		if (el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby") || el.matches(FIELD))
			out.name = nameOf(el).replace(/\\s+/g, "");
		return out;
	};
	const canvas = document.createElement("canvas").getContext("2d");
	// Colours compare as sRGB: oklab(0 0 0 / 0) and rgba(0, 0, 0, 0) are both transparent.
	const colour = (value) => {
		if (!canvas || !/^(rgb|oklab|oklch|lab|lch|color|hsl|#)/.test(value)) return value;
		canvas.fillStyle = "#000";
		canvas.fillStyle = value;
		const c = canvas.fillStyle;
		return /rgba\\(\\d+, \\d+, \\d+, 0\\)/.test(c) ? "transparent" : c;
	};
	const parts = [...document.querySelectorAll("[data-slot]")].filter(shown).map((el) => {
		const s = getComputedStyle(el);
		const r = el.getBoundingClientRect();
		const aria = semantics(el);
		const style = {};
		for (const p of PROPS) style[p] = colour(s.getPropertyValue(p));
		return { slot: el.dataset.slot, tag: el.tagName.toLowerCase(), aria, w: Math.round(r.width), h: Math.round(r.height), style };
	});
	const unnamed = [...document.querySelectorAll(INTERACTIVE)]
		.filter((el) => shown(el) && !el.closest("[aria-hidden=true], [inert]") && !nameOf(el))
		.map((el) => el.dataset.slot ?? el.getAttribute("role") ?? el.tagName.toLowerCase());
	return { parts, unnamed };
})()`;

const PX = /^(-?[\d.]+)px$/;
// Sub-pixel rounding differs between the ports' markup; a pixel either way is the same design.
const sameValue = (a, b) => {
	if (a === b) return true;
	const [x, y] = [PX.exec(a), PX.exec(b)];
	return Boolean(x && y && Math.abs(Number(x[1]) - Number(y[1])) <= 1);
};

/**
 * Differences between the React and Svelte snapshots of one state. `error` breaks parity (a part
 * missing, different ARIA, an unnamed control in one port); `warn` is a styling or size drift.
 */
export function compareSnapshots(react, svelte, state = "rest") {
	const issues = [];
	const add = (level, message) => issues.push({ level, state, message });
	const bySlot = (snapshot) => {
		const map = new Map();
		for (const part of snapshot.parts)
			map.set(part.slot, [...(map.get(part.slot) ?? []), part]);
		return map;
	};
	const [r, s] = [bySlot(react), bySlot(svelte)];
	for (const slot of new Set([...r.keys(), ...s.keys()])) {
		const [a = [], b = []] = [r.get(slot), s.get(slot)];
		if (a.length !== b.length) {
			add("error", `${slot}: ${a.length} in React, ${b.length} in Svelte`);
			continue;
		}
		a.forEach((x, i) => {
			const y = b[i];
			const at = a.length > 1 ? `${slot}[${i}]` : slot;
			// Tags differ freely (<h3> vs a div with role heading); the effective role is compared.
			for (const key of new Set([...Object.keys(x.aria), ...Object.keys(y.aria)]))
				if (x.aria[key] !== y.aria[key])
					add(
						"error",
						`${at}: ${key} is ${x.aria[key] ?? "unset"} in React, ${y.aria[key] ?? "unset"} in Svelte`,
					);
			const styles = Object.keys(x.style).filter(
				(p) => !sameValue(x.style[p], y.style[p]),
			);
			for (const p of styles) add("warn", `${at}: ${p} ${x.style[p]} vs ${y.style[p]}`);
			if (Math.abs(x.w - y.w) > 2 || Math.abs(x.h - y.h) > 2)
				add("warn", `${at}: ${x.w}x${x.h} in React, ${y.w}x${y.h} in Svelte`);
		});
	}
	for (const [port, snap] of [
		["React", react],
		["Svelte", svelte],
	])
		for (const what of snap.unnamed)
			add("error", `${port}: a ${what} has no accessible name`);
	return issues;
}
