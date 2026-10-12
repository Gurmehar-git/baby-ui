"use client";

import type { KeyboardEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { type FileTreeNode, flatten } from "./types";
import { type FileTreeSize, fileTree, ROW_INSET } from "./variants";

export type { FileTreeSize };

export interface FileTreeProps {
	tree: FileTreeNode[];
	/** Controlled: which folder ids are expanded. Omit to let the component own it. */
	expandedIds?: Record<string, boolean>;
	defaultExpandedIds?: Record<string, boolean>;
	onExpandedIdsChange?: (expandedIds: Record<string, boolean>) => void;
	/** Starting expand state for any folder id not present in the expanded-ids map. */
	defaultExpanded?: boolean;
	/** Controlled: the selected row id. Omit to let the component own it. */
	selected?: string | null;
	defaultSelected?: string | null;
	onSelectedChange?: (id: string) => void;
	className?: string;
	indent?: number;
	showGuides?: boolean;
	size?: FileTreeSize;
}

type Shared = {
	size: FileTreeSize;
	expandedIds: Record<string, boolean>;
	defaultExpanded: boolean;
	selected: string | null;
	activeId: string | null;
	indent: number;
	showGuides: boolean;
	select: (id: string, isFolder: boolean, expanded: boolean) => void;
	setFocused: (id: string) => void;
	onKeyDown: (event: KeyboardEvent, id: string) => void;
};

// Children stay mounted and collapse via grid-template-rows, like Collapsible:
// real height animates instead of rows just vanishing.
function TreeRow({
	node,
	parent,
	depth,
	shared,
}: {
	node: FileTreeNode;
	parent: string;
	depth: number;
	shared: Shared;
}) {
	const id = parent ? `${parent}/${node.name}` : node.name;
	const isFolder = Array.isArray(node.children);
	const expanded = isFolder ? (shared.expandedIds[id] ?? shared.defaultExpanded) : false;
	const styles = fileTree({
		size: shared.size,
		selected: shared.selected === id,
		guide: shared.showGuides && depth > 0,
	});

	return (
		<>
			<div
				role="treeitem"
				aria-level={depth + 1}
				aria-selected={shared.selected === id}
				aria-expanded={isFolder ? expanded : undefined}
				data-row={id}
				tabIndex={shared.activeId === id ? 0 : -1}
				onKeyDown={(e) => shared.onKeyDown(e, id)}
				onClick={() => shared.select(id, isFolder, expanded)}
				onFocus={() => shared.setFocused(id)}
				style={{ paddingLeft: depth * shared.indent + ROW_INSET[shared.size] }}
				className={styles.row()}
			>
				{isFolder ? (
					<svg
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden
						className={styles.chevron()}
						style={{ transform: expanded ? "rotate(90deg)" : undefined }}
					>
						<path
							d="m6 4 4 4-4 4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : (
					<span className={styles.spacer()} />
				)}
				<span className={styles.name()}>{node.name}</span>
			</div>
			{isFolder && node.children ? (
				// biome-ignore lint/a11y/useSemanticElements: role="group" nests a treeitem's children per the WAI-ARIA tree pattern, not a form fieldset
				<div
					role="group"
					inert={!expanded}
					{...(expanded ? { "data-open": "" } : {})}
					className={styles.group()}
				>
					<div className={styles.groupInner()}>
						{node.children.map((child) => (
							<TreeRow
								key={child.name}
								node={child}
								parent={id}
								depth={depth + 1}
								shared={shared}
							/>
						))}
					</div>
				</div>
			) : null}
		</>
	);
}

export function FileTree({
	tree,
	expandedIds: expandedIdsProp,
	defaultExpandedIds = {},
	onExpandedIdsChange,
	defaultExpanded = true,
	selected: selectedProp,
	defaultSelected = null,
	onSelectedChange,
	className,
	indent = 14,
	showGuides = true,
	size = "default",
}: FileTreeProps) {
	const [internalExpandedIds, setInternalExpandedIds] = useState(defaultExpandedIds);
	const expandedIds = expandedIdsProp ?? internalExpandedIds;
	const [internalSelected, setInternalSelected] = useState(defaultSelected);
	const selected = selectedProp ?? internalSelected;
	const [focused, setFocused] = useState<string | null>(null);
	const root = useRef<HTMLDivElement>(null);

	// Visible-only rows, purely for keyboard math (arrow/home/end). Rendering itself is
	// recursive below and keeps every row mounted so a folder can animate its collapse.
	const rows = useMemo(
		() => flatten(tree, expandedIds, defaultExpanded),
		[tree, expandedIds, defaultExpanded],
	);
	const activeId =
		(focused && rows.some((r) => r.id === focused) ? focused : rows[0]?.id) ?? null;

	function setExpanded(id: string, next: boolean) {
		const nextIds = { ...expandedIds, [id]: next };
		if (expandedIdsProp === undefined) setInternalExpandedIds(nextIds);
		onExpandedIdsChange?.(nextIds);
	}

	function setSelected(id: string) {
		if (selectedProp === undefined) setInternalSelected(id);
		onSelectedChange?.(id);
	}

	function focusRow(id: string) {
		setFocused(id);
		root.current?.querySelector<HTMLElement>(`[data-row="${CSS.escape(id)}"]`)?.focus();
	}

	function move(from: string, delta: number) {
		const index = rows.findIndex((r) => r.id === from);
		if (index === -1) return;
		const next = rows[index + delta];
		if (next) focusRow(next.id);
	}

	function select(id: string, isFolder: boolean, expanded: boolean) {
		if (isFolder) setExpanded(id, !expanded);
		setSelected(id);
	}

	function onKeyDown(event: KeyboardEvent, id: string) {
		const row = rows.find((r) => r.id === id);
		if (!row) return;

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				move(id, 1);
				break;
			case "ArrowUp":
				event.preventDefault();
				move(id, -1);
				break;
			case "ArrowRight":
				event.preventDefault();
				if (row.isFolder && !row.expanded) setExpanded(id, true);
				else if (row.isFolder) move(id, 1);
				break;
			case "ArrowLeft": {
				event.preventDefault();
				if (row.isFolder && row.expanded) {
					setExpanded(id, false);
					break;
				}
				const parent = id.split("/").slice(0, -1).join("/");
				if (parent) focusRow(parent);
				break;
			}
			case "Home":
				event.preventDefault();
				if (rows[0]) focusRow(rows[0].id);
				break;
			case "End": {
				event.preventDefault();
				const last = rows.at(-1);
				if (last) focusRow(last.id);
				break;
			}
			case "Enter":
			case " ":
				event.preventDefault();
				select(row.id, row.isFolder, row.expanded);
				break;
		}
	}

	const shared: Shared = {
		size,
		expandedIds,
		defaultExpanded,
		selected,
		activeId,
		indent,
		showGuides,
		select,
		setFocused,
		onKeyDown,
	};

	return (
		<div
			ref={root}
			role="tree"
			aria-label="Files"
			className={fileTree({ size }).root({ className })}
		>
			{tree.map((node) => (
				<TreeRow key={node.name} node={node} parent="" depth={0} shared={shared} />
			))}
		</div>
	);
}
