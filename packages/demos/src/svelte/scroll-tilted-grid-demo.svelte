<script lang="ts">
import { ScrollTiltedGrid } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TILTED_IMAGES } from "../data/stacks";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ScrollTiltedGrid>>(props));
</script>

<ScrollTiltedGrid
	images={TILTED_IMAGES}
	size={p.size ?? "default"}
	aspect={p.aspect ?? "portrait"}
	radius={p.radius ?? "sm"}
	maxTilt={Number(props.maxTilt ?? 62)}
	maxBlur={Number(props.maxBlur ?? 7)}
	perspective={Number(props.perspective ?? 1000)}
	repeat={Number(props.repeat ?? 1)}
	class="max-w-3xl"
/>
