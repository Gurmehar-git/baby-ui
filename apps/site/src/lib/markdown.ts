import type { ComponentSpec, Framework } from "@baby-ui/registry-schema";
import { FRAMEWORKS } from "@baby-ui/registry-schema";
import origins from "./generated/origins.json";
import { CATEGORY_LABEL, specHref } from "./registry";
import { installCommand } from "./registry-items";
import { usageSnippet } from "./usage";

const RAW = import.meta.glob(["../docs/**/*.md", "../../../../components/*/index.md"], {
	query: "?raw",
	eager: true,
	import: "default",
});

function body(path: string): string {
	const raw = RAW[path] as string | undefined;
	// Frontmatter is already on the page as title and description.
	return raw?.replace(/^---[\s\S]*?---\s*/, "") ?? "";
}

/** A guide as plain markdown, for agents and the Copy Page button. */
export function guideMarkdown(slug: string, title: string, description: string): string {
	return `# ${title}\n\n${description}\n\n${body(`../docs/guides/${slug}.md`)}`.trim();
}

const cell = (text: string) => text.replace(/\|/g, "\\|");
const list = (items: string[]) => items.map((item) => `- ${item}`);
const pageUrl = (spec: Pick<ComponentSpec, "category" | "slug">) =>
	`${origins.site}${specHref(spec)}`;
const itemUrl = (slug: string, framework: Framework) =>
	`${origins.registry}${framework === "react" ? "" : "/svelte"}/r/${slug}.json`;

function section(out: string[], heading: string, lines: string[]) {
	if (lines.length) out.push(`## ${heading}`, "", ...lines, "");
}

/**
 * A component page as plain markdown, in the page's order: metadata, when to use, install,
 * usage, prose, API, keyboard, accessibility, motion, responsive, performance, notes for AI.
 */
export async function componentMarkdown(
	spec: ComponentSpec,
	all: readonly ComponentSpec[],
): Promise<string> {
	const ports = FRAMEWORKS.filter((f) => spec.impl[f]);
	const pro = spec.tier === "pro";
	const bySlug = new Map(all.map((s) => [s.slug, s]));
	const deps = [...new Set(ports.flatMap((f) => spec.impl[f]?.dependencies ?? []))];
	const g = spec.guidance;

	const out = [`# ${spec.name}`, "", `> ${spec.description}`, ""];
	out.push(
		`- Type: ${CATEGORY_LABEL[spec.category]} component, ${ports.join(" and ")}`,
		`- Access: ${pro ? "Pro" : "Free"}, ${spec.status}`,
		`- Page: ${pageUrl(spec)}`,
		`- Markdown: ${pageUrl(spec)}.md`,
		...(pro ? [] : ports.map((f) => `- Registry item (${f}): ${itemUrl(spec.slug, f)}`)),
		...(deps.length ? [`- Dependencies: ${deps.join(", ")}`] : []),
		...(spec.keywords.length ? [`- Keywords: ${spec.keywords.join(", ")}`] : []),
		"",
	);

	section(out, "When to use", list(g.when));
	section(
		out,
		"When not to use",
		list(
			g.whenNot.map(({ text, use }) => {
				const alt = use ? bySlug.get(use) : undefined;
				return alt ? `${text} Use [${alt.name}](${pageUrl(alt)}.md).` : text;
			}),
		),
	);

	section(
		out,
		"Installation",
		pro
			? ["Pro component: the install command is available after signing in on the site."]
			: ports.flatMap((f) => [
					"```bash",
					installCommand(spec.slug, f, origins.registry),
					"```",
				]),
	);

	for (const framework of ports) {
		const usage = await usageSnippet(spec.slug, framework);
		if (!usage) continue;
		section(out, `Usage (${framework})`, [
			`\`\`\`${usage.path.split(".").pop()}`,
			usage.ts,
			"```",
		]);
	}

	const prose = body(`../../../../components/${spec.slug}/index.md`).trim();
	if (prose) out.push(prose, "");

	section(
		out,
		"API reference",
		spec.props.length
			? [
					"| Prop | Type | Default | Description |",
					"| --- | --- | --- | --- |",
					...spec.props.map((p) => {
						const def =
							p.default === undefined || p.default === null
								? ""
								: `\`${String(p.default)}\``;
						const name = `\`${p.name}\`${p.required ? " (required)" : ""}`;
						return `| ${name} | \`${cell(p.type)}\` | ${def} | ${cell(p.description)} |`;
					}),
				]
			: [],
	);
	section(
		out,
		"Keyboard interactions",
		spec.a11y.keyboard.length
			? [
					"| Keys | Action |",
					"| --- | --- |",
					...spec.a11y.keyboard.map(
						(k) =>
							`| ${k.keys.map((key) => `\`${cell(key)}\``).join(" ")} | ${cell(k.action)} |`,
					),
				]
			: [],
	);
	section(out, "Accessibility", list(spec.a11y.notes));
	section(
		out,
		"Motion",
		spec.motion
			? list([...spec.motion.behaviour, `Reduced motion: ${spec.motion.reducedMotion}`])
			: [],
	);
	section(out, "Responsive behavior", list(g.responsive));
	section(out, "Performance", list(g.performance));
	section(out, "Notes for AI", list(g.ai));

	const related = [
		...new Set([
			...g.whenNot.flatMap((w) => (w.use ? [w.use] : [])),
			...all
				.filter((s) => s.category === spec.category && s.slug !== spec.slug)
				.map((s) => s.slug),
		]),
	]
		.slice(0, 6)
		.flatMap((slug) => {
			const s = bySlug.get(slug);
			return s ? [`- [${s.name}](${pageUrl(s)}.md): ${s.description}`] : [];
		});
	section(out, "Related", related);

	out.push(
		"## Guidance for AI tools",
		"",
		`${spec.name} is a Baby UI component that installs as source through the shadcn CLIs, in React and Svelte with the same props. The full index is at ${origins.site}/llms.txt.`,
	);
	return out.join("\n").trim();
}
