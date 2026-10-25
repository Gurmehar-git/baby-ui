<script lang="ts">
import {
	BANNER_SPOTS,
	Button,
	CtaBanner,
	CtaBannerActions,
	CtaBannerBadge,
	CtaBannerContent,
	CtaBannerDescription,
	CtaBannerFloater,
	CtaBannerGrain,
	CtaBannerNote,
	CtaBannerTicker,
	CtaBannerTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { BANNER_ICONS } from "../data/cta-banner";
import { controlProps } from "../data/preview-props";

type Controls = Partial<
	ComponentProps<typeof CtaBanner> &
		ComponentProps<typeof CtaBannerGrain> &
		ComponentProps<typeof CtaBannerTicker>
> & { title?: string };

let { props = {} }: { props?: Record<string, unknown> } = $props();

// The site's h2 face is a display font; demos stay on the body face.
const FRAME = "w-full max-w-6xl [&_h2]:font-sans";
const p = $derived(controlProps<Controls>(props));
const num = (value: unknown) => (value === undefined ? undefined : Number(value));
const floaters = BANNER_ICONS.floaters.flatMap((paths, i) => {
	const spot = BANNER_SPOTS[i];
	return spot ? [{ paths, spot, duration: 6 + i }] : [];
});
</script>

{#snippet stroke(paths: readonly string[])}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#each paths as d (d)}<path {d} />{/each}
	</svg>
{/snippet}

{#if p.variant === "ticker"}
	<CtaBanner variant="ticker" size={p.size} tint={p.tint} speed={num(p.speed)} class={FRAME}>
		<CtaBannerTicker word="Baby UI" angle={num(p.angle)} rows={num(p.rows)} veil={p.veil}>
			{#snippet mark()}{@render stroke(BANNER_ICONS.floaters[5])}{/snippet}
		</CtaBannerTicker>
		<CtaBannerContent>
			<CtaBannerTitle>{p.title ?? "Ready to build?"}</CtaBannerTitle>
			<CtaBannerDescription>
				Install any component as source with the shadcn CLI, in React or Svelte, and own every line.
			</CtaBannerDescription>
			<CtaBannerActions>
				<Button size="lg" variant="secondary">Get started</Button>
				<Button size="lg" variant="dark">Browse components</Button>
			</CtaBannerActions>
		</CtaBannerContent>
	</CtaBanner>
{:else}
	<CtaBanner variant="grain" size={p.size} tint={p.tint} speed={num(p.speed)} class={FRAME}>
		<CtaBannerGrain noise={num(p.noise)} lines={p.lines} />
		{#each floaters as { paths, spot, duration } (paths[0])}
			<CtaBannerFloater x={spot.x} y={spot.y} delay={spot.delay} {duration} class={spot.size}>
				{@render stroke(paths)}
			</CtaBannerFloater>
		{/each}
		<CtaBannerContent>
			<CtaBannerBadge>{@render stroke(BANNER_ICONS.badge)}</CtaBannerBadge>
			<CtaBannerTitle>{p.title ?? "One spec. Two frameworks. Every component."}</CtaBannerTitle>
			<CtaBannerActions>
				<Button variant="dark">Browse components</Button>
				<Button variant="secondary">Star on GitHub</Button>
			</CtaBannerActions>
			<CtaBannerNote>
				No account, no lock-in.
				<strong>The source lands in your repo, ready to change.</strong>
			</CtaBannerNote>
		</CtaBannerContent>
	</CtaBanner>
{/if}
