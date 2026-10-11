import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
	type ComponentSpec,
	FRAMEWORKS,
	type Framework,
	PREVIEW_CATEGORIES,
	type RegistryItem,
} from "@baby-ui/registry-schema";
import { specs } from "@baby-ui/registry-schema/components";
import { buildItem, toJsItem } from "./build";
import { cssText } from "./component-css";
import {
	FRAMEWORK,
	ISOLATED,
	OUT_DIR,
	REGISTRY_NAME,
	REGISTRY_URL,
	REPO_ROOT,
	SITE_URL,
} from "./config";
import { type InstallLayout, installLayout } from "./layout";
import { buildThirdPartyLicenses } from "./licenses";
import { buildLlmsTxt } from "./llms";
import { createOutputs } from "./outputs";
import { buildThemeItems } from "./theme";
import { buildThemeCss } from "./theme-css";
import { jsPath, saveTranspileCache, toJavaScript } from "./tojs";
import { buildUsage, verifyUsage } from "./usage";
import {
	verifyComponentDocs,
	verifyEmittedImports,
	verifyRegistryDependencies,
	verifySprings,
} from "./verify";

/** `--dev` (the dev watcher): a spec still waiting for its doc page warns instead of failing. */
const DEV = process.argv.includes("--dev");
// The site's Pro flag, read the same way: VITE_SHOW_PRO wins, unset means on in dev and off in builds.
const SHOW_PRO = process.env.VITE_SHOW_PRO ? process.env.VITE_SHOW_PRO === "true" : DEV;
const GENERATED = resolve(REPO_ROOT, "apps/site/src/lib/generated");

// Registry routes are entirely ours; the site's generated folder also holds emails, so only
// the per-component folders written below are pruned.
const outputs = createOutputs([
	...FRAMEWORKS.map((f) => resolve(OUT_DIR, FRAMEWORK[f].routePrefix)),
	...(ISOLATED ? [] : ["sources", "css", "usage"].map((dir) => resolve(GENERATED, dir))),
]);

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

async function writeJson(relative: string, value: unknown) {
	await outputs.write(resolve(OUT_DIR, relative), json(value));
}

type IndexSource = Pick<RegistryItem, "name" | "type" | "title" | "description"> & {
	categories?: string[];
};
const indexEntry = ({ name, type, title, description, categories }: IndexSource) => ({
	name,
	type,
	title,
	description,
	categories,
});

// One file per component, not one combined blob, so a request for one slug only loads
// that slug's source text instead of every component's.
async function writeGenerated(relative: string, value: unknown) {
	// An isolated build's localhost origins must never reach the user's running site.
	if (ISOLATED) return;
	await outputs.write(resolve(GENERATED, relative), json(value));
}

const PRO_SCHEMA = resolve(REPO_ROOT, "pro/packages/schema/src/index.ts");

/** Pro specs when the private submodule is checked out; only their usage snippets go public. */
async function loadProSpecs(): Promise<ComponentSpec[]> {
	if (!existsSync(PRO_SCHEMA)) return [];
	const mod: { proSpecs: ComponentSpec[] } = await import(pathToFileURL(PRO_SCHEMA).href);
	return mod.proSpecs;
}

