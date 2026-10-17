<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import {
	layerState,
	placeRipple,
	type RipplePoint,
	type RippleTransitionImage,
	wrapIndex,
} from "../ripple";
import {
	RIPPLE_TRANSITION_RING_COUNT,
	type RippleTransitionRadius,
	type RippleTransitionRings,
	rippleTransition,
} from "../variants";

let {
	images,
	value = $bindable(0),
	onValueChange,
	duration = 1200,
	rings = "single",
	radius = "xl",
	label = "Show next image",
	class: classProp,
}: {
	/** Images in order; clicking advances to the next one. */
	images: readonly RippleTransitionImage[];
	/** Index of the current image; bindable. */
	value?: number;
	onValueChange?: (value: number) => void;
	/** Reveal length in ms. */
	duration?: number;
	rings?: RippleTransitionRings;
	radius?: RippleTransitionRadius;
	/** Accessible name of the advance button. */
	label?: string;
	class?: string;
} = $props();

let root: HTMLDivElement | undefined = $state();
let pending: RipplePoint | null = null;
const count = $derived(images.length);
const current = $derived(wrapIndex(value, count));
let shown = $state(untrack(() => wrapIndex(value, images.length)));
let reduced = $state(false);
const moving = $derived(current !== shown && !reduced);
const s = $derived(rippleTransition({ rings, radius }));

$effect(() => {
	const query = matchMedia("(prefers-reduced-motion: reduce)");
	const sync = () => {
		reduced = query.matches;
	};
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});

$effect(() => {
	if (reduced) shown = current;
});

$effect.pre(() => {
	void current;
	void shown;
	if (!moving || !root) return;
	placeRipple(root, pending);
	pending = null;
});

function go(step: number, point: RipplePoint | null) {
	if (count < 2 || moving) return;
	const next = wrapIndex(current + step, count);
	pending = point;
	value = next;
	onValueChange?.(next);
}

function onclick(e: MouseEvent & { currentTarget: HTMLButtonElement }) {
	if (e.detail === 0) return go(1, null);
	const box = e.currentTarget.getBoundingClientRect();
	go(1, { x: e.clientX - box.left, y: e.clientY - box.top });
}

function onkeydown(e: KeyboardEvent) {
	if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
	e.preventDefault();
	go(e.key === "ArrowRight" ? 1 : -1, null);
}

function onEnd(e: AnimationEvent) {
	if (e.target === e.currentTarget) shown = current;
}
</script>

<div
	bind:this={root}
	data-slot="ripple-transition"
	class={cn(s.root(), classProp)}
	style:--rt-duration={`${duration}ms`}
>
	{#each images as image, i (`${i}-${image.src}`)}
		{@const state = layerState(i, current, shown, moving)}
		<div
			aria-hidden={i === current ? undefined : true}
			class={s.layer({ state })}
			onanimationend={state === "enter" ? onEnd : undefined}
		>
			<img src={image.src} alt={image.alt} draggable="false" class={s.image()} />
		</div>
	{/each}
	{#if moving}
		{#key `${shown}-${current}`}
			<div aria-hidden="true" class={s.rings()}>
				{#each { length: RIPPLE_TRANSITION_RING_COUNT[rings] }, i (i)}
					<span
						class={s.ring()}
						style:animation-delay={`${Math.round(i * duration * 0.08)}ms`}
					></span>
				{/each}
			</div>
		{/key}
	{/if}
	<button type="button" aria-label={label} class={s.trigger()} {onclick} {onkeydown}></button>
	<span class="sr-only" aria-live="polite">{images[current]?.alt}</span>
</div>
