<script lang="ts">
import { WheelCarousel } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { WHEEL_ITEMS } from "../data/wheel";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof WheelCarousel>>(props));
</script>

<WheelCarousel
	items={WHEEL_ITEMS}
	photoSide={p.photoSide ?? "left"}
	aspect={p.aspect ?? "3/4"}
	size={p.size ?? "default"}
	visibleItems={Number(props.visibleItems ?? 7)}
	spacing={Number(props.spacing ?? 14)}
	radius={Number(props.radius ?? 320)}
	snap={p.snap ?? true}
	momentum={p.momentum ?? true}
	showMarker={p.showMarker ?? true}
	photoWidth={32}
	class="h-[420px]"
/>
