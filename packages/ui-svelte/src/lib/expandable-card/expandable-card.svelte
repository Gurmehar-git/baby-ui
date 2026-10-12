<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import Collapsible from "../collapsible/collapsible.svelte";
import CollapsibleContent from "../collapsible/collapsible-content.svelte";
import CollapsibleTrigger from "../collapsible/collapsible-trigger.svelte";
import { cn } from "../lib/cn";
import {
	type ExpandableCardSize,
	type ExpandableCardVariant,
	expandableCard,
} from "./variants";

let {
	title,
	description,
	children,
	open = $bindable(),
	defaultOpen = false,
	onOpenChange,
	width,
	expandedWidth,
	variant = "default",
	size = "default",
	class: classProp,
}: {
	title: string;
	/** A summary under the title; changed words rise in when it updates. */
	description?: string;
	children: Snippet;
	/** Bindable. Leave unset to let the card own it. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Closed width cap in px; never wider than the container. Fills it when omitted. */
	width?: number;
	/** Open width cap in px, so the card can grow sideways. Defaults to `width`. */
	expandedWidth?: number;
	variant?: ExpandableCardVariant;
	size?: ExpandableCardSize;
	class?: string;
} = $props();

let ownOpen = $state(untrack(() => defaultOpen));
const isOpen = $derived(open ?? ownOpen);
let track = $state<HTMLElement>();
function setOpen(next: boolean) {
	if (open === undefined) ownOpen = next;
	else open = next;
	onOpenChange?.(next);
}
const s = $derived(expandableCard({ variant, size }));
const closedCap = $derived(width ? `${width}px` : "100%");
</script>

<!-- Catches Escape bubbling up from the trigger or the panel; the div itself takes no focus. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={track}
	data-slot="expandable-card"
	class={s.track()}
	style:--ec-w={closedCap}
	style:--ec-xw={expandedWidth ? `${expandedWidth}px` : closedCap}
	onkeydown={(event) => {
		if (event.key !== "Escape" || !isOpen) return;
		event.preventDefault();
		setOpen(false);
		track?.querySelector<HTMLElement>("[data-slot=collapsible-trigger]")?.focus();
	}}
>
	<Collapsible bind:open={() => isOpen, setOpen} class={cn(s.card(), classProp)}>
		<CollapsibleTrigger class={s.trigger()}>
			<span class="min-w-0">
				<span class={s.title()}>{title}</span>
				{#if description}
					<span class={s.description()}>
						<span class="sr-only">{description}</span>
						<span aria-hidden="true">
							{#each description.split(/(\s+)/) as word, index (`${index}:${word}`)}
								<span class={s.word()}>{word}</span>
							{/each}
						</span>
					</span>
				{/if}
			</span>
		</CollapsibleTrigger>
		<CollapsibleContent class={s.panel()}>{@render children()}</CollapsibleContent>
	</Collapsible>
</div>
