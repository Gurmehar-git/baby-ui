import { MCP_INSTRUCTIONS, runTool, SITE_TOOLS, type ToolSource } from "./tools";

/** Protocol revisions this server speaks, newest first; it answers in the client's if listed. */
const VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

type Id = string | number | null;
type Reply = { jsonrpc: "2.0"; id: Id } & (
	| { result: unknown }
	| { error: { code: number; message: string } }
);

const ok = (id: Id, result: unknown): Reply => ({ jsonrpc: "2.0", id, result });
const fail = (id: Id, code: number, message: string): Reply => ({
	jsonrpc: "2.0",
	id,
	error: { code, message },
});
const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

/** One JSON-RPC message in, its reply out; notifications (no id) get none. */
export async function handleMessage(
	message: unknown,
	source: ToolSource,
): Promise<Reply | null> {
	if (
		!isRecord(message) ||
		message.jsonrpc !== "2.0" ||
		typeof message.method !== "string"
	)
		return fail(null, -32600, "Invalid request");
	const id =
		typeof message.id === "string" || typeof message.id === "number" ? message.id : null;
	if (!("id" in message)) return null;
	const params = isRecord(message.params) ? message.params : {};
	switch (message.method) {
		case "initialize": {
			const asked =
				typeof params.protocolVersion === "string" ? params.protocolVersion : "";
			return ok(id, {
				protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
				capabilities: { tools: { listChanged: false } },
				serverInfo: { name: "baby-ui", title: "Baby UI", version: "1.0.0" },
				instructions: MCP_INSTRUCTIONS,
			});
		}
		case "ping":
			return ok(id, {});
		case "tools/list":
			return ok(id, {
				tools: SITE_TOOLS.map(({ name, description, inputSchema }) => ({
					name,
					description,
					inputSchema,
					annotations: { readOnlyHint: true, openWorldHint: false },
				})),
			});
		case "tools/call": {
			if (typeof params.name !== "string") return fail(id, -32602, "`name` is required");
			const args = isRecord(params.arguments) ? params.arguments : {};
			return ok(id, await runTool(params.name, args, source));
		}
		default:
			return fail(id, -32601, `Method not found: ${message.method}`);
	}
}

/** A Streamable HTTP POST body: one message or a batch, answered as plain JSON (no stream needed). */
export async function handleBody(body: unknown, source: ToolSource): Promise<unknown> {
	if (!Array.isArray(body)) return handleMessage(body, source);
	const replies = await Promise.all(
		body.map((message) => handleMessage(message, source)),
	);
	const answered = replies.filter((reply) => reply !== null);
	return answered.length ? answered : null;
}
