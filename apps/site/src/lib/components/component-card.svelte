<script lang="ts" module>
import type { DemoLoader } from "@baby-ui/demos/svelte";
import { SvelteMap } from "svelte/reactivity";
import { tv, type VariantProps } from "tailwind-variants";

const cardFrame = tv({
	base: "w-full",
	variants: {
		frame: { compact: "h-40", sm: "h-44", md: "h-56", lg: "h-72", xl: "h-88" },
	},
	defaultVariants: { frame: "md" },
});

export type CardFrame = NonNullable<VariantProps<typeof cardFrame>["frame"]>;

/** Each frame's height in px: the masonry places tiles from it, and `content-visibility` reserves it. */
export const FRAME_PX: Record<CardFrame, number> = {
	compact: 160,
	sm: 176,
	md: 224,
	lg: 288,
	xl: 352,
};

const EMAIL_PX = 640;
const loaded = new SvelteMap<string, Awaited<ReturnType<DemoLoader>>>();
</script>

<script lang="ts">
import {
	Badge,
	CopyButton,
	ShowcaseCard,
	ShowcaseCardAction,
	ShowcaseCardCopy,
	ShowcaseCardDescription,
	ShowcaseCardFooter,
	ShowcaseCardLink,
	ShowcaseCardPreview,
	ShowcaseCardTitle,
	Spinner,
} from "@baby-ui/svelte";
import { mode } from "mode-watcher";
import { untrack } from "svelte";
import { demos } from "#lib/demos.js";
import { installArgs } from "#lib/install.js";
import { claim, type LiveSlot, watchLive } from "#lib/live-demo.js";
import { pmCommand } from "#lib/pm.js";
import { prefs } from "#lib/preferences.svelte.js";
import type { CardItem } from "#lib/registry.js";

let { item, frame = "md" }: { item: CardItem; frame?: CardFrame } = $props();

let stage = $state<HTMLElement>();
let live = $state(false);
const slot: LiveSlot = { visible: false, release: () => (live = false) };

function activate() {
	if (live) return;
	live = true;
	claim(slot);
}

$effect(() => {
	if (!stage) return;
	const slug = item.slug;
	return watchLive(stage, slot, activate, { ready: () => loaded.has(slug) });
});

const email = $derived(item.category === "emails");
const cached = $derived(loaded.get(item.slug));
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

function fitEmail(event: Event) {
	if (!(event.currentTarget instanceof HTMLIFrameElement)) return;
	const root = event.currentTarget.contentDocument?.documentElement;
	if (root) root.style.scrollbarWidth = "none";
	emailHeight = root?.scrollHeight ?? 0;
}

const demoProps = $derived(item.defaults);
const intrinsic = $derived(FRAME_PX[frame]);
const installCommand = $derived(pmCommand("dlx", installArgs(item.slug), prefs.pm));
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

{#snippet demoView(Demo: Awaited<ReturnType<DemoLoader>>["default"])}
	<div class="pointer-events-none flex w-full scale-90 justify-center opacity-90 transition-opacity duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] group-hover/showcase:opacity-100 motion-reduce:transition-none">
		<Demo props={demoProps} />
	</div>
{/snippet}

{#snippet stageContent()}
	<ShowcaseCardPreview
		class="relative grid h-full min-w-0 place-items-center overflow-hidden bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]"
	>
		<div
			bind:this={stage}
			bind:clientWidth={stageWidth}
			class="absolute inset-0 grid min-w-0 place-items-center overflow-hidden p-4"
		>
			{#if email}
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
	</ShowcaseCardPreview>
{/snippet}

<ShowcaseCard
	variant="morphing"
	size="sm"
	class={cardFrame({ frame, class: "[content-visibility:auto]" })}
	style="contain-intrinsic-block-size: auto {intrinsic}px"
	onpointerenter={(event) => {
		if (event.pointerType === "mouse") activate();
	}}
	onfocusin={activate}
>
	{@render stageContent()}
	<ShowcaseCardLink href={item.href} aria-label="View {item.name}" />
	<ShowcaseCardFooter>
		<ShowcaseCardCopy>
			<ShowcaseCardTitle class="flex items-center gap-2">
				<span class="truncate">{item.name}</span>
				{@render badges()}
			</ShowcaseCardTitle>
			<ShowcaseCardDescription>{item.description}</ShowcaseCardDescription>
		</ShowcaseCardCopy>
		<ShowcaseCardAction>
			<CopyButton
				text={installCommand}
				label="Copy {item.name} install command"
				iconOnly
				class="size-8 rounded-full bg-background"
			/>
		</ShowcaseCardAction>
	</ShowcaseCardFooter>
</ShowcaseCard>
