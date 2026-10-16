import { toPlainText } from "@better-svelte-email/server";
import type { Component } from "svelte";

export type TemplateModule = { default: Component<Record<string, unknown>> };
type Loader = () => Promise<TemplateModule>;

/** Finds a template in `import.meta.glob` results: the file named after its own folder, so
 * helper parts in the same folder (the email kit's pieces) are never mistaken for one. */
export function templateLoader(globs: Record<string, Loader>) {
	// Public templates sit in components/<slug>/svelte/, Pro's still in <slug>/.
	return (slug: string): Loader | undefined =>
		Object.entries(globs).find(
			([path]) =>
				path.endsWith(`/${slug}/${slug}.svelte`) ||
				path.endsWith(`/${slug}/svelte/${slug}.svelte`),
		)?.[1];
}

/** The plain-text part of a rendered email, minus the hidden inbox preview line. */
export function emailPlainText(html: string): string {
	// React Email's preview div lacks the id toPlainText skips, so drop the block by its marker.
	return toPlainText(
		html.replace(/<div[^>]*data-skip-in-text="true"[^>]*>[\s\S]*?<\/div>\s*<\/div>/, ""),
	);
}
