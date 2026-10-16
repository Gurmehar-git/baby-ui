<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { swappable } from "./variants";

let {
	class: classProp,
	children,
	...rest
}: { class?: string; children?: Snippet } & Omit<
	HTMLAttributes<HTMLSpanElement>,
	"class" | "children"
> = $props();
</script>

<!-- Optional grip: once an item holds one, only the grip starts a drag. -->
<span
	{...rest}
	data-swapy-handle=""
	data-slot="swappable-handle"
	aria-hidden="true"
	class={cn(swappable().handle(), classProp)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
			<circle cx="6" cy="4" r="1.2" />
			<circle cx="10" cy="4" r="1.2" />
			<circle cx="6" cy="8" r="1.2" />
			<circle cx="10" cy="8" r="1.2" />
			<circle cx="6" cy="12" r="1.2" />
			<circle cx="10" cy="12" r="1.2" />
		</svg>
	{/if}
</span>
