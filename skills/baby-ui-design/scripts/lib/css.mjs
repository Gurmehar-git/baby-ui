/** Declarations of every top-level rule whose selector list is exactly `selectors`, comments dropped. */
export function declarations(css, selectors) {
	const out = {};
	const want = [...selectors].sort().join(",");
	const rule = /^([^\s@/}][^{]*)\{([\s\S]*?)^\}/gm;
	for (const [, head = "", body = ""] of css.matchAll(rule)) {
		const parts = head.split(",").map((s) => s.trim());
		if (parts.sort().join(",") !== want) continue;
		const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
		for (const [, name = "", value = ""] of clean.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
			out[name] = value.replace(/\s+/g, " ").trim();
	}
	return out;
}

/** Light and dark token maps; dark falls back to light, as `.dark` overrides `:root`. */
export function themes(css) {
	const light = {
		...declarations(css, [":root"]),
		...declarations(css, [":root", ".dark"]),
	};
	const dark = {
		...light,
		...declarations(css, [".dark"]),
		...declarations(css, [":root", ".dark"]),
	};
	return { light, dark };
}

/** Follows `var(--x)` chains to a literal; null when it ends in color-mix or an unknown name. */
export function resolve(vars, name, seen = new Set()) {
	const value = vars[name];
	if (value === undefined || seen.has(name)) return null;
	const ref = value.match(/^var\((--[\w-]+)\)$/);
	if (ref) return resolve(vars, ref[1], new Set([...seen, name]));
	return value.includes("(") && !/^(oklch|rgba?|hsl)\(/.test(value) ? null : value;
}
