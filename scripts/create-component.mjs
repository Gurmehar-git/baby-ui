import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Read from the schema so a new category never needs a second edit here.
const CATEGORIES = [
	...readFileSync(
		resolve(REPO_ROOT, "packages/registry-schema/src/categories.ts"),
		"utf8",
	)
		.match(/CATEGORIES = \[([^\]]*)\]/)[1]
		.matchAll(/"([a-z-]+)"/g),
].map((m) => m[1]);
const RESERVED = new Set([
	"switch",
	"delete",
	"new",
	"class",
	"default",
	"function",
	"package",
]);

const [command, rawName, ...rest] = process.argv.slice(2);

if (command !== "create" || !rawName) {
	console.error("Usage: pnpm component create <name> [--category=base]");
	process.exit(1);
}

const slug = rawName;
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
	console.error(`"${slug}" must be a kebab-case slug, e.g. "button-group"`);
	process.exit(1);
}

const categoryFlag = rest.find((a) => a.startsWith("--category="));
const category = categoryFlag ? categoryFlag.slice("--category=".length) : "base";
if (!CATEGORIES.includes(category)) {
	console.error(`--category must be one of: ${CATEGORIES.join(", ")}`);
	process.exit(1);
}

const pascal = slug
	.split("-")
	.map((w) => w[0].toUpperCase() + w.slice(1))
	.join("");
const camelRaw = pascal[0].toLowerCase() + pascal.slice(1);
const camel = RESERVED.has(camelRaw) ? `${camelRaw}Component` : camelRaw;
const title = pascal.replace(/([a-z])([A-Z])/g, "$1 $2");

async function exists(path) {
	return readFile(path, "utf8").then(
		() => true,
		() => false,
	);
}

async function write(path, content) {
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content);
	console.log(
		`  created ${path.replace(`${REPO_ROOT}\\`, "").replace(`${REPO_ROOT}/`, "")}`,
	);
}

const variantsTemplate = () => `import { tv, type VariantProps } from "tailwind-variants";

export const ${camel} = tv({
	base: "",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: { variant: "default" },
});

export type ${pascal}Variant = NonNullable<VariantProps<typeof ${camel}>["variant"]>;
`;

const reactComponentTemplate = () => `import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { type ${pascal}Variant, ${camel} } from "./variants";

export interface ${pascal}Props extends ComponentProps<"div"> {
	variant?: ${pascal}Variant;
}

export function ${pascal}({ className, variant, ...props }: ${pascal}Props) {
	return (
		<div
			data-slot="${slug}"
			data-variant={variant}
			className={cn(${camel}({ variant }), className)}
			{...props}
		/>
	);
}
`;

const svelteComponentTemplate = () => `<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { type ${pascal}Variant, ${camel} } from "./variants";

type Props = HTMLAttributes<HTMLDivElement> & {
	variant?: ${pascal}Variant;
};

let { class: classProp, variant, ...rest }: Props = $props();
</script>

<div data-slot="${slug}" data-variant={variant} class={cn(${camel}({ variant }), classProp)} {...rest}></div>
`;

const registrySchemaTemplate =
	() => `import { defineComponent } from "@baby-ui/registry-schema";

export const ${camel} = defineComponent({
	slug: "${slug}",
	name: "${title}",
	description: "TODO: one sentence describing ${title}.",
	category: "${category}",
	status: "experimental",
	demo: { mode: "auto" },
	variants: { variant: ["default"] },
	props: [
		{
			name: "variant",
			type: '"default"',
			description: "TODO",
			default: "default",
			control: { kind: "select", options: ["default"] },
		},
	],
	a11y: {
		keyboard: [],
		notes: [],
	},
	impl: {
		react: {
			entry: "${pascal}",
			files: [
				{ path: "${slug}/${slug}.tsx", type: "registry:ui" },
				{ path: "${slug}/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "${pascal}",
			files: [
				{ path: "${slug}/${slug}.svelte", type: "registry:ui" },
				{ path: "${slug}/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["${slug}"],
});
`;

const docsTemplate = () => `---
title: ${title}
description: "TODO: one sentence describing ${title}."
component: ${slug}
category: ${category}
tags: [${slug}]
---

TODO: write the docs prose for ${title}.
`;

async function main() {
	const reactDir = resolve(REPO_ROOT, `components/${slug}/react`);
	const svelteDir = resolve(REPO_ROOT, `components/${slug}/svelte`);
	if (await exists(resolve(reactDir, `${slug}.tsx`))) {
		console.error(`components/${slug}/react/${slug}.tsx already exists`);
		process.exit(1);
	}

	console.log(`Scaffolding "${slug}" (${pascal}, category: ${category})\n`);

	await write(resolve(reactDir, "variants.ts"), variantsTemplate());
	await write(resolve(reactDir, `${slug}.tsx`), reactComponentTemplate());
	await write(resolve(svelteDir, `${slug}.svelte`), svelteComponentTemplate());
	await write(
		resolve(REPO_ROOT, `components/${slug}/${slug}.ts`),
		registrySchemaTemplate(),
	);
	await write(resolve(REPO_ROOT, `components/${slug}/index.md`), docsTemplate());

	// Svelte variants.ts, both demos, both usage snippets and every index are generated.
	generate({ quiet: true });

	console.log(`
Scaffolded "${slug}". This is a minimal starting point (a div with one "default" variant);
you still need to:
  - Design the real markup/primitive (Base UI for React, bits-ui for Svelte, per the base-
    components hard rule) and variant set in the React variants.ts
    (the Svelte copy is generated by pnpm gen).
  - Write real props/a11y/motion notes in components/${slug}/${slug}.ts.
  - Add licenseOrigin only if the code is ported, naming the real source and copyright.
  - Demos and usage are generated (spec demo: auto). Add object/array sample props as an
    export named ${slug.toUpperCase().replaceAll("-", "_")} in packages/demos/src/data/samples.ts; write hand demos
    only when the preview needs state or composition (a hand-written file always wins).
  - Write the docs prose in components/${slug}/index.md.
  - Run the gate suite: node scripts/check-comments.mjs --all, biome check --write .,
    pnpm --filter @baby-ui/components check, then demos and site checks one at a time.
`);
}

await main();
