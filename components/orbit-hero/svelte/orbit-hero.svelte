<script lang="ts" generics="T">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import {
	ORBIT_HERO_LABELS,
	ORBIT_HERO_TONES,
	ORBIT_INNER_RADIUS,
	ORBIT_OUTER_RADIUS,
	orbitDelay,
	orbitPlace,
	spinOrbits,
} from "../orbit";
import type { OrbitHeroGroup, OrbitHeroLabels, OrbitHeroTone } from "../types";
import { type OrbitHeroSize, type OrbitHeroVariant, orbitHero } from "../variants";
import { setOrbitHero } from "./context";

type Props = HTMLAttributes<HTMLElement> & {
	/** Copy parts: OrbitHeroContent and friends. */
	children?: Snippet;
	/** Item sets for the rings; the centre's top half cycles through them. */
	groups: OrbitHeroGroup<T>[];
	/** Draws one ring item, usually a 24px-grid icon; it is sized to 32px. */
	item: Snippet<[T]>;
	tones?: OrbitHeroTone[];
	/** Bindable index into `groups`. */
	group?: number;
	onGroupChange?: (group: number) => void;
	/** Bindable index into `tones`. */
	tone?: number;
	onToneChange?: (tone: number) => void;
	/** Ms between automatic changes, alternating group and tone; 0 stops them. */
	interval?: number;
	labels?: Partial<OrbitHeroLabels>;
	variant?: OrbitHeroVariant;
	size?: OrbitHeroSize;
};

let {
	groups,
	item,
	tones = ORBIT_HERO_TONES,
	group = $bindable(0),
	onGroupChange,
	tone = $bindable(0),
	onToneChange,
	interval = 4000,
	labels: labelsProp,
	variant = "panel",
	size = "screen",
	class: classProp,
	style,
	children,
	...rest
}: Props = $props();

const wrap = (index: number, length: number) =>
	length ? ((index % length) + length) % length : 0;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const noiseId = $props.id();
const s = $derived(orbitHero({ variant, size }));
setOrbitHero({
	get styles() {
		return s;
	},
});
const labels = $derived({ ...ORBIT_HERO_LABELS, ...labelsProp });
const groupIndex = $derived(wrap(group, groups.length));
const toneIndex = $derived(wrap(tone, tones.length));
const current = $derived(groups[groupIndex]);
const currentTone = $derived(tones[toneIndex]);
const counts = $derived(groups.map((g) => g.count ?? g.outer.length + g.inner.length));
const maxCount = $derived(Math.max(1, ...counts));

// The value shown before the last change, and a counter that re-keys the swap animation.
let groupSwap = $state({ at: -1, from: -1, beat: 0 });
let toneSwap = $state({ at: -1, from: -1, beat: 0 });
$effect.pre(() => {
	const g = groupIndex;
	untrack(() => {
		if (groupSwap.at === -1) groupSwap = { at: g, from: -1, beat: 0 };
		else if (groupSwap.at !== g)
			groupSwap = { at: g, from: groupSwap.at, beat: groupSwap.beat + 1 };
	});
});
$effect.pre(() => {
	const t = toneIndex;
	untrack(() => {
		if (toneSwap.at === -1) toneSwap = { at: t, from: -1, beat: 0 };
		else if (toneSwap.at !== t)
			toneSwap = { at: t, from: toneSwap.at, beat: toneSwap.beat + 1 };
	});
});
const previous = $derived(groups[groupSwap.from]);
const previousTone = $derived(tones[toneSwap.from]);
const swapping = $derived(groupSwap.beat > 0 && previous !== undefined);
const inClass = $derived(groupSwap.beat > 0 ? "orbit-hero-in" : "");

function nextGroup() {
	group = wrap(groupIndex + 1, groups.length);
	onGroupChange?.(group);
}

function nextTone() {
	tone = wrap(toneIndex + 1, tones.length);
	onToneChange?.(tone);
}

$effect(() => {
	if (!interval || reducedMotion()) return;
	let cycle = 0;
	const id = setInterval(() => {
		if (cycle % 2 === 0) nextGroup();
		else nextTone();
		cycle += 1;
	}, interval);
	return () => clearInterval(id);
});

let stage: HTMLDivElement | undefined = $state();
let outer: HTMLDivElement | undefined = $state();
let inner: HTMLDivElement | undefined = $state();
$effect(() => {
	if (!stage || !outer || !inner || reducedMotion()) return;
	return spinOrbits(stage, outer, inner);
});
</script>

