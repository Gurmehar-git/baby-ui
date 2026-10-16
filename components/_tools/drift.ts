import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { specs } from "@baby-ui/registry-schema/components";
import { axesOf } from "./derive";

// Read-only scan: each spec's hand-listed axes against the tv() named after its slug.
const camel = (slug: string) =>
	slug.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
const SRC = resolve(import.meta.dir, "../../packages/ui-react/src");

let compared = 0;
const drifted: string[] = [];
for (const spec of specs) {
	const axes = Object.keys(spec.variants);
	const file = resolve(SRC, spec.slug, "variants.ts");
	if (!axes.length || !existsSync(file)) continue;
	const mod: Record<string, unknown> = await import(file);
	const tvFn = mod[camel(spec.slug)];
	if (!tvFn || typeof tvFn !== "function" || !("variants" in tvFn)) continue;
	const code = axesOf(tvFn as never);
	compared++;
	const diffs = axes.flatMap((axis) => {
		const want = new Set(code[axis] ?? []);
		const listed = spec.variants[axis] ?? [];
		const extra = listed.filter((o) => !want.has(o));
		const missing = [...want].filter((o) => !listed.includes(o));
		return extra.length || missing.length
			? [`${axis}: spec-only [${extra}] code-only [${missing}]`]
			: [];
	});
	if (diffs.length) drifted.push(`${spec.slug}  ${diffs.join("; ")}`);
}
console.log(`compared ${compared} specs, ${drifted.length} drifted`);
for (const line of drifted) console.log(`  ${line}`);
