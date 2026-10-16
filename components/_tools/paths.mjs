const OLD = /((?:from|import)\s*\(?\s*["'])\.\.\/([a-z0-9-]+)\//g;
const NEW = /((?:from|import)\s*\(?\s*["'])\.\.\/\.\.\/([a-z0-9-]+)\/(react|svelte)\//g;

// `lib` stays `lib` (not `_lib`) so import sort order, and so registry output, never changes.
/** Old layout (`../x/`, one folder deep) to the per-component layout (`../../x/<framework>/`). */
export function toFolders(code, framework) {
	return code.replace(OLD, (_m, head, folder) => `${head}../../${folder}/${framework}/`);
}

/** The inverse, so registry-build keeps reading the shape it rewrites for consumers today. */
export function toLegacy(code) {
	return code.replace(NEW, (_m, head, folder) => `${head}../${folder}/`);
}
