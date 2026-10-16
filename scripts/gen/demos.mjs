import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";
import { exportsOf } from "./exports.mjs";
import { pascal } from "./indexes.mjs";
import { specFiles } from "./specs.mjs";

const DEMOS = join(ROOT, "packages/demos/src");
const SAMPLES = join(DEMOS, "data/samples.ts");

/** Every spec that opted into `demo: { mode: "auto" }`, with its entry names and frame. */
export function autoSpecs() {
	const out = [];
	for (const [, file] of specFiles()) {
		for (const block of readFileSync(file, "utf8").split("defineComponent(").slice(1)) {
			const slug = block.match(/\bslug:\s*"([a-z0-9-]+)"/)?.[1];
			const demo = block.match(/\bdemo:\s*\{\s*mode:\s*"auto"(?:,\s*frame:\s*"(\w+)")?/);
			if (!slug || !demo) continue;
			const entries = [...block.matchAll(/\bentry:\s*"(\w+)"/g)].map((m) => m[1]);
			out.push({
				slug,
				frame: demo[1] ?? "none",
				react: entries[0],
				svelte: entries[1] ?? entries[0],
			});
		}
	}
	return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

const FRAMES = {
	og: {
		svelte: ['import OgFrame from "../og-frame.svelte";', "<OgFrame>", "</OgFrame>"],
		react: ['import { OgFrame } from "../og-frame";', "<OgFrame>", "</OgFrame>"],
	},
};
function frameFor(frame, port) {
	if (frame === "none") return ["", "", ""];
	if (FRAMES[frame]) return FRAMES[frame][port];
	return port === "svelte"
		? [
				'import DemoFrame from "../demo-frame.svelte";',
				`<DemoFrame size="${frame}">`,
				"</DemoFrame>",
			]
		: [
				'import { DemoFrame } from "../demo-frame";',
				`<DemoFrame size="${frame}">`,
				"</DemoFrame>",
			];
}

/** Writes both demos for auto specs without a hand-written one in that port. The sample is also
 * assigned to `Partial<Props>`, so a sample that drifts from the component fails the typecheck. */
export function autoDemos(output, report) {
	const sampleNames = new Set(exportsOf(SAMPLES).map((n) => n.name));
	const handReact = new Set(
		readdirSync(join(DEMOS, "react"))
			.filter((f) => f.endsWith(".tsx") && f !== "index.tsx")
			.flatMap((f) =>
				exportsOf(join(DEMOS, "react", f)).map((n) => n.name.toLowerCase()),
			),
	);
	report.autoSvelte = [];
	report.autoReact = [];
	for (const spec of autoSpecs()) {
		const sample = spec.slug.toUpperCase().replaceAll("-", "_");
		const hasSample = sampleNames.has(sample);
		const imports = [
			"controlProps",
			"SAMPLE_BY_PROPS",
			...(hasSample ? [`${sample} as sample`] : []),
		];
		const sampleLine = hasSample ? "" : "const sample = {};";

		if (!existsSync(join(DEMOS, "svelte", `${spec.slug}-demo.svelte`))) {
			const [frameImport, open, close] = frameFor(spec.frame, "svelte");
			const path = join(DEMOS, "svelte/auto", `${spec.slug}-demo.svelte`);
			output.add(
				path,
				[
					'<script lang="ts">',
					`import { ${spec.svelte} } from "@baby-ui/svelte";`,
					'import type { ComponentProps } from "svelte";',
					`import { ${imports.join(", ")} } from "../../data/samples";`,
					frameImport,
					"",
					"let { props = {} }: { props?: Record<string, unknown> } = $props();",
					`type Props = ComponentProps<typeof ${spec.svelte}>;`,
					sampleLine,
					"const checked: Partial<Props> = sample;",
					`const derived = $derived(SAMPLE_BY_PROPS["${spec.slug}"]?.(props) ?? {});`,
					"</script>",
					"",
					open,
					`<${spec.svelte} {...checked} {...derived} {...controlProps<Props>(props)} />`,
					close,
					"",
				]
					.filter((line, i, all) => line !== "" || all[i - 1] !== "")
					.join("\n"),
			);
			report.autoSvelte.push([
				spec.slug,
				`() => import("./auto/${spec.slug}-demo.svelte")`,
			]);
		}

		const demoName = `${pascal(spec.slug)}Demo`;
		if (!handReact.has(demoName.toLowerCase())) {
			const [frameImport, open, close] = frameFor(spec.frame, "react");
			output.add(
				join(DEMOS, "react/auto", `${spec.slug}.tsx`),
				[
					'"use client";',
					"",
					`import { ${spec.react} } from "@baby-ui/react";`,
					'import type { ComponentProps } from "react";',
					`import { ${imports.join(", ")} } from "../../data/samples";`,
					frameImport,
					"",
					`type Props = ComponentProps<typeof ${spec.react}>;`,
					sampleLine,
					"const checked: Partial<Props> = sample;",
					"",
					`export function ${demoName}({ props }: { props: Record<string, unknown> }) {`,
					`\tconst derived = SAMPLE_BY_PROPS["${spec.slug}"]?.(props) ?? {};`,
					"\treturn (",
					open ? `\t\t${open}` : "",
					`\t\t\t<${spec.react} {...checked} {...derived} {...controlProps<Props>(props)} />`,
					close ? `\t\t${close}` : "",
					"\t);",
					"}",
					"",
				]
					.filter((line, i, all) => line !== "" || all[i - 1] !== "")
					.join("\n"),
			);
			report.autoReact.push([spec.slug, demoName, `./auto/${spec.slug}`]);
		}
	}
}