{#snippet ring(items: T[], radius: number, reverse: boolean, cls: string)}
	{#each items as entry, i (i)}
		<span
			class={cn(s.item(), cls)}
			style:translate={orbitPlace(i, items.length, radius)}
			style:--orbit-delay={orbitDelay(reverse ? items.length - i - 1 : i)}
		>
			{@render item(entry)}
		</span>
	{/each}
{/snippet}

<!-- Copy parts (OrbitHeroContent and friends) beside two rings of items that cycle by group and tone. -->
<section
	data-slot="orbit-hero"
	class={cn(s.root(), classProp)}
	style={[style, currentTone ? `--orbit-tone: ${currentTone.color}` : ""].filter(Boolean).join(";")}
	{...rest}
>
	<div class={s.panel()}>
		<svg aria-hidden="true" class={s.noise()}>
			<filter id={noiseId}>
				<feTurbulence type="fractalNoise" baseFrequency="0.54" numOctaves="4" stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
				<feComponentTransfer>
					<feFuncR type="linear" slope="0.61" />
					<feFuncG type="linear" slope="0.61" />
					<feFuncB type="linear" slope="0.61" />
					<feFuncA type="linear" slope="1" />
				</feComponentTransfer>
				<feComponentTransfer>
					<feFuncR type="linear" slope="3" intercept="-1" />
					<feFuncG type="linear" slope="3" intercept="-1" />
					<feFuncB type="linear" slope="3" intercept="-1" />
				</feComponentTransfer>
			</filter>
			<rect width="100%" height="100%" filter="url(#{noiseId})" />
		</svg>
		<div aria-hidden="true" class={s.glow()}></div>
		<div aria-hidden="true" class={s.glowWarm()}></div>
		<div aria-hidden="true" class={s.vignette()}></div>

		{@render children?.()}

		<div bind:this={stage} class={s.stage()}>
			{#if current}
				<div aria-hidden="true" class={s.readouts()}>
					<div class={s.countReadout()}>
						<div class={s.readoutRow()}>
							<span class={s.readoutLabel()}>{current.label}</span>
							{#key groupSwap.beat}
								<span class={s.readoutValue()}>{counts[groupIndex]}</span>
							{/key}
						</div>
						<div class={s.bars()}>
							{#each counts as count, i (i)}
								<span
									data-active={i === groupIndex}
									class={s.bar()}
									style:height="{Math.max(3, (count / maxCount) * 28)}px"
								></span>
							{/each}
						</div>
					</div>
					<div class={s.toneReadout()}>
						<div class={s.readoutRow()}>
							<span class={s.swatch()}></span>
							<span class={s.readoutLabel()}>Tone</span>
							{#key toneSwap.beat}
								<span class={s.toneValue()}>{currentTone?.label}</span>
							{/key}
						</div>
					</div>
				</div>
			{/if}

			<div class={s.wheel()}>
				<div class={s.visual()}>
					<div class={s.ringBox()}><div class={s.ringOuter()}></div></div>
					<div class={s.ringBox()}><div class={s.ringMiddle()}></div></div>
					<div class={s.ringBox()}><div class={s.ringInner()}></div></div>

					<div aria-hidden="true" class={s.orbits()}>
						<div bind:this={outer} class={s.orbit()}>
							{#key groupSwap.beat}
								{#if swapping && previous}
									{@render ring(previous.outer, ORBIT_OUTER_RADIUS, false, "orbit-hero-out")}
								{/if}
								{#if current}
									{@render ring(current.outer, ORBIT_OUTER_RADIUS, false, inClass)}
								{/if}
							{/key}
						</div>
						<div bind:this={inner} class={s.orbit()}>
							{#key groupSwap.beat}
								{#if swapping && previous}
									{@render ring(previous.inner, ORBIT_INNER_RADIUS, true, "orbit-hero-out")}
								{/if}
								{#if current}
									{@render ring(current.inner, ORBIT_INNER_RADIUS, true, inClass)}
								{/if}
							{/key}
						</div>
					</div>

					<div class={s.controlsBox()}>
						<div class={s.controls()}>
							<Button
								variant="ghost"
								class={s.groupControl()}
								aria-label="{labels.group}, currently {current?.label ?? ''}"
								onclick={nextGroup}
							>
								{#key groupSwap.beat}
									{#if swapping && previous}
										<span class={cn(s.groupLabel(), "orbit-hero-label-out")}>{previous.label}</span>
									{/if}
									<span class={cn(s.groupLabel(), groupSwap.beat > 0 && "orbit-hero-label-in")}>
										{current?.label}
									</span>
								{/key}
							</Button>
							<Button
								variant="ghost"
								class={s.toneControl()}
								aria-label="{labels.tone}, currently {currentTone?.label ?? ''}"
								onclick={nextTone}
							>
								{#key toneSwap.beat}
									{#if toneSwap.beat > 0 && previousTone}
										<span class={cn(s.toneLabel(), "orbit-hero-label-out")}>{previousTone.label}</span>
									{/if}
									<span class={cn(s.toneLabel(), toneSwap.beat > 0 && "orbit-hero-label-in")}>
										{currentTone?.label}
									</span>
								{/key}
							</Button>
						</div>
					</div>

					{#key groupSwap.beat + toneSwap.beat}
						{#if groupSwap.beat + toneSwap.beat > 0}
							<span aria-hidden="true" class={s.ripple()}></span>
						{/if}
					{/key}
				</div>
			</div>
		</div>
	</div>
</section>
