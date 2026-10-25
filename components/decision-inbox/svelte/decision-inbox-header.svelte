<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { decisionInboxState } from "./context";

let {
	label = (open: number) =>
		open === 0 ? "All caught up" : `${open} ${open === 1 ? "needs" : "need"} your input`,
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
	label?: (open: number) => string;
} = $props();
const ctx = decisionInboxState("DecisionInboxHeader");
const open = $derived(ctx.items.filter((i) => ctx.answers[i] === undefined).length);
</script>

<!-- How many decisions wait, announced politely; it turns green at zero. -->
<header
	data-slot="decision-inbox-header"
	data-clear={open === 0 || undefined}
	tabindex="-1"
	{...rest}
	class={cn(ctx.styles.header(), "outline-none", classProp)}
>
	{#if open === 0}
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<circle cx="8" cy="8" r="7" fill="currentColor" />
			<path d="m5 8.2 2 2 4-4.2" fill="none" stroke="var(--background)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	{:else}
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<path d="M6.7 2.3a1.5 1.5 0 0 1 2.6 0l5.4 9.4A1.5 1.5 0 0 1 13.4 14H2.6a1.5 1.5 0 0 1-1.3-2.3Z" fill="currentColor" />
			<path d="M8 5.6v3.6" stroke="var(--background)" stroke-width="1.5" stroke-linecap="round" />
			<circle cx="8" cy="11.4" r="0.85" fill="var(--background)" />
		</svg>
	{/if}
	<span aria-live="polite">{label(open)}</span>
</header>
