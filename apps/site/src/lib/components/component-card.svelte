<script lang="ts" module>
import type { DemoLoader } from "@baby-ui/demos/svelte";
import { SvelteMap } from "svelte/reactivity";
import { tv, type VariantProps } from "tailwind-variants";

const preview = tv({
	base: "relative grid min-w-0 shrink-0 grid-cols-[minmax(0,1fr)] place-items-center overflow-hidden bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-4",
	variants: {
		frame: { sm: "h-44", md: "h-56", lg: "h-72", xl: "h-88" },
		// A tile is the preview alone; a card insets it under the title and description.
		tile: {
			true: "rounded-xl border border-border transition-[border-color,scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] group-hover/card:border-border-strong group-active/card:scale-[0.99] motion-reduce:transition-none",
			false: "mt-auto rounded-[7px]",
		},
	},
	defaultVariants: { frame: "md", tile: false },
});

export type CardFrame = NonNullable<VariantProps<typeof preview>["frame"]>;

/** Each frame's height in px: the masonry places tiles from it, and `content-visibility` reserves it. */
export const FRAME_PX: Record<CardFrame, number> = { sm: 176, md: 224, lg: 288, xl: 352 };
// Email layouts are 600px wide plus the body's gutter; the thumbnail scales this down to fit.
const EMAIL_PX = 640;
const CARD_HEADER_PX = 96;

// Loaded demo modules by slug, so a card scrolled back into view remounts without a spinner.
const loaded = new SvelteMap<string, Awaited<ReturnType<DemoLoader>>>();
</script>

<script lang="ts">
import { Badge, Spinner } from "@baby-ui/svelte";
import { mode } from "mode-watcher";
import { untrack } from "svelte";
import { demos } from "#lib/demos.js";
import { claim, type LiveSlot, watchLive } from "#lib/live-demo.js";
import { prefs } from "#lib/preferences.svelte.js";
import type { CardItem } from "#lib/registry.js";

let {
	item,
	frame = "md",
	tile = false,
}: { item: CardItem; frame?: CardFrame; tile?: boolean } = $props();

let stage = $state<HTMLElement>();
let live = $state(false);

const slot: LiveSlot = { visible: false, release: () => (live = false) };

function activate() {
	if (live) return;
	live = true;
	claim(slot);
}

// Live after resting in view while idle, at once if its module is loaded; the pool evicts.
$effect(() => {
	if (!stage) return;
	const slug = item.slug;
	return watchLive(stage, slot, activate, { ready: () => loaded.has(slug) });
});

// Emails show their build-time render, so no demo mounts for them.
const email = $derived(item.category === "emails");
const cached = $derived(loaded.get(item.slug));
// Untracked, so filling the cache mid-load doesn't swap the resolving branch for a remount.
const demoPromise = $derived.by(() => {
	const slug = item.slug;
	if (!live || email || untrack(() => loaded.has(slug))) return undefined;
	return demos[slug]?.().then((mod) => {
		loaded.set(slug, mod);
		return mod;
	});
});
let stageWidth = $state(0);
let emailHeight = $state(0);
const emailScale = $derived(stageWidth / EMAIL_PX);

// The iframe takes the email's full height so it never scrolls; the tile clips it instead.
function fitEmail(event: Event) {
	if (!(event.currentTarget instanceof HTMLIFrameElement)) return;
	const root = event.currentTarget.contentDocument?.documentElement;
	if (root) root.style.scrollbarWidth = "none";
	emailHeight = root?.scrollHeight ?? 0;
}
const demoProps = $derived(item.defaults);
const intrinsic = $derived(FRAME_PX[frame] + (tile ? 0 : CARD_HEADER_PX));
</script>

{#snippet badges()}
	{#if item.tier === "pro"}
		<Badge size="sm" variant="gold">Pro</Badge>
	{/if}
	{#if item.isNew}
		<Badge size="sm" variant="info">New</Badge>
	{:else if item.isUpdated}
		<Badge size="sm" variant="success">Updated</Badge>
	{/if}
{/snippet}

{#snippet stageContent()}
	<!-- Fixed height: a demo resolving inside must never resize the card or shift the grid. -->
	<div bind:this={stage} bind:clientWidth={stageWidth} class={preview({ frame, tile })}>
		{#if email}
			<!-- The top of the email at reading width, scaled to the tile; static HTML, no scripts. -->
			<iframe
				src="/components/{item.category}/{item.slug}/email/{prefs.framework}.html"
				title="{item.name} preview"
				loading="lazy"
				sandbox="allow-same-origin"
				tabindex="-1"
				aria-hidden="true"
				onload={fitEmail}
				style:width="{EMAIL_PX}px"
				style:height="{Math.max(emailHeight, emailScale ? FRAME_PX[frame] / emailScale : 0)}px"
				style:transform="scale({emailScale})"
				style:color-scheme={mode.current === "dark" ? "dark" : "light"}
				class="pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-transparent"
			></iframe>
		{:else if demoPromise}
			{#await demoPromise}
				<Spinner size="sm" label="Loading preview" class="text-muted-foreground" />
			{:then mod}
				{@render demoView(mod.default)}
			{/await}
		{:else if live && cached}
			{@render demoView(cached.default)}
		{/if}
	</div>
{/snippet}

{#snippet demoView(Demo: Awaited<ReturnType<DemoLoader>>["default"])}
	<!-- w-full: as a shrink-to-fit grid item, w-full demos (every chart) resolved to 0. -->
	<div
		class="pointer-events-none flex w-full scale-90 justify-center opacity-90 transition-opacity duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] group-hover/card:opacity-100 motion-reduce:transition-none"
	>
		<Demo props={demoProps} />
	</div>
{/snippet}

<!-- Hover or focus mounts the demo at once; touch screens rely on the in-view rule. -->
<article
	class="group/card relative h-full min-w-0 [content-visibility:auto]"
	style:contain-intrinsic-block-size="auto {intrinsic}px"
	onpointerenter={(e) => {
		if (e.pointerType === "mouse") activate();
	}}
	onfocusin={activate}
>
	<a
		href={item.href}
		aria-label="View {item.name}"
		class="absolute inset-0 z-20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	></a>
	{#if tile}
		{@render stageContent()}
		<!-- The name surfaces like a popover on hover or focus; touch screens, with no hover, always show it. -->
		<p
			aria-hidden="true"
			class="pointer-events-none absolute bottom-2.5 left-2.5 z-10 flex max-w-[calc(100%-1.25rem)] translate-y-1 items-center gap-1.5 rounded-full border border-border bg-popover/90 px-2.5 py-1 font-medium text-foreground text-xs opacity-0 shadow-(--overlay-shadow) backdrop-blur-md transition-[opacity,translate] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
		>
			<span class="truncate">{item.name}</span>
			{@render badges()}
		</p>
	{:else}
		<!-- The same inset frame as the component page's preview, so a card reads as a small preview. -->
		<div
			class="relative flex h-full flex-col rounded-xl border border-border bg-card p-1 transition-[border-color,scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] group-hover/card:border-border-strong group-active/card:scale-[0.99] motion-reduce:transition-none"
		>
			<div class="px-3 pt-2.5 pb-3">
				<h3 class="flex items-center gap-2 font-semibold text-foreground text-sm">
					{item.name}
					{@render badges()}
				</h3>
				<p class="mt-1 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
					{item.description}
				</p>
			</div>
			{@render stageContent()}
		</div>
	{/if}
</article>
