<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { tipState, tipsPanelState } from "./context";

let {
	primary = false,
	doneLabel = "Done",
	loading,
	disabled,
	onclick,
	class: classProp,
	children,
}: {
	/** The dark button; use it on the one tip that matters most. */
	primary?: boolean;
	doneLabel?: string;
	loading?: boolean;
	disabled?: boolean;
	onclick?: () => void;
	class?: string;
	children?: Snippet;
} = $props();
const ctx = tipsPanelState("TipsPanelAction");
const tip = tipState("TipsPanelAction");
const isDone = $derived(ctx.done.includes(tip.value));
let status = $state<HTMLSpanElement>();
let hadFocus = false;

// The button leaves the DOM when taken; focus follows to the status so keyboard users stay put.
$effect(() => {
	if (isDone && hadFocus) status?.focus();
});
</script>

<!-- The tip's one action: marks it done, then runs `onclick`. Once done it reads `doneLabel`. -->
{#if isDone}
	<span bind:this={status} role="status" tabindex="-1" data-slot="tips-panel-done" class={ctx.styles.done()}>
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<circle cx="8" cy="8" r="7" fill="currentColor" />
			<path d="m5 8.2 2 2 4-4.2" fill="none" stroke="var(--background)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		{doneLabel}
	</span>
{:else}
	<Button
		data-slot="tips-panel-action"
		variant={primary ? "default" : "outline"}
		size="sm"
		class={classProp}
		{loading}
		{disabled}
		onclick={(event: MouseEvent) => {
			hadFocus = event.currentTarget === document.activeElement;
			ctx.markDone(tip.value);
			onclick?.();
		}}
	>
		{@render children?.()}
	</Button>
{/if}
