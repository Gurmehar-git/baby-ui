<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { resizable } from "./variants";

let {
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> & { class?: string } =
	$props();

const s = resizable();
</script>

{#snippet chevron(d: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"><path {d} /></svg
	>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	role="separator"
	tabindex="0"
	aria-orientation="vertical"
	aria-valuenow={50}
	data-slot="resizable-handle"
	data-collapsed="open"
	class={cn(s.handle(), classProp)}
	{...rest}
>
	<span aria-hidden="true" class={s.grip()}></span>
	<span aria-hidden="true" class={cn(s.restore(), s.before())}>{@render chevron("m9 18 6-6-6-6")}</span>
	<span aria-hidden="true" class={cn(s.restore(), s.after())}>{@render chevron("m15 18-6-6 6-6")}</span>
</div>