async function main() {
	const docs = await verifyComponentDocs(
		[...specs],
		resolve(REPO_ROOT, "apps/site/src/docs/components"),
	);
	const errors = [
		...(await Promise.all(FRAMEWORKS.map((f) => verifySprings([...specs], f)))).flat(),
		...(
			await Promise.all(FRAMEWORKS.map((f) => verifyRegistryDependencies([...specs], f)))
		).flat(),
		...docs.errors,
		...(DEV ? [] : docs.missing),
		...(await verifyUsage([...specs])),
	];
	if (errors.length) {
		console.error("registry-build failed:");
		for (const e of errors) console.error(`  - ${e}`);
		process.exit(1);
	}
	if (DEV) for (const m of docs.missing) console.warn(`registry-build: ${m}`);

	const proSpecs = await loadProSpecs();
	const layouts = Object.fromEntries(
		FRAMEWORKS.map((f) => [f, installLayout(f, [...specs, ...proSpecs])]),
	) as Record<Framework, InstallLayout>;
	// The registry routes and the site's sources both need each item; build it once.
	const built = new Map<string, Promise<RegistryItem | null>>();
	const itemFor = (spec: ComponentSpec, framework: Framework) => {
		const key = `${framework}/${spec.slug}`;
		const item = built.get(key) ?? buildItem(spec, framework, layouts[framework]);
		built.set(key, item);
		return item;
	};
	// Pro source ships only from the private registry, so it never lands in public output.
	const publicSpecs = specs.filter((spec) => spec.tier !== "pro");
	const releasedSpecs = publicSpecs.filter(
		(spec) => SHOW_PRO || !PREVIEW_CATEGORIES.includes(spec.category),
	);

	const reactItems = await Promise.all(publicSpecs.map((spec) => itemFor(spec, "react")));
	const importErrors = verifyEmittedImports(reactItems.filter((item) => item !== null));
	if (importErrors.length) {
		console.error("registry-build failed:");
		for (const e of importErrors) console.error(`  - ${e}`);
		process.exit(1);
	}

	for (const framework of FRAMEWORKS as readonly Framework[]) {
		const { routePrefix } = FRAMEWORK[framework];
		const index: IndexSource[] = [];
		const jsIndex: IndexSource[] = [];

		// No files to transpile, so the JS route gets the same JSON.
		for (const item of await buildThemeItems(framework)) {
			await writeJson(`${routePrefix}/${item.name}.json`, item);
			await writeJson(`${routePrefix}/js/${item.name}.json`, item);
			const { $schema: _, files: __, ...summary } = item;
			index.push(summary);
			jsIndex.push(summary);
		}

		for (const spec of releasedSpecs) {
			const item = await itemFor(spec, framework);
			if (!item) continue;
			await writeJson(`${routePrefix}/${spec.slug}.json`, item);
			const { $schema: _, files: __, ...summary } = item;
			index.push(summary);

			// A JS route, so the site's language switch changes what the CLI actually writes.
			const js = await toJsItem(item);
			if (js) {
				await writeJson(`${routePrefix}/js/${spec.slug}.json`, js);
				jsIndex.push(summary);
			}
		}

		const schema =
			framework === "react"
				? "https://ui.shadcn.com/schema/registry.json"
				: "https://shadcn-svelte.com/schema/registry.json";

		for (const [prefix, items] of [
			[routePrefix, index],
			[`${routePrefix}/js`, jsIndex],
		] as const) {
			await writeJson(`${prefix}/registry.json`, {
				$schema: schema,
				name: REGISTRY_NAME,
				homepage: SITE_URL,
				items,
			});
			// registry.json carries every item's CSS and vars; tooling that only searches reads this.
			await writeJson(`${prefix}/index.json`, items.map(indexEntry));
		}
	}

	await writeJson("r/specs.json", {
		site: SITE_URL,
		registry: REGISTRY_URL,
		// licenseOrigin names a studied reference only for THIRD_PARTY_LICENSES.md, never a public endpoint.
		specs: releasedSpecs.map(({ licenseOrigin: _licenseOrigin, ...spec }) => spec),
	});

	// TS and its JS counterpart per file, generated here so prettier and babel never
	// reach the Worker. The site imports this instead of re-reading the registry JSON.
	for (const spec of publicSpecs) {
		const perFramework: Record<string, unknown[]> = {};
		const perFrameworkCss: Record<string, string> = {};
		for (const framework of FRAMEWORKS as readonly Framework[]) {
			const item = await itemFor(spec, framework);
			if (!item) continue;
			if (item.css)
				perFrameworkCss[framework] = cssText(item.css as Parameters<typeof cssText>[0]);
			perFramework[framework] = await Promise.all(
				item.files.map(async (file) => {
					const ts = layouts[framework].display(file.content);
					const js = await toJavaScript(ts, file.path).catch(() => null);
					return {
						path: file.path,
						target: file.target && layouts[framework].projectPath(file.target, file.type),
						ts,
						js,
						jsPath: js ? jsPath(file.path) : null,
					};
				}),
			);
		}
		await writeGenerated(`sources/${spec.slug}.json`, perFramework);
		await writeGenerated(`css/${spec.slug}.json`, perFrameworkCss);
	}

	for (const spec of [...specs, ...proSpecs]) {
		const perFramework: Record<string, unknown> = {};
		for (const framework of FRAMEWORKS as readonly Framework[]) {
			const snippet = await buildUsage(spec, framework, layouts[framework]);
			if (snippet) perFramework[framework] = snippet;
		}
		await writeGenerated(`usage/${spec.slug}.json`, perFramework);
	}

	if (!ISOLATED) {
		await outputs.write(
			resolve(GENERATED, "theme-css.json"),
			`${JSON.stringify({ css: await buildThemeCss() })}\n`,
		);
		await outputs.write(
			resolve(GENERATED, "origins.json"),
			json({ site: SITE_URL, registry: REGISTRY_URL }),
		);
	}

	await outputs.write(resolve(OUT_DIR, "llms.txt"), buildLlmsTxt([...releasedSpecs]));

	if (!ISOLATED) {
		await outputs.write(
			resolve(REPO_ROOT, "THIRD_PARTY_LICENSES.md"),
			buildThirdPartyLicenses([...specs]),
		);
	}

	await saveTranspileCache();
	const pruned = await outputs.prune();
	const { written, changed } = outputs.summary();
	// resourceUsage reports maxRSS in kilobytes.
	const peak = Math.round(process.resourceUsage().maxRSS / 1024);
	console.log(
		`registry-build: ${written} files, ${changed} changed, ${pruned.length} removed, peak memory ${peak} MB`,
	);
	for (const path of pruned) console.log(`  removed ${path}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
