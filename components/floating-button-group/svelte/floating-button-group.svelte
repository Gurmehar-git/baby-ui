<script lang="ts" module>
import type { Snippet } from "svelte";

export type FloatingButtonGroupAction = {
	type?: "action";
	/** Stable key, also passed to `onAction`. */
	id: string;
	/** Visible label, and the accessible name when only the icon shows. */
	label: string;
	icon?: Snippet;
	/** Shows only the icon, with the label in a tooltip. Overrides the group's `iconOnly`. */
	iconOnly?: boolean;
	onSelect?: () => void;
	disabled?: boolean;
	/** A mode that switches on, such as Present: sets aria-pressed and keeps a tint while on. */
	pressed?: boolean;
	/** A hint shown in the tooltip, such as "⌘Z"; the key is not bound. */
	shortcut?: string;
	/** Other labels this item switches to, such as ["Copied"]; the button keeps the widest width. */
	reserveLabels?: readonly string[];
};
export type FloatingButtonGroupSeparator = { type: "separator"; id?: string };
export type FloatingButtonGroupItem =
	| FloatingButtonGroupAction
	| FloatingButtonGroupSeparator;
</script>

<script lang="ts">
import { Toolbar } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import Tooltip from "../../tooltip/svelte/tooltip.svelte";
import TooltipContent from "../../tooltip/svelte/tooltip-content.svelte";
import TooltipProvider from "../../tooltip/svelte/tooltip-provider.svelte";
import TooltipTrigger from "../../tooltip/svelte/tooltip-trigger.svelte";
import { createTray } from "./tray";
import {
	type FloatingButtonGroupSize,
	type FloatingButtonGroupVariant,
	floatingButtonGroup,
} from "./variants";

let {
	items,
	label,
	variant = "default",
	size = "default",
	orientation = "horizontal",
	iconOnly: groupIconOnly = false,
	tooltipSide,
	onAction,
	class: classProp,
}: {
	items: readonly FloatingButtonGroupItem[];
	/** Accessible name of the toolbar, e.g. "Board actions". */
	label: string;
	/** `floating` raises the tray for overlays such as a selection toolbar. */
	variant?: FloatingButtonGroupVariant;
	size?: FloatingButtonGroupSize;
	orientation?: "horizontal" | "vertical";
	/** Every item shows only its icon, with its label in a tooltip. */
	iconOnly?: boolean;
	/** Side of the tooltips; top for a row and right for a column by default. */
	tooltipSide?: "top" | "bottom" | "left" | "right";
	/** Called with the item id after the item's own `onSelect`. */
	onAction?: (id: string) => void;
	class?: string;
} = $props();

let root = $state<HTMLElement | null>(null);
let highlight = $state<HTMLElement>();
$effect(() => {
	if (root && highlight) return createTray(root, highlight);
});

const s = $derived(floatingButtonGroup({ variant, size }));
const side = $derived(tooltipSide ?? (orientation === "vertical" ? "right" : "top"));
const isAction = (item: FloatingButtonGroupItem): item is FloatingButtonGroupAction =>
	item.type !== "separator";
const iconOnlyOf = (item: FloatingButtonGroupAction) =>
	!!item.icon && (item.iconOnly ?? groupIconOnly);
const select = (item: FloatingButtonGroupAction) => {
	if (item.disabled) return;
	item.onSelect?.();
	onAction?.(item.id);
};
</script>

{#snippet body(item: FloatingButtonGroupAction)}
	{@const iconOnly = iconOnlyOf(item)}
	<span class={s.slot()}>
		{#if !iconOnly}
			{#each [...new Set([item.label, ...(item.reserveLabels ?? [])])] as text (text)}
				<span aria-hidden="true" class={s.ghost()}>
					{#if item.icon}<span class={s.icon()}></span>{/if}
					{text}
				</span>
			{/each}
		{/if}
		{#key item.label}
			<span class={s.phase()}>
				{#if item.icon}<span aria-hidden="true" class={s.icon()}>{@render item.icon()}</span>{/if}
				{#if !iconOnly}{item.label}{/if}
			</span>
		{/key}
	</span>
{/snippet}

<TooltipProvider>
<Toolbar.Root
	bind:ref={root}
	aria-label={label}
	{orientation}
	data-slot="floating-button-group"
	class={cn(s.root(), classProp)}
>
	<span bind:this={highlight} aria-hidden="true" class={s.highlight()}></span>
	{#each items as item, position (item.id ?? `separator-${position}`)}
		{#if !isAction(item)}
			<div
				role="separator"
				aria-orientation={orientation === "vertical" ? "horizontal" : "vertical"}
				class={s.separator()}
			></div>
		{:else if iconOnlyOf(item) || item.shortcut}
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Toolbar.Button
							{...props}
							data-fbg-item=""
							data-icon={item.icon ? "" : undefined}
							data-icon-only={iconOnlyOf(item) || undefined}
							aria-label={item.label}
							aria-pressed={item.pressed}
							aria-disabled={item.disabled || undefined}
							class={cn(String(props.class ?? ""), s.item())}
							onclick={() => select(item)}
						>
							{@render body(item)}
						</Toolbar.Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent {side}>
					{item.label}
					{#if item.shortcut}<kbd class={s.kbd()}>{item.shortcut}</kbd>{/if}
				</TooltipContent>
			</Tooltip>
		{:else}
			<Toolbar.Button
				data-fbg-item=""
				data-icon={item.icon ? "" : undefined}
				aria-label={item.label}
				aria-pressed={item.pressed}
				aria-disabled={item.disabled || undefined}
				class={s.item()}
				onclick={() => select(item)}
			>
				{@render body(item)}
			</Toolbar.Button>
		{/if}
	{/each}
</Toolbar.Root>
</TooltipProvider>
