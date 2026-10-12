import { componentMarkdown } from "#lib/markdown.js";
import { handleBody } from "#lib/mcp/server.js";
import type { ToolSource } from "#lib/mcp/tools.js";
import { catalog, findSpec, specs } from "#lib/server/registry.js";
import type { RequestHandler } from "./$types";

// Answers tool calls per request; everything it reads is public and read-only.
export const prerender = false;

const CORS = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "POST, OPTIONS",
	"access-control-allow-headers":
		"content-type, accept, mcp-protocol-version, mcp-session-id",
};

const source: ToolSource = {
	catalog: async () => catalog(),
	markdown: async (item) => {
		const spec = findSpec(item.category, item.slug);
		return spec ? componentMarkdown(spec, specs) : null;
	},
};

export const POST: RequestHandler = async ({ request }) => {
	const body: unknown = await request.json().catch(() => undefined);
	if (body === undefined)
		return Response.json(
			{ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
			{ status: 400, headers: CORS },
		);
	const reply = await handleBody(body, source);
	return reply === null
		? new Response(null, { status: 202, headers: CORS })
		: Response.json(reply, { headers: CORS });
};

export const OPTIONS: RequestHandler = () =>
	new Response(null, { status: 204, headers: CORS });

// Stateless: no server-sent stream to open and no session to end.
export const GET: RequestHandler = () =>
	new Response("Use POST with a JSON-RPC body.", {
		status: 405,
		headers: { ...CORS, allow: "POST, OPTIONS" },
	});
