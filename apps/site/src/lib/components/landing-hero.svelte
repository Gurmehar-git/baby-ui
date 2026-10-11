<script lang="ts">
import { IconArrowRight } from "@baby-ui/icons";
import { Button, DiaText, FillButton, ShimmerText } from "@baby-ui/svelte";
import HeroPrism from "./hero-prism.svelte";

let { newCount = 0 }: { newCount?: number } = $props();

// Rounded down to a multiple of five, so the badge reads "55+" rather than an exact tally.
const newLabel = $derived(
	newCount >= 5 ? `${Math.floor(newCount / 5) * 5}+` : String(newCount),
);

const TAILS = [
	"agent interfaces.",
	"data dashboards.",
	"complex forms.",
	"readable charts.",
];

// Fades in below the header so nav text stays readable, and dims in dark mode, where the
// background's highlight is the light foreground and would wash the page out.
const BG_CLASS =
	"-z-10 [mask-image:linear-gradient(to_bottom,transparent,black_9rem,black_45%,transparent)] dark:opacity-55";
</script>

<!-- Pulled up under the fixed header, so the header stays transparent over the hero's background. -->
<div class="relative isolate -mt-14 flex min-h-svh flex-col justify-center overflow-x-clip pt-14">
	<HeroPrism class={BG_CLASS} />

	<!-- Text protection that fades to nothing at its own edge, so no ring shows. -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-14 -z-10 mx-auto h-[40rem] max-w-5xl bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--background)_86%,transparent)_0%,color-mix(in_oklch,var(--background)_62%,transparent)_55%,transparent_100%)]"
	></div>

	<!-- Fills the first screen, so the showcase starts below the fold. -->
	<div class="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center md:py-20">
		{#if newCount > 0}
			<!-- p-px: the rotating beam shows through as a 1px ring around the pill. -->
			<a
				href="/components#new"
				class="hero-in group relative mb-7 inline-flex rounded-full bg-border p-px text-foreground text-xs transition-[scale] duration-150 ease-[var(--ease-ui-out)] active:scale-[0.97] motion-reduce:transition-none"
			>
				<span aria-hidden="true" class="new-beam absolute inset-0 rounded-full"></span>
				<span aria-hidden="true" class="new-beam absolute -inset-1 rounded-full opacity-50 blur-md"></span>
				<span class="relative inline-flex items-center gap-2 rounded-full bg-background py-1 pr-3 pl-1">
					<span class="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 font-medium text-primary-foreground">
						<span aria-hidden="true" class="new-dot size-1.5 rounded-full bg-primary-foreground"></span>
						New
					</span>
					<ShimmerText as="span" text="{newLabel} components just landed" />
					<IconArrowRight
						size={13}
						aria-hidden="true"
						class="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
					/>
				</span>
			</a>
		{/if}

		<h1 class="hero-in font-normal text-[2.5rem] text-foreground leading-[1.04] tracking-[-0.05em] sm:text-6xl xl:text-7xl" style:--i="1">
			<span class="block">Accessible UI for</span>
			<!-- One line reserved for the cycling tail, so swapping words never reflows the page. -->
			<span class="block h-[1.04em] whitespace-nowrap">
				<DiaText text={TAILS} repeat triggerOnView={false} durationMs={900} repeatDelayMs={2600} />
			</span>
		</h1>

		<p
			class="hero-in mt-6 max-w-xl text-pretty text-base text-foreground/75 leading-7 sm:text-lg sm:leading-8"
			style:--i="2"
		>
			React and Svelte components for the screens products ship, installed as source with the
			shadcn CLI.
		</p>

		<div class="hero-in mt-9 flex flex-wrap items-center justify-center gap-3" style:--i="3">
			<FillButton href="/components">Browse components</FillButton>
			<Button href="/docs/installation" variant="ghost" size="lg" class="group h-11 rounded-xl">
				Read the docs
				<IconArrowRight
					aria-hidden="true"
					class="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
				/>
			</Button>
		</div>

	</div>
</div>

<style>
	/* One entrance, played once: 400ms per block, 50ms apart, done by 550ms. */
	.hero-in {
		animation: hero-in 400ms var(--ease-ui-out) both;
		animation-delay: calc(var(--i, 0) * 50ms);
	}

	/* Phones: visible from the first frame, so the headline is the LCP paint; it only rises. */
	@media (max-width: 767px) {
		.hero-in {
			animation-name: hero-rise;
		}
	}

	/* Keyboard focus never waits for an entrance to finish. */
	.hero-in:focus-within {
		animation: none;
	}

	@keyframes hero-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@keyframes hero-rise {
		from {
			transform: translateY(8px);
		}
	}

	/* Registered so the conic gradient's start angle can animate. */
	@property --beam-angle {
		syntax: "<angle>";
		inherits: false;
		initial-value: 0deg;
	}

	.new-beam {
		background: conic-gradient(
			from var(--beam-angle),
			transparent 0% 65%,
			var(--primary) 82%,
			color-mix(in oklch, var(--primary) 40%, var(--foreground)) 90%,
			transparent 100%
		);
		animation: beam-spin 3s linear infinite;
	}

	.new-dot {
		animation: dot-pulse 1.6s var(--ease-ui-out) infinite;
	}

	@keyframes beam-spin {
		to {
			--beam-angle: 360deg;
		}
	}

	@keyframes dot-pulse {
		0% {
			box-shadow: 0 0 0 0 color-mix(in oklch, var(--primary-foreground) 70%, transparent);
		}
		100% {
			box-shadow: 0 0 0 5px transparent;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-in,
		.new-beam,
		.new-dot {
			animation: none;
		}
	}
</style>
