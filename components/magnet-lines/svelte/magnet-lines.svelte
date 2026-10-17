<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type MagnetLinesOptions, mountMagnetLines } from "../magnet";
import { type MagnetLinesSize, type MagnetLinesTone, magnetLines } from "../variants";

let {
	rows = 9,
	columns = 9,
	size = "default",
	tone = "muted",
	baseAngle = 0,
	class: classProp,
}: {
	rows?: number;
	columns?: number;
	size?: MagnetLinesSize;
	tone?: MagnetLinesTone;
	/** Degrees added to every line's pointer angle; also the resting angle. */
	baseAngle?: number;
	class?: string;
} = $props();

let root: HTMLDivElement | undefined = $state();
let engine: ReturnType<typeof mountMagnetLines> | undefined;
const s = $derived(magnetLines({ size, tone }));
const r = $derived(Math.max(1, Math.floor(rows)));
const c = $derived(Math.max(1, Math.floor(columns)));
const options: MagnetLinesOptions = $derived({ baseAngle });

$effect(() => {
	const el = root;
	if (!el) return;
	const mounted = untrack(() => mountMagnetLines(el, options));
	engine = mounted;
	return () => {
		mounted.destroy();
		engine = undefined;
	};
});

$effect(() => {
	void r;
	void c;
	void size;
	engine?.update(options);
});
</script>

<div
	bind:this={root}
	aria-hidden="true"
	data-slot="magnet-lines"
	class={cn(s.root(), classProp)}
	style:grid-template-columns={`repeat(${c}, minmax(0, 1fr))`}
	style:grid-template-rows={`repeat(${r}, minmax(0, 1fr))`}
	style:--ml-base={`${baseAngle}deg`}
>
	{#each { length: r * c }, i (i)}
		<span data-slot="magnet-lines-line" class={s.line()}></span>
	{/each}
</div>
