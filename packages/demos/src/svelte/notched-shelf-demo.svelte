<script lang="ts">
import { NotchedShelf } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NotchedShelf>>(props));

const variant = $derived(p.variant ?? "solid");
const layout = $derived(p.layout ?? "hanging");
const size = $derived(p.size ?? "default");
</script>

<!-- Muted matches the card, so it bridges into a page-coloured surface instead. -->
<div
	class={[
		"flex h-64 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border",
		variant === "muted" ? "bg-background" : "bg-card",
		layout === "rising" ? "justify-end" : "justify-start",
	]}
>
	<NotchedShelf
		{variant}
		{layout}
		{size}
		shape={p.shape ?? "smooth"}
		align={p.align ?? "center"}
		edge={props.edge === true}
	>
		<a
			href="#top"
			class={[
				"inline-flex items-center gap-2 rounded-full font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
				size === "sm" ? "px-3 text-xs" : size === "lg" ? "px-6 text-sm" : "px-5 text-sm",
			]}
		>
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
				<path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" />
			</svg>
			Back to top
		</a>
	</NotchedShelf>
</div>
