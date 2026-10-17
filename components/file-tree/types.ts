export type FileTreeNode = {
	name: string;
	/** Present means folder, absent means file (even when empty). */
	children?: FileTreeNode[];
};

export type FlatRow = {
	id: string;
	node: FileTreeNode;
	depth: number;
	isFolder: boolean;
	expanded: boolean;
};

/** Visible rows in render order, which is also the order arrow keys walk. */
export function flatten(
	nodes: FileTreeNode[],
	open: Record<string, boolean>,
	defaultExpanded: boolean,
	parent = "",
	depth = 0,
): FlatRow[] {
	const rows: FlatRow[] = [];
	for (const node of nodes) {
		const id = parent ? `${parent}/${node.name}` : node.name;
		const isFolder = Array.isArray(node.children);
		const expanded = isFolder ? (open[id] ?? defaultExpanded) : false;
		rows.push({ id, node, depth, isFolder, expanded });
		if (isFolder && expanded && node.children) {
			rows.push(...flatten(node.children, open, defaultExpanded, id, depth + 1));
		}
	}
	return rows;
}
