import themeCss from "./generated/theme-css.json";
import { highlight } from "./highlight";
import type { PmKind } from "./pm";

/** The subset of docvia's RenderOutput this module touches. */
export type Node = {
	kind: string;
	tag?: string;
	name?: string;
	id?: string;
	value?: string;
	props?: Record<string, unknown>;
	children?: Node[];
	hydrate?: boolean;
};

export type Heading = { id: string; label: string; depth: 2 | 3 };

export type Panel = {
	id: string;
	label: string;
	lang: string;
	code: string;
	html: string;
	pm?: { kind: PmKind; args: string };
};

const THEME_MARKER = "/* baby-ui:theme */";
// Leading comment lines steer rendering: `# tab: React` names a tab, `# pm: dlx …` makes
// the fence a package-manager command. Either comment prefix works.
const DIRECTIVE = /^(?:#|\/\/)\s*(tab|pm):\s*(.+)$/;

function text(node: Node): string {
	if (node.kind === "text") return node.value ?? "";
	return (node.children ?? []).map(text).join("");
}

function isFence(node: Node): boolean {
	return (
		node.kind === "element" && node.tag === "pre" && node.children?.[0]?.tag === "code"
	);
}

function isBlank(node: Node): boolean {
	return node.kind === "text" && (node.value ?? "").trim() === "";
}

async function panel(node: Node, index: number): Promise<Panel> {
	const code = node.children?.[0] as Node;
	const lang = String(code.props?.["data-lang"] ?? "ts");
	const lines = text(code).replace(/\n$/, "").split("\n");
	let label = "";
	let pm: Panel["pm"];
	while (lines.length) {
		const m = lines[0]?.match(DIRECTIVE);
		if (!m) break;
		lines.shift();
		if (m[1] === "tab") label = m[2]?.trim() ?? "";
		else {
			const [kind, ...rest] = (m[2] ?? "").trim().split(/\s+/);
			pm = { kind: kind as PmKind, args: rest.join(" ") };
		}
	}
	const source = lines.join("\n");
	return {
		id: `${node.id ?? "code"}-${index}`,
		label: label || lang,
		lang,
		code: source,
		html: pm ? "" : await highlight(source, lang),
		pm,
	};
}

async function block(node: Node): Promise<Node> {
	const code = node.children?.[0] as Node;
	const lang = String(code.props?.["data-lang"] ?? "ts");
	const raw = text(code).replace(/\n$/, "");
	// A fence holding only the marker becomes the generated base theme, folded.
	const generated = raw.trim() === THEME_MARKER;
	const source = generated ? themeCss.css.trimEnd() : raw;
	return {
		kind: "component",
		name: "code-block",
		id: node.id ?? "code",
		hydrate: true,
		props: {
			code: source,
			lang,
			html: await highlight(source, lang),
			maxHeight: "none",
			collapsible: generated,
		},
	};
}

// Fences arrive as <pre class="docvia-code-block"><code data-lang>, unhighlighted. A run
// of adjacent fences becomes one tabbed group; a lone one becomes a CodeBlock.
async function swap(node: Node): Promise<Node> {
	if (!node.children) return node;
	const out: Node[] = [];
	const kids = node.children;
	for (let i = 0; i < kids.length; i++) {
		const child = kids[i] as Node;
		if (!isFence(child)) {
			out.push(await swap(child));
			continue;
		}
		const run = [child];
		let j = i + 1;
		while (j < kids.length) {
			const next = kids[j] as Node;
			if (isFence(next)) run.push(next);
			else if (!isBlank(next)) break;
			j++;
		}
		const directive = run.some((f) => DIRECTIVE.test(text(f).split("\n")[0] ?? ""));
		if (run.length === 1 && !directive) {
			out.push(await block(child));
			continue;
		}
		const panels = await Promise.all(run.map(panel));
		out.push({
			kind: "component",
			name: "code-group",
			id: child.id ?? "code-group",
			hydrate: true,
			props: { panels },
		});
		i = j - 1;
	}
	return { ...node, children: out };
}

const isOutlined = (depth: number): depth is Heading["depth"] =>
	depth === 2 || depth === 3;

/** Rewrites code fences to site components and keeps docvia's h2/h3 headings for an outline. */
export async function prepare<T>(page: {
	content: T;
	headings: { depth: number; text: string; id: string }[];
}): Promise<{ content: T; headings: Heading[] }> {
	const headings = page.headings.flatMap(({ depth, text, id }) =>
		isOutlined(depth) ? [{ id, label: text, depth }] : [],
	);
	return { content: (await swap(page.content as Node)) as T, headings };
}
