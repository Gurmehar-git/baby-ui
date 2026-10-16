import type { InstallLayout } from "../../packages/registry-build/src/layout";

const PACKAGE_IMPORT = /@baby-ui\/components\/(?:react|svelte)\/([a-z0-9-]+)/g;

/** An example as a reader copies it: package imports become their install aliases. */
export function readerText(source: string, layout: InstallLayout): string {
	return source.replace(PACKAGE_IMPORT, (_m, slug: string) => layout.itemImport(slug));
}
