const OLD = /((?:from|import)\s*\(?\s*["'])\.\.\/([a-z0-9-]+)\//g;
const NEW = /((?:from|import)\s*\(?\s*["'])\.\.\/\.\.\/([a-z0-9-]+)\/(react|svelte)\//g;

// `lib` stays `lib` (not `_lib`) so import sort order, and so registry output, never changes.
// A bare folder import (`"../tabs"`) resolves that folder's barrel.
const OLD_BARE = /((?:from|import)\s*\(?\s*(["']))\.\.\/([a-z0-9-]+)\2/g;
const NEW_BARE =
	/((?:from|import)\s*\(?\s*(["']))\.\.\/\.\.\/([a-z0-9-]+)\/(?:react|svelte)\2/g;

/** Old layout (`../x/`, one folder deep) to the per-component layout (`../../x/<framework>/`). */
export function toFolders(code, framework) {
	return code
		.replace(OLD, (_m, head, folder) => `${head}../../${folder}/${framework}/`)
		.replace(
			OLD_BARE,
			(_m, head, q, folder) => `${head}../../${folder}/${framework}${q}`,
		);
}

/** The inverse, so registry-build keeps reading the shape it rewrites for consumers today. */
export function toLegacy(code) {
	return code
		.replace(NEW, (_m, head, folder) => `${head}../${folder}/`)
		.replace(NEW_BARE, (_m, head, q, folder) => `${head}../${folder}${q}`);
}
