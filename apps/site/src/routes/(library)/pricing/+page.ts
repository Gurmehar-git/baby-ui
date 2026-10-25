import { loadProScreen } from "#lib/pro-screens.js";
import type { PageLoad } from "./$types";

// Rendered on request: these pages 404 in builds without Pro, which prerendering would fail on.
export const prerender = false;

export const load: PageLoad = () => loadProScreen("pricing");
