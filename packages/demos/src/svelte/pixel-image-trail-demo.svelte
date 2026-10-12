<script lang="ts">
import { PixelImageTrail } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PixelImageTrail>>(props));
</script>

<PixelImageTrail
	src="https://picsum.photos/id/1015/1200/800"
	alt="A river winding through a mountain valley"
	variant={p.variant ?? "fade"}
	size={p.size ?? "default"}
	pixelSize={Number(props.pixelSize ?? 36)}
	fadeDuration={Number(props.fadeDuration ?? 900)}
	maxPixels={Number(props.maxPixels ?? 84)}
	initialPixels={Number(props.initialPixels ?? 24)}
	radius={Number(props.radius ?? 40)}
	class="max-w-3xl"
/>
