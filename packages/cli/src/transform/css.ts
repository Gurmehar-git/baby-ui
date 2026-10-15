import postcss, {
	type AtRule,
	type ChildNode,
	type Container,
	type Declaration,
	type Root,
	type Rule,
} from "postcss";
import { isRecord } from "../project/fs.ts";

export type CssVars = Record<string, Record<string, string>>;

export interface CssPatch {
	cssVars?: CssVars;
	css?: Record<string, unknown>;
	/** Styles and themes replace existing variables; components only add missing ones. */
	overwriteVars: boolean;
}

/** Which upstream CLI's stylesheet output to reproduce. */
export type CssDialect = "react" | "svelte";

const BREAK = "---break---";
const AT = /^@([a-zA-Z-]+)\s*(.*)$/;

// shadcn hardcodes two-space indents; shadcn-svelte nests one tab deeper than the parent.
interface Indent {
	rule(parent: Container): string;
	child(parent: Container): string;
	nestedAt(parent: Container): string;
}

const before = (node: Container) => ("raws" in node ? node.raws.before : undefined);
const inferBefore = (parent: Container) =>
	`\n${(before(parent) ?? "").replaceAll("\n", "")}\t`;

const INDENT: Record<CssDialect, Indent> = {
	react: { rule: () => "\n  ", child: () => "\n    ", nestedAt: () => "\n" },
	svelte: {
		rule: inferBefore,
		child: inferBefore,
		nestedAt: (parent) => (parent.type === "root" ? "\n" : inferBefore(parent)),
	},
};

const isAtRule = (node: ChildNode, name: string, params?: string): node is AtRule =>
	node.type === "atrule" &&
	node.name === name &&
	(params === undefined || node.params === params);

const isRule = (node: ChildNode, selector: string): node is Rule =>
	node.type === "rule" && node.selector === selector;

const isDecl = (node: ChildNode, prop: string): node is Declaration =>
	node.type === "decl" && node.prop === prop;

function appendWithBreak(parent: Container, node: ChildNode): void {
	parent.append(node);
	parent.insertBefore(node, postcss.comment({ text: BREAK }));
}

function themeInline(root: Root, dialect: CssDialect): AtRule {
	const found = root.nodes.find(
		(n): n is AtRule =>
			isAtRule(n, "theme") &&
			(n.params === "inline" || (dialect === "svelte" && n.params === "")),
	);
	if (found) return found;
	const created = postcss.atRule({
		name: "theme",
		params: "inline",
		raws: { semicolon: true, between: " ", before: "\n" },
	});
	appendWithBreak(root, created);
	return created;
}

function setDecl(
	parent: Container,
	prop: string,
	value: string,
	overwrite: boolean,
): void {
	const existing = parent.nodes?.find((n) => isDecl(n, prop));
	const decl = postcss.decl({ prop, value, raws: { semicolon: true } });
	if (!existing) parent.append(decl);
	else if (overwrite) existing.replaceWith(decl);
}

