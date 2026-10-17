/** The `dlx` arguments that add components; the CLI reads framework and TS/JS from components.json. */
export const installArgs = (slugs: string | readonly string[]) =>
	`@baby-ui/cli add ${[slugs].flat().join(" ")}`;

/** Class and keyframe names a stylesheet defines, e.g. [".pop-in", "@keyframes pop-in"]. */
export function cssNames(css: string): string[] {
	const names = new Set<string>();
	for (const line of css.split("\n")) {
		if (!line.endsWith("{")) continue;
		const keyframes = line.match(/^@keyframes\s+([\w-]+)/);
		if (keyframes) names.add(`@keyframes ${keyframes[1]}`);
		else for (const m of line.matchAll(/\.([a-zA-Z][\w-]*)/g)) names.add(`.${m[1]}`);
	}
	return [...names];
}
