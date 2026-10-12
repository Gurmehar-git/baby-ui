<script lang="ts">
import { ImageCompare } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { photo } from "../data/media";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ImageCompare>>(props));
const SRC = photo(1018, 900, 600);
</script>

<div class="w-full max-w-xl">
	<ImageCompare orientation={p.orientation ?? "horizontal"} variant={p.variant ?? "default"} size={p.size ?? "default"} hover={p.hover ?? false} labels={["Graded", "Original"]}>
		{#snippet before()}
			<img src={`${SRC}?grayscale`} alt="Mountain lake, colour graded to black and white" />
		{/snippet}
		{#snippet after()}
			<img src={SRC} alt="Mountain lake in original colour" />
		{/snippet}
	</ImageCompare>
</div>