const isLocalHsl = (value: string) => {
	if (/^(hsl|rgb|#|oklch)/.test(value)) return false;
	const chunks = value.split(" ");
	return chunks.length === 3 && chunks.slice(1).every((chunk) => chunk.includes("%"));
};

const isColor = (value: string) =>
	/^(hsl|rgb|#|oklch)/.test(value) || value.includes("--color-");

const RADII: Record<string, string> = {
	sm: "calc(var(--radius) * 0.6)",
	md: "calc(var(--radius) * 0.8)",
	lg: "var(--radius)",
	xl: "calc(var(--radius) * 1.4)",
	"2xl": "calc(var(--radius) * 1.8)",
	"3xl": "calc(var(--radius) * 2.2)",
	"4xl": "calc(var(--radius) * 2.6)",
};

function addDarkVariant(root: Root): void {
	if (root.nodes.some((n) => isAtRule(n, "custom-variant"))) return;
	const variant = postcss.atRule({
		name: "custom-variant",
		params: "dark (&:is(.dark *))",
		raws: { semicolon: true, before: "\n" },
	});
	const anchor = root.nodes.filter((n) => isAtRule(n, "import")).at(-1) ?? root.nodes[0];
	if (anchor) root.insertAfter(anchor, variant);
	else root.append(variant);
	root.insertBefore(variant, postcss.comment({ text: BREAK }));
}

function setVars(
	rule: Container,
	vars: Record<string, string>,
	overwrite: boolean,
): void {
	for (const [key, raw] of Object.entries(vars)) {
		let prop = `--${key.replace(/^--/, "")}`;
		if (prop === "--sidebar-background") prop = "--sidebar";
		setDecl(rule, prop, isLocalHsl(raw) ? `hsl(${raw})` : raw, overwrite);
	}
}

// Both CLIs alias each scoped var into @theme, anchored after the theme vars present at start.
function addThemeAliases(root: Root, cssVars: CssVars, dialect: CssDialect): void {
	const names = new Set(Object.values(cssVars).flatMap((vars) => Object.keys(vars)));
	if (!names.size) return;
	const theme = themeInline(root, dialect);
	const has = (prop: string) => theme.nodes?.some((n) => isDecl(n, prop)) === true;
	const anchor = theme.nodes
		?.filter((n) => n.type === "decl" && n.prop.startsWith("--"))
		.at(-1);
	for (const name of names) {
		const value = Object.values(cssVars).find((vars) => vars[name])?.[name];
		if (!value) continue;
		if (name === "radius") {
			for (const [size, radius] of Object.entries(RADII)) {
				if (!has(`--radius-${size}`)) setDecl(theme, `--radius-${size}`, radius, false);
			}
			continue;
		}
		const bare = name.replace(/^--/, "");
		let prop = isLocalHsl(value) || isColor(value) ? `--color-${bare}` : `--${bare}`;
		if (prop === "--color-sidebar-background") prop = "--color-sidebar";
		if (has(prop)) continue;
		const decl = postcss.decl({
			prop,
			value: prop === "--color-sidebar" ? "var(--sidebar)" : `var(--${bare})`,
			raws: { semicolon: true },
		});
		if (anchor) theme.insertAfter(anchor, decl);
		else theme.append(decl);
	}
}

function scopedRule(root: Root, selector: string): Rule {
	const rule = postcss.rule({
		selector,
		nodes: [],
		raws: { semicolon: true, between: " ", before: "\n" },
	});
	appendWithBreak(root, rule);
	return rule;
}

function applyVarsReact(root: Root, cssVars: CssVars, overwrite: boolean): void {
	addDarkVariant(root);
	for (const [scope, vars] of Object.entries(cssVars)) {
		if (scope === "theme") {
			const theme = themeInline(root, "react");
			for (const [key, value] of Object.entries(vars)) {
				setDecl(theme, `--${key.replace(/^--/, "")}`, value, overwrite);
			}
			continue;
		}
		const selector = scope === "light" ? ":root" : `.${scope}`;
		const found = root.nodes.find((n): n is Rule => isRule(n, selector));
		if (!found && !Object.keys(vars).length) continue;
		setVars(found ?? scopedRule(root, selector), vars, overwrite);
	}
	addThemeAliases(root, cssVars, "react");
}

// Upstream matches any rule listing `:root`, so a second install pours light vars into
// `:root, .dark` and reduced-motion blocks; we take exact selectors at top level or `@layer base`.
const isScopeRule = (rule: Rule, selector: string) =>
	rule.selector === selector &&
	(rule.parent?.type === "root" ||
		(rule.parent?.type === "atrule" &&
			"name" in rule.parent &&
			rule.parent.name === "layer" &&
			"params" in rule.parent &&
			rule.parent.params === "base"));

// shadcn-svelte: light then dark, then theme; v4 files only.
function applyVarsSvelte(root: Root, cssVars: CssVars): void {
	const v4 = root.nodes.some((n) => isAtRule(n, "import") || isAtRule(n, "theme"));
	if (v4 && Object.keys(cssVars.dark ?? {}).length) addDarkVariant(root);
	for (const [scope, selector] of [
		["light", ":root"],
		["dark", ".dark"],
	] as const) {
		const vars = cssVars[scope];
		if (!vars) continue;
		let found = false;
		root.walkRules((rule) => {
			if (!isScopeRule(rule, selector)) return;
			found = true;
			setVars(rule, vars, true);
		});
		if (!found && v4) setVars(scopedRule(root, selector), vars, true);
	}
	if (cssVars.theme && v4) {
		const theme = themeInline(root, "svelte");
		for (const [key, value] of Object.entries(cssVars.theme)) {
			setDecl(theme, `--${key.replace(/^--/, "")}`, value, true);
		}
	}
	if (v4 && (cssVars.light || cssVars.dark)) addThemeAliases(root, cssVars, "svelte");
}

function applyEmptyAtRule(
	rule: Rule,
	name: string,
	params: string,
	indent: Indent,
): void {
	if (rule.nodes.some((n) => isAtRule(n, name, params))) return;
	if (name === "apply") {
		const apply = rule.nodes.find((n): n is AtRule => isAtRule(n, "apply"));
		if (apply) {
			apply.params = [...new Set(`${apply.params} ${params}`.split(/\s+/))].join(" ");
			return;
		}
	}
	rule.append(
		postcss.atRule({
			name,
			params,
			raws: { semicolon: true, before: indent.child(rule) },
		}),
	);
}

function processRule(
	parent: Container,
	selector: string,
	properties: unknown,
	indent: Indent,
): void {
	let rule = parent.nodes?.find((n): n is Rule => isRule(n, selector));
	if (!rule) {
		rule = postcss.rule({
			selector,
			raws: { semicolon: true, between: " ", before: indent.rule(parent) },
		});
		parent.append(rule);
	}
	if (typeof properties === "string") {
		const parsed = postcss.parse(`.temp{${properties}}`).first;
		if (parsed?.type !== "rule") return;
		for (const node of parsed.nodes) {
			if (node.type !== "decl") continue;
			const clone = node.clone();
			clone.raws.before = indent.child(rule);
			rule.append(clone);
		}
		return;
	}
	if (!isRecord(properties)) return;
	for (const [prop, value] of Object.entries(properties)) {
		const at = AT.exec(prop);
		if (at?.[1] && isRecord(value) && !Object.keys(value).length) {
			applyEmptyAtRule(rule, at[1], at[2] ?? "", indent);
		} else if (typeof value === "string") {
			const decl = postcss.decl({
				prop,
				value,
				raws: { semicolon: true, before: indent.child(rule) },
			});
			const existing = rule.nodes.find((n) => isDecl(n, prop));
			if (existing) existing.replaceWith(decl);
			else rule.append(decl);
		} else if (isRecord(value)) {
			const nested = prop.startsWith("&")
				? selector.replace(/^([^:]+)/, `$1${prop.slice(1)}`)
				: prop;
			processRule(parent, nested, value, indent);
		}
	}
}

function processAtRule(
	parent: Container,
	name: string,
	params: string,
	properties: unknown,
	indent: Indent,
): void {
	let rule = parent.nodes?.find((n): n is AtRule => isAtRule(n, name, params));
	if (!rule) {
		rule = postcss.atRule({
			name,
			params,
			raws: { semicolon: true, between: " ", before: indent.nestedAt(parent) },
		});
		appendWithBreak(parent, rule);
	}
	if (!isRecord(properties)) return;
	for (const [child, value] of Object.entries(properties)) {
		const at = AT.exec(child);
		if (at?.[1]) processAtRule(rule, at[1], at[2] ?? "", value, indent);
		else processRule(rule, child, value, indent);
	}
}

const unquote = (p: string) =>
	p
		.trim()
		.replace(/\s+/g, " ")
		.replace(/^(["'])(.+)\1$/, "$2");

function addImport(root: Root, params: string, dialect: CssDialect): void {
	const same = (n: AtRule) =>
		dialect === "svelte" ? unquote(n.params) === unquote(params) : n.params === params;
	const imports = root.nodes.filter((n): n is AtRule => isAtRule(n, "import"));
	if (imports.some(same)) return;
	const node = postcss.atRule({ name: "import", params, raws: { semicolon: true } });
	const last = imports.at(-1);
	if (last) {
		node.raws.before = "\n";
		root.insertAfter(last, node);
	} else {
		node.raws.before = "";
		root.prepend(node);
	}
}

function addPlugin(root: Root, params: string): void {
	if (
		root.nodes.some((n) => isAtRule(n, "plugin") && unquote(n.params) === unquote(params))
	) {
		return;
	}
	const quoted = /^["']/.test(params) ? params : `"${params}"`;
	const node = postcss.atRule({
		name: "plugin",
		params: quoted,
		raws: { semicolon: true, before: "\n" },
	});
	const plugin = root.nodes.filter((n) => isAtRule(n, "plugin")).at(-1);
	const imported = root.nodes.filter((n) => isAtRule(n, "import")).at(-1);
	if (plugin) {
		root.insertAfter(plugin, node);
		return;
	}
	if (imported) root.insertAfter(imported, node);
	else root.prepend(node);
	root.insertBefore(node, postcss.comment({ text: BREAK }));
	root.insertAfter(node, postcss.comment({ text: BREAK }));
}

function applyUtility(
	root: Root,
	params: string,
	properties: unknown,
	indent: Indent,
): void {
	let rule = root.nodes.find((n): n is AtRule => isAtRule(n, "utility", params));
	if (!rule) {
		rule = postcss.atRule({
			name: "utility",
			params,
			raws: { semicolon: true, between: " ", before: "\n" },
		});
		appendWithBreak(root, rule);
	}
	if (!isRecord(properties)) return;
	const utility = rule;
	for (const [prop, value] of Object.entries(properties)) {
		const at = AT.exec(prop);
		if (typeof value === "string") {
			const decl = postcss.decl({
				prop,
				value,
				raws: { semicolon: true, before: indent.child(utility) },
			});
			const existing = utility.nodes?.find((n) => isDecl(n, prop));
			if (existing) existing.replaceWith(decl);
			else utility.append(decl);
		} else if (at?.[1] && isRecord(value) && !Object.keys(value).length) {
			const [name, args = ""] = [at[1], at[2]];
			if (!utility.nodes?.some((n) => isAtRule(n, name, args))) {
				utility.append(
					postcss.atRule({
						name,
						params: args,
						raws: { semicolon: true, before: indent.child(utility) },
					}),
				);
			}
		} else if (isRecord(value)) processRule(utility, prop, value, indent);
	}
}

function applyCss(root: Root, css: Record<string, unknown>, dialect: CssDialect): void {
	const indent = INDENT[dialect];
	for (const [selector, properties] of Object.entries(css)) {
		const at = AT.exec(selector);
		if (!at?.[1]) {
			processRule(root, selector, properties, indent);
			continue;
		}
		const name = at[1];
		const params = at[2] ?? "";
		if (name === "import") addImport(root, params, dialect);
		else if (name === "plugin") addPlugin(root, params);
		else if (isRecord(properties) && !Object.keys(properties).length) {
			if (!root.nodes.some((n) => isAtRule(n, name, params))) {
				appendWithBreak(
					root,
					postcss.atRule({ name, params, raws: { semicolon: true } }),
				);
			}
		} else if (name === "keyframes") {
			const theme = themeInline(root, dialect);
			const frames = postcss.atRule({
				name,
				params,
				raws: {
					semicolon: true,
					between: " ",
					before: dialect === "svelte" ? inferBefore(theme) : "\n  ",
				},
			});
			const existing = theme.nodes?.find((n) => isAtRule(n, "keyframes", params));
			if (existing) existing.replaceWith(frames);
			else theme.append(frames);
			if (isRecord(properties)) {
				for (const [step, props] of Object.entries(properties)) {
					processRule(frames, step, props, indent);
				}
			}
		} else if (name === "utility") applyUtility(root, params, properties, indent);
		else if (name === "property") processRule(root, selector, properties, indent);
		else processAtRule(root, name, params, properties, indent);
	}
}

function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
	const out: Record<string, unknown> = { ...a };
	for (const [key, value] of Object.entries(b)) {
		const prev = out[key];
		out[key] = isRecord(prev) && isRecord(value) ? deepMerge(prev, value) : value;
	}
	return out;
}

function mergeVars(patches: readonly CssPatch[]): CssVars {
	const out: CssVars = {};
	for (const patch of patches) {
		for (const [scope, vars] of Object.entries(patch.cssVars ?? {})) {
			out[scope] = { ...out[scope], ...vars };
		}
	}
	return out;
}

/** Applies registry `cssVars` and `css` to a Tailwind v4 stylesheet the way each CLI does. */
export function patchCss(
	source: string,
	patches: readonly CssPatch[],
	dialect: CssDialect = "react",
): string {
	const root = postcss.parse(source);
	if (dialect === "svelte") {
		// shadcn-svelte merges every item first and applies once.
		const vars = mergeVars(patches);
		if (Object.keys(vars).length) applyVarsSvelte(root, vars);
		const css = patches.reduce<Record<string, unknown>>(
			(acc, p) => deepMerge(acc, p.css ?? {}),
			{},
		);
		if (Object.keys(css).length) applyCss(root, css, "svelte");
	} else {
		for (const patch of patches) {
			if (patch.cssVars && Object.keys(patch.cssVars).length) {
				applyVarsReact(root, patch.cssVars, patch.overwriteVars);
			}
			if (patch.css && Object.keys(patch.css).length) applyCss(root, patch.css, "react");
		}
	}
	let output = root.toString();
	const last = root.nodes.at(-1);
	if (last?.type === "atrule" && !last.nodes && !output.trimEnd().endsWith(";")) {
		output = `${output.trimEnd()};`;
	}
	output = output
		.replace(/\/\* ---break--- \*\//g, "")
		.replace(/(\n\s*\n)+/g, "\n\n")
		.trimEnd();
	return source.endsWith("\n") ? `${output}\n` : output;
}
