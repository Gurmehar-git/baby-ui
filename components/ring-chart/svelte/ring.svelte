<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { CHART_DURATION, type Playback, Spring, tween } from "../../chart/svelte/motion";
import {
	EXPAND_FROM,
	expandDelay,
	POP_SPRING,
	RING_END,
	RING_START,
	type RingLayout,
	type RingRow,
	ringPath,
	sweepDelay,
} from "./geometry";

let {
	row,
	index,
	ring,
	round,
	active,
	pushed,
	faded,
	instant,
	signature,
	animate,
	class: className,
	trackClass,
	onenter,
}: {
	row: RingRow;
	index: number;
	ring: RingLayout;
	round: boolean;
	active: boolean;
	pushed: boolean;
	faded: boolean;
	instant: boolean;
	signature: string;
	animate: boolean;
	class: string;
	trackClass: string;
	onenter: () => void;
} = $props();

let group = $state<SVGGElement | null>(null);
let progressPath = $state<SVGPathElement | null>(null);
// svelte-ignore state_referenced_locally
let expand = animate ? 0 : 1;
// svelte-ignore state_referenced_locally
let sweep = animate ? 0 : 1;
let hoverScale = 1;

function apply() {
	const scale = (EXPAND_FROM + (1 - EXPAND_FROM) * expand) * hoverScale;
	if (group) {
		group.style.transform = `scale(${scale})`;
		group.style.opacity = String(expand);
	}
	const end =
		RING_START + (RING_END - RING_START) * Math.min(1, row.value / row.max) * sweep;
	progressPath?.setAttribute(
		"d",
		ringPath(ring.inner, ring.outer, RING_START, end, round),
	);
}

const spring = new Spring(1, POP_SPRING, (v) => {
	hoverScale = v;
	untrack(apply);
});

$effect(() => {
	const target = active ? 1.03 : pushed ? 1.02 : 1;
	if (instant) spring.jump(target);
	else spring.set(target);
});

$effect(() => {
	ring;
	row;
	round;
	group;
	progressPath;
	untrack(apply);
});

$effect(() => {
	signature;
	const on = animate;
	if (!group || !progressPath) return;
	const playbacks: Playback[] = [];
	untrack(() => {
		if (!on) {
			expand = 1;
			sweep = 1;
			apply();
			return;
		}
		expand = 0;
		sweep = 0;
		apply();
		playbacks.push(
			tween({
				duration: CHART_DURATION.enter,
				delay: expandDelay(index),
				onUpdate: (p) => {
					expand = p;
					apply();
				},
			}),
			tween({
				duration: CHART_DURATION.enter,
				delay: sweepDelay(index),
				onUpdate: (p) => {
					sweep = p;
					apply();
				},
			}),
		);
	});
	return () => {
		for (const playback of playbacks) playback.stop();
	};
});

$effect(() => () => spring.stop());
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<g
	data-slot="ring"
	data-key={row.key}
	data-active={active ? "" : undefined}
	class={className}
	style:opacity={faded ? 0.35 : 1}
	style:filter={active ? `drop-shadow(0 0 12px ${row.color})` : undefined}
	onpointerenter={onenter}
>
	<g bind:this={group} style:transform-origin="0px 0px">
		<path class={trackClass} d={ringPath(ring.inner, ring.outer, RING_START, RING_END, round)} />
		<path bind:this={progressPath} fill={row.color} />
	</g>
</g>
