import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import ts from "typescript";

const cache = new Map();

const hasModifier = (node, kind) =>
	ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((m) => m.kind === kind);
const hasExport = (node) => hasModifier(node, ts.SyntaxKind.ExportKeyword);
const hasDefault = (node) => hasModifier(node, ts.SyntaxKind.DefaultKeyword);

/**
 * Source of a file as TypeScript. A .svelte file contributes its `<script module>` block whole, plus
 * the type declarations Svelte 5 lets the instance script export.
 */
function scriptOf(path) {
	const text = readFileSync(path, "utf8");
	if (!path.endsWith(".svelte")) return text;
	let out = "";
	for (const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
		if (/\bmodule\b/.test(match[1] ?? "")) {
			out += `${match[2]}\n`;
			continue;
		}
		const instance = ts.createSourceFile(
			"i.ts",
			match[2] ?? "",
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS,
		);
		for (const node of instance.statements) {
			const isImport = ts.isImportDeclaration(node);
			const isType = ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node);
			if (isImport || (isType && hasExport(node))) out += `${node.getText(instance)}\n`;
		}
	}
	return out;
}

function resolveModule(from, spec) {
	if (!spec.startsWith(".")) return null;
	const base = resolve(dirname(from), spec);
	for (const candidate of [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		`${base}.svelte.ts`,
		`${base}/index.ts`,
	]) {
		if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
	}
	return null;
}

/** Named exports read from syntax alone, fast enough to rerun on every save. `declared` marks
 * names defined here (not re-exported), which picks the owning file when two export one name. */
export function exportsOf(path, seen = new Set(), text) {
	const hit = text === undefined && cache.get(path);
	// A hit is stale when any re-exported file changed, not just this one.
	if (
		hit &&
		[...hit.stamps].every(([file, t]) => existsSync(file) && statSync(file).mtimeMs === t)
	)
		return hit.names;
	if (seen.has(path)) return [];
	seen.add(path);
	const stamps = new Map(text === undefined ? [[path, statSync(path).mtimeMs]] : []);
	const follow = (target) => {
		const found = exportsOf(target, seen);
		for (const [file, t] of cache.get(target)?.stamps ?? []) stamps.set(file, t);
		return found;
	};

	const kind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const source = ts.createSourceFile(
		path,
		text ?? scriptOf(path),
		ts.ScriptTarget.Latest,
		false,
		kind,
	);
	const localTypes = new Set();
	const localValues = new Set();
	const typeImports = new Set();
	const imports = new Map();
	for (const node of source.statements) {
		if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
			localTypes.add(node.name.text);
		} else if (
			(ts.isFunctionDeclaration(node) ||
				ts.isClassDeclaration(node) ||
				ts.isEnumDeclaration(node)) &&
			node.name
		) {
			localValues.add(node.name.text);
		} else if (ts.isVariableStatement(node)) {
			for (const decl of node.declarationList.declarations) {
				if (ts.isIdentifier(decl.name)) localValues.add(decl.name.text);
			}
		} else if (ts.isImportDeclaration(node) && node.importClause) {
			const clause = node.importClause;
			const from = node.moduleSpecifier.text;
			const named = clause.namedBindings && ts.isNamedImports(clause.namedBindings);
			for (const el of named ? clause.namedBindings.elements : []) {
				const local = el.name.text;
				if (clause.isTypeOnly || el.isTypeOnly) typeImports.add(local);
				imports.set(local, { from, name: (el.propertyName ?? el.name).text });
			}
		}
	}

	const names = [];
	const push = (name, type, declared) => {
		if (!names.some((n) => n.name === name)) names.push({ name, type, declared });
	};
	const lookup = (from, name) => {
		const target = resolveModule(path, from);
		if (!target) return false;
		return follow(target).find((n) => n.name === name)?.type ?? false;
	};

	for (const node of source.statements) {
		if (ts.isExportDeclaration(node)) {
			const spec = node.moduleSpecifier;
			const from = spec && ts.isStringLiteral(spec) ? spec.text : null;
			if (!node.exportClause && from) {
				const target = resolveModule(path, from);
				if (target) {
					for (const n of follow(target)) push(n.name, n.type || node.isTypeOnly, false);
				}
				continue;
			}
			if (!node.exportClause || !ts.isNamedExports(node.exportClause)) continue;
			for (const el of node.exportClause.elements) {
				const exported = el.name.text;
				const local = (el.propertyName ?? el.name).text;
				let type = node.isTypeOnly || el.isTypeOnly;
				const declared = !from && (localTypes.has(local) || localValues.has(local));
				if (!type && from) type = lookup(from, local);
				if (!type && !from) {
					const imported = imports.get(local);
					type =
						localTypes.has(local) ||
						typeImports.has(local) ||
						(imported ? lookup(imported.from, imported.name) : false);
				}
				push(exported, type, declared);
			}
			continue;
		}
		if (!hasExport(node) || hasDefault(node)) continue;
		if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
			push(node.name.text, true, true);
		} else if (
			(ts.isFunctionDeclaration(node) ||
				ts.isClassDeclaration(node) ||
				ts.isEnumDeclaration(node)) &&
			node.name
		) {
			push(node.name.text, false, true);
		} else if (ts.isVariableStatement(node)) {
			for (const decl of node.declarationList.declarations) {
				if (ts.isIdentifier(decl.name)) push(decl.name.text, false, true);
			}
		}
	}
	if (text === undefined) cache.set(path, { stamps, names });
	return names;
}

/** Exports of a file as this run will leave it: generated text first, else the file on disk. */
export const exportsIn = (output, path) =>
	output.files.has(path)
		? exportsOf(path, new Set(), output.files.get(path))
		: exportsOf(path);

/** A folder's file names as this run will leave it: on disk plus files it generates there. */
export function filesIn(output, dir) {
	const names = new Set(readdirSync(dir));
	for (const path of output.files.keys())
		if (dirname(path) === dir) names.add(basename(path));
	return [...names];
}
