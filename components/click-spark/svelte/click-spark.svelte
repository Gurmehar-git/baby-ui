<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { createSparks } from "./sparks";
import { type ClickSparkScope, type ClickSparkTone, clickSpark } from "./variants";

let {
	tone = "foreground",
	scope = "page",
	count = 8,
	size = 10,
	radius = 15,
	durationMs = 400,
	class: classProp,
}: {
	tone?: ClickSparkTone;
	/** `page` covers the viewport; `parent` fills and listens on a positioned parent only. */
	scope?: ClickSparkScope;
	/** Lines per burst. */
	count?: number;
	/** Starting line length, px. */
	size?: number;
	/** How far the lines travel, px. */
	radius?: number;
	durationMs?: number;
	class?: string;
} = $props();

let canvas: HTMLCanvasElement | undefined = $state();
let sparks: ReturnType<typeof createSparks> | undefined;
const options = $derived({ count, size, radius, durationMs });

$effect(() => {
	const el = canvas;
	const area = scope;
	if (!el) return;
	sparks = untrack(() => createSparks(el, area, options));
	return () => sparks?.destroy();
});

$effect(() => {
	sparks?.update(options);
});
</script>

<canvas
	bind:this={canvas}
	data-slot="click-spark"
	aria-hidden="true"
	class={cn(clickSpark({ tone, scope }), classProp)}
></canvas>
