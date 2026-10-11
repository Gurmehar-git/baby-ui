<script lang="ts">
import { Toggle } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TOGGLE_BOOKMARK } from "../data/toggle";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Toggle>>(props));

let pressed = $state(false);

$effect(() => {
	pressed = p.pressed ?? false;
});
</script>

<Toggle
	bind:pressed
	variant={p.variant ?? "default"}
	size={p.size ?? "default"}
	disabled={p.disabled ?? false}
>
	<!-- The outline fills once pressed, so the state reads from the glyph as well as the fill. -->
	<svg
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
		class="size-4 fill-transparent transition-[fill] duration-(--duration-fast) in-aria-pressed:fill-current"
	>
		<path
			d={TOGGLE_BOOKMARK.path}
			stroke="currentColor"
			stroke-width="1.4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	{TOGGLE_BOOKMARK.label}
</Toggle>
