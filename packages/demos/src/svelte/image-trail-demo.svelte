<script lang="ts">
import { ImageTrail } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ImageTrail>>(props));

const images = [10, 11, 15, 16, 17, 20, 28, 29].map(
	(id) => `https://picsum.photos/id/${id}/300/400`,
);
</script>

<ImageTrail
	{images}
	variant={p.variant ?? "fall"}
	size={p.size ?? "default"}
	threshold={Number(props.threshold ?? 80)}
	duration={Number(props.duration ?? 1600)}
	class="w-full max-w-3xl rounded-xl border border-border"
>
	<p class="text-muted-foreground text-sm">Move the pointer here</p>
</ImageTrail>
