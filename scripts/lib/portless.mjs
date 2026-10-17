import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * The local URL behind a portless name (`site.baby-ui.localhost`), from its routes file. Node's
 * fetch does not resolve `*.localhost` names the way browsers and curl do, so go to the port.
 */
export function routeUrl(hostname) {
	const file = join(homedir(), ".portless", "routes.json");
	if (!existsSync(file)) return undefined;
	try {
		const route = JSON.parse(readFileSync(file, "utf8")).find(
			(r) => r.hostname === hostname,
		);
		return route ? `http://localhost:${route.port}` : undefined;
	} catch {
		return undefined;
	}
}
