<script lang="ts">
import { type FileTreeNode, flatten } from "./types";
import { type FileTreeSize, fileTree, ROW_INSET } from "./variants";

type Props = {
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
	class?: string;
	indent?: number;
	showGuides?: boolean;
	size?: FileTreeSize;
};

let {
	tree,
	expandedIds: expandedIdsProp,
	defaultExpandedIds = {},
	onExpandedIdsChange,
	defaultExpanded = true,
	selected: selectedProp,
	defaultSelected = null,
	onSelectedChange,
	class: classProp,
	indent = 14,
	showGuides = true,
	size = "default",
}: Props = $props();

// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let internalExpandedIds = $state(defaultExpandedIds);
const expandedIds = $derived(expandedIdsProp ?? internalExpandedIds);
// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let internalSelected = $state(defaultSelected);
const selected = $derived(selectedProp ?? internalSelected);
let focused = $state<string | null>(null);
let root = $state<HTMLDivElement>();

// Visible-only rows, purely for keyboard math (arrow/home/end). Rendering itself is
// recursive below and keeps every row mounted so a folder can animate its collapse.
const rows = $derived(flatten(tree, expandedIds, defaultExpanded));
const activeId = $derived(
	(focused && rows.some((r) => r.id === focused) ? focused : rows[0]?.id) ?? null,
);

function setExpanded(id: string, next: boolean) {
	const nextIds = { ...expandedIds, [id]: next };
	if (expandedIdsProp === undefined) internalExpandedIds = nextIds;
	onExpandedIdsChange?.(nextIds);
}

function setSelected(id: string) {
	if (selectedProp === undefined) internalSelected = id;
	onSelectedChange?.(id);
}

function focusRow(id: string) {
	focused = id;
	root?.querySelector<HTMLElement>(`[data-row="${CSS.escape(id)}"]`)?.focus();
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

function onkeydown(event: KeyboardEvent, id: string) {
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
</script>

<!-- A folder's children stay mounted and collapse via grid-template-rows (0fr <-> 1fr),
	the same technique Collapsible uses: real height animates instead of rows just
	vanishing, and there's a real frame to animate from since nothing unmounts. -->
{#snippet treeRow(node: FileTreeNode, parent: string, depth: number)}
	{@const id = parent ? `${parent}/${node.name}` : node.name}
	{@const isFolder = Array.isArray(node.children)}
	{@const expanded = isFolder ? (expandedIds[id] ?? defaultExpanded) : false}
	{@const styles = fileTree({ size, selected: selected === id, guide: showGuides && depth > 0 })}
	<div
		role="treeitem"
		aria-level={depth + 1}
		aria-selected={selected === id}
		aria-expanded={isFolder ? expanded : undefined}
		data-row={id}
		tabindex={activeId === id ? 0 : -1}
		onkeydown={(e) => onkeydown(e, id)}
		onclick={() => select(id, isFolder, expanded)}
		onfocus={() => (focused = id)}
		style:padding-left="{depth * indent + ROW_INSET[size]}px"
		class={styles.row()}
	>
		{#if isFolder}
			<svg
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
				class={styles.chevron()}
				style:transform={expanded ? "rotate(90deg)" : "none"}
			>
				<path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		{:else}
			<span class={styles.spacer()}></span>
		{/if}
		<span class={styles.name()}>{node.name}</span>
	</div>
	{#if isFolder && node.children}
		<div
			role="group"
			inert={!expanded}
			data-open={expanded ? "" : undefined}
			class={styles.group()}
		>
			<div class={styles.groupInner()}>
				{#each node.children as child (child.name)}
					{@render treeRow(child, id, depth + 1)}
				{/each}
			</div>
		</div>
	{/if}
{/snippet}

<div
	bind:this={root}
	role="tree"
	aria-label="Files"
	class={fileTree({ size }).root({ class: classProp })}
>
	{#each tree as node (node.name)}
		{@render treeRow(node, "", 0)}
	{/each}
</div>
