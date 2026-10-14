<script lang="ts">
import Seo from "#lib/components/seo.svelte";
import ColourPairs from "#lib/design-system/colour-pairs.svelte";
import ControlLadder from "#lib/design-system/control-ladder.svelte";
import FieldStates from "#lib/design-system/field-states.svelte";
import Foundations from "#lib/design-system/foundations.svelte";
import TokenReference from "#lib/design-system/token-reference.svelte";
import { breadcrumbLd } from "#lib/seo.js";

let { data } = $props();

const SECTIONS = [
	{ id: "scale", label: "Control scale" },
	{ id: "colour", label: "Colour" },
	{ id: "states", label: "States" },
	{ id: "radius", label: "Radius" },
	{ id: "type", label: "Type" },
	{ id: "elevation", label: "Elevation" },
	{ id: "motion", label: "Motion" },
	{ id: "tokens", label: "Every token" },
];
</script>

<Seo
	title="Design system: scale, tokens and states"
	description="Baby UI's design system, measured live: one control ladder for every size, concentric radii, colour pairs with contrast ratios, type, elevation and motion tokens."
	tag="Design system"
	keywords={["design system", "design tokens", "shadcn design system", "ui component sizes", "contrast"]}
	jsonLd={[breadcrumbLd([{ name: "Design system", path: "/design-system" }])]}
/>

<main class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
	<header class="max-w-2xl">
		<p class="font-medium text-muted-foreground text-xs uppercase tracking-wider">Design system</p>
		<h1 class="mt-2 font-semibold text-3xl text-foreground tracking-tight">One scale, measured</h1>
		<p class="mt-3 text-muted-foreground">
			The rules every component follows, rendered with the real components. Numbers on this page are
			read from the browser, so they always match what ships.
		</p>
	</header>

	<div class="mt-10 grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)]">
		<nav aria-label="Sections" class="lg:sticky lg:top-24 lg:self-start">
			<ul class="flex gap-1 overflow-x-auto lg:flex-col">
				{#each SECTIONS as s (s.id)}
					<li>
						<a
							href="#{s.id}"
							class="block whitespace-nowrap rounded-lg px-2.5 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							{s.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="flex min-w-0 flex-col gap-16">
			<section id="scale" class="scroll-mt-24">
				<h2 class="font-semibold text-foreground text-xl tracking-tight">Control scale</h2>
				<p class="mt-1 mb-6 max-w-2xl text-muted-foreground text-sm">
					Five sizes with shadcn's names. Two controls of one size always line up: same height, and a
					radius held near a quarter of it, so small controls never turn into pills.
				</p>
				<ControlLadder />
			</section>

			<section id="colour" class="scroll-mt-24">
				<h2 class="font-semibold text-foreground text-xl tracking-tight">Colour</h2>
				<p class="mt-1 mb-6 max-w-2xl text-muted-foreground text-sm">
					Neutral surfaces in distinct steps, one brand accent and four status tones. Text pairs clear
					4.5:1, focus rings 3:1.
				</p>
				<ColourPairs />
			</section>

			<section id="states" class="scroll-mt-24">
				<h2 class="font-semibold text-foreground text-xl tracking-tight">States</h2>
				<p class="mt-1 mb-6 max-w-2xl text-muted-foreground text-sm">
					Every field shares one frame, so a state looks the same on an input, a select and a textarea.
				</p>
				<FieldStates />
			</section>

			<Foundations />

			<section id="tokens" class="scroll-mt-24">
				<h2 class="font-semibold text-foreground text-xl tracking-tight">Every token</h2>
				<p class="mt-1 mb-6 max-w-2xl text-muted-foreground text-sm">
					Each variable the theme declares, read from the token files at build time and grouped by job,
					beside real components that use it. Values follow the current theme.
				</p>
				<TokenReference groups={data.groups} />
			</section>
		</div>
	</div>
</main>
