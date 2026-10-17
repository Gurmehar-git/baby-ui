<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { CHART_DURATION, type Playback, Spring, tween } from "../../chart/motion";
import { arcPath, bisector, type PieSlice, POP_SPRING, sliceDelay } from "../geometry";
import type { PieHover } from "../variants";

let {
	slice,
	index,
	inner,
	outer,
	cornerRadius,
	hover,
	hoverOffset,
	active,
	faded,
	instant,
	signature,
	animate,
	class: className,
	onenter,
	onleave,
}: {
	slice: PieSlice;
	index: number;
	inner: number;
	outer: number;
	cornerRadius: number;
	hover: PieHover;
	hoverOffset: number;
	active: boolean;
	faded: boolean;
	instant: boolean;
	signature: string;
	animate: boolean;
	class: string;
	onenter: () => void;
	onleave: () => void;
} = $props();

let group = $state<SVGGElement | null>(null);
let path = $state<SVGPathElement | null>(null);
// svelte-ignore state_referenced_locally
let progress = animate ? 0 : 1;
// svelte-ignore state_referenced_locally
let radius = outer;

function draw() {
	const end = slice.startAngle + (slice.endAngle - slice.startAngle) * progress;
	path?.setAttribute(
		"d",
		arcPath(inner, radius, slice.startAngle, end, cornerRadius, slice.padAngle),
	);
}

// svelte-ignore state_referenced_locally
const grow = new Spring(outer, POP_SPRING, (v) => {
	radius = v;
	untrack(draw);
});
const shift = new Spring(0, POP_SPRING, (v) => {
	const at = untrack(() => bisector(slice.startAngle, slice.endAngle, v));
	if (group) group.style.transform = `translate(${at.x}px, ${at.y}px)`;
});

$effect(() => {
	const growTo = hover === "grow" && active ? outer + hoverOffset : outer;
	const shiftTo = hover === "translate" && active ? hoverOffset : 0;
	if (instant) {
		grow.jump(growTo);
		shift.jump(shiftTo);
	} else {
		grow.set(growTo);
		shift.set(shiftTo);
	}
});

$effect(() => {
	inner;
	slice;
	cornerRadius;
	path;
	untrack(draw);
});

$effect(() => {
	signature;
	const on = animate;
	const node = path;
	if (!node) return;
	let playback: Playback | null = null;
	untrack(() => {
		if (!on) {
			progress = 1;
			draw();
			return;
		}
		progress = 0;
		draw();
		playback = tween({
			duration: CHART_DURATION.enter,
			delay: sliceDelay(index),
			onUpdate: (p) => {
				progress = p;
				draw();
			},
		});
	});
	return () => playback?.stop();
});

$effect(() => () => {
	grow.stop();
	shift.stop();
});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<g
	bind:this={group}
	data-slot="pie-slice"
	data-key={slice.key}
	data-active={active ? "" : undefined}
	class={className}
	style:opacity={faded ? 0.4 : 1}
	style:filter={active ? `drop-shadow(0 0 12px ${slice.color})` : undefined}
	onpointerenter={onenter}
	onpointerleave={(event) => {
		const next = event.relatedTarget;
		if (!(next instanceof Element && next.closest("[data-slot=pie-slice]"))) onleave();
	}}
>
	<path bind:this={path} fill={slice.color} />
</g>
