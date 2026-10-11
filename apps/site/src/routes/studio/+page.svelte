<script lang="ts">
import Seo from "#lib/components/seo.svelte";
import { demos } from "#lib/demos.js";
import { breadcrumbLd, collectionLd } from "#lib/seo.js";
import LiveComponent from "#lib/studio/live-component.svelte";
import { STUDIOS } from "#lib/studio/studios.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

// Icons are components, so they come from the client list rather than the serialised data.
const iconFor = (slug: string) => STUDIOS.find((studio) => studio.slug === slug)?.icon;
</script>

<Seo
	title="Free design tools: OG image, chart and background generators"
	description="Free in-browser design tools: an Open Graph image generator, a chart maker and an animated background generator. Tune live, then copy React or Svelte code."
	tag="Free tools"
	keywords={[
		"free design tools",
		"og image generator",
		"chart maker",
		"animated background generator",
		"ui playground",
		"react components",
		"svelte components",
	]}
	jsonLd={[
		collectionLd({
			name: "Baby UI Studio",
			description: "Free in-browser design tools for React and Svelte.",
			path: "/studio",
			items: STUDIOS.map((s) => ({ name: s.name, path: s.href, description: s.seo.description })),
		}),
		breadcrumbLd([{ name: "Studio", path: "/studio" }]),
	]}
/>

<main class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
	<h1 class="font-semibold text-3xl text-foreground tracking-tight">Studio</h1>
	<p class="mt-2 max-w-xl text-muted-foreground">
		Free design tools: an OG image generator, a chart maker and an animated background
		generator. Tune live, see it in context, then copy the React or Svelte code.
	</p>
	<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.studios as studio (studio.slug)}
			{@const Glyph = iconFor(studio.slug)}
			<li>
				<a
					href={studio.href}
					class="group/studio flex h-full flex-col rounded-2xl bg-card p-1.5 transition-[background-color,scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] hover:bg-muted active:scale-[0.99] motion-reduce:transition-none"
				>
					<div class="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-background shadow-xs">
						<div class="absolute inset-0 transition-transform duration-[var(--duration-dialog)] ease-[var(--ease-ui-out)] group-hover/studio:scale-[1.03] motion-reduce:transition-none">
							{#if studio.preview.kind === "component"}
								<LiveComponent slug={studio.preview.slug} entry={studio.entry} props={studio.thumb} />
							{:else}
								{#await demos[studio.preview.slug]?.() then mod}
									{#if mod}
										{@const Demo = mod.default}
										<!-- Demos lay out at reading width; scaled down, the whole chart fits the card. -->
										<div inert class="pointer-events-none absolute top-1/2 left-1/2 w-[200%] origin-center -translate-x-1/2 -translate-y-1/2 scale-50 p-6">
											<Demo props={{}} />
										</div>
									{/if}
								{/await}
							{/if}
						</div>
					</div>
					<div class="px-2 pt-3 pb-2">
						<div class="flex items-center gap-2">
							{#if Glyph}
								<span class="grid size-6 shrink-0 place-items-center rounded-md bg-foreground text-background">
									<Glyph size={14} />
								</span>
							{/if}
							<h2 class="truncate font-medium text-base text-foreground">{studio.name}</h2>
						</div>
						<p class="mt-1.5 line-clamp-2 text-muted-foreground text-sm">{studio.description}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</main>
