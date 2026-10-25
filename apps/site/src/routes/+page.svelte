<script lang="ts">
import HomeCta from "#lib/components/home-cta.svelte";
import HomeNew from "#lib/components/home-new.svelte";
import HomeShowcase from "#lib/components/home-showcase.svelte";
import InstallCommand from "#lib/components/install-command.svelte";
import LandingHero from "#lib/components/landing-hero.svelte";
import Seo from "#lib/components/seo.svelte";
import SiteFooter from "#lib/components/site-footer.svelte";
import { componentCountLabel } from "#lib/registry.js";
import {
	DEFAULT_KEYWORDS,
	HOME_TITLE,
	homeDescription,
	organizationLd,
	softwareApplicationLd,
	websiteLd,
} from "#lib/seo.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const total = $derived(data.total ?? 0);

const DESCRIPTION = $derived(homeDescription(total));

// Featured slugs, cycled so the terminal shows the CLI installing something new each beat.
const SHOWCASE = $derived([...data.grid, ...data.fresh].map((item) => item.slug));
let showcaseIndex = $state(0);
const showcaseSlug = $derived(SHOWCASE[showcaseIndex % SHOWCASE.length] ?? "line-chart");

$effect(() => {
	const count = SHOWCASE.length;
	if (count < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const id = setInterval(() => {
		showcaseIndex = (showcaseIndex + 1) % count;
	}, 2400);
	return () => clearInterval(id);
});
</script>

<Seo
	title={HOME_TITLE}
	description={DESCRIPTION}
	tag="{componentCountLabel(total)} components"
	jsonLd={[
		organizationLd(),
		websiteLd(DESCRIPTION),
		softwareApplicationLd({
			description: DESCRIPTION,
			keywords: DEFAULT_KEYWORDS,
			componentCount: total,
		}),
	]}
/>

<main class="relative">
	<LandingHero newCount={data.freshCount} />

	<HomeShowcase items={data.grid} />

	{#if data.fresh.length}
		<HomeNew items={data.fresh} count={data.freshCount} />
	{/if}

	<section aria-labelledby="home-install-heading" class="mx-auto max-w-2xl px-4 pb-24">
		<h2 id="home-install-heading" class="mb-4 text-center text-muted-foreground text-sm">
			One command per component. It lands in your project as source.
		</h2>
		<InstallCommand slug={showcaseSlug} cascade />
		<p class="mt-4 text-center text-muted-foreground text-xs">
			New here? <a
				href="/docs/installation"
				class="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
			>Read the install guide</a>.
		</p>
	</section>

	<HomeCta count={total} />

	<SiteFooter />
</main>
