import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { previousFor, ROOT } from "./core.mjs";
import { autoSpecs } from "./demos.mjs";
import { specFiles } from "./specs.mjs";

const USAGE = join(ROOT, "packages/demos/src/usage");

/** Each spec block by slug, read once per run. */
function specBlocks() {
	const blocks = new Map();
	for (const [, file] of specFiles()) {
		for (const block of readFileSync(file, "utf8").split("defineComponent(").slice(1)) {
			const slug = block.match(/\bslug:\s*"([a-z0-9-]+)"/)?.[1];
			if (slug && !blocks.has(slug)) blocks.set(slug, block);
		}
	}
	return blocks;
}

/** Required props with their spec defaults, read from the spec block of one slug. */
function requiredProps(block) {
	const props = [];
	for (const prop of block?.split(/\n\t\t\{\n/).slice(1) ?? []) {
		const name = prop.match(/\bname:\s*"(\w+)"/)?.[1];
		if (!name || !/\brequired:\s*true/.test(prop)) continue;
		const value = prop.match(
			/\bdefault:\s*("(?:[^"\\]|\\.)*"|'[^']*'|-?[\d.]+|true|false)/,
		)?.[1];
		props.push({
			name,
			value: value === undefined ? undefined : Function(`return (${value})`)(),
		});
	}
	return props;
}

function jsx(name, value) {
	if (typeof value === "string" && !/["{}]/.test(value)) return `${name}="${value}"`;
	return `${name}={${JSON.stringify(value)}}`;
}

/**
 * Usage snippets for auto-demo components that have no hand-written one: the entry component
 * with its required props (spec defaults), as real files so tsc and svelte-check check them.
 */
export function usageFiles(output, report) {
	const generated = previousFor(USAGE);
	report.usageMissing = [];
	const blocks = specBlocks();
	for (const spec of autoSpecs()) {
		const props = requiredProps(blocks.get(spec.slug));
		const missing = props.filter((p) => p.value === undefined).map((p) => p.name);
		if (missing.length) {
			// Only worth reporting when no hand-written usage covers the gap.
			const hand = [
				join(USAGE, "react", `${spec.slug}.tsx`),
				join(USAGE, "svelte", `${spec.slug}.svelte`),
			];
			if (hand.some((path) => !existsSync(path)))
				report.usageMissing.push(`${spec.slug}: ${missing.join(", ")}`);
			continue;
		}
		const attrs = props.map((p) => jsx(p.name, p.value));
		// One line while it fits the formatter's width, else one prop per line.
		const tag = (name, indent) => {
			const inline = `${indent}<${name}${attrs.map((a) => ` ${a}`).join("")} />`;
			if (inline.length <= 90) return inline;
			return [
				`${indent}<${name}`,
				...attrs.map((a) => `${indent}\t${a}`),
				`${indent}/>`,
			].join("\n");
		};
		const reactTag = tag(spec.react, "\t\t");
		const files = [
			[
				join(USAGE, "react", `${spec.slug}.tsx`),
				[
					`import { ${spec.react} } from "@baby-ui/react";`,
					"",
					"export function Example() {",
					reactTag.includes("\n")
						? `\treturn (\n${reactTag}\n\t);`
						: `\treturn ${reactTag.trim()};`,
					"}",
					"",
				].join("\n"),
			],
			[
				join(USAGE, "svelte", `${spec.slug}.svelte`),
				[
					'<script lang="ts">',
					`import { ${spec.svelte} } from "@baby-ui/svelte";`,
					"</script>",
					"",
					tag(spec.svelte, ""),
					"",
				].join("\n"),
			],
		];
		for (const [path, content] of files) {
			// Identical content is ours even without a manifest (fresh checkout); anything else is hand-written.
			if (
				existsSync(path) &&
				!generated.has(path) &&
				readFileSync(path, "utf8") !== content
			)
				continue;
			output.add(path, content, { yieldToHand: true });
		}
	}
}
