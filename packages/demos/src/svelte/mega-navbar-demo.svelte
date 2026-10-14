<script lang="ts">
import { Button, type MegaMenuGroup, MegaNavbar } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MegaNavbar>>(props));

const variant = $derived(p.variant ?? "solid");

const GROUPS: MegaMenuGroup[] = [
	{
		label: "Product",
		href: "https://recast.li/features",
		eyebrow: "What Recast does",
		description:
			"Record your screen, trim it and share a link in seconds, from one desktop app.",
		items: [
			{
				label: "Features",
				href: "https://recast.li/features",
				description: "Everything Recast does, end to end",
				external: true,
			},
			{
				label: "Download",
				href: "https://recast.li/download",
				description: "macOS, Windows and Linux builds",
				external: true,
			},
			{
				label: "Pricing",
				href: "https://recast.li/pricing",
				description: "Free to record, paid to share at scale",
				external: true,
			},
		],
		footer: {
			label: "Start recording free",
			href: "https://recast.li/download",
			hint: "No account needed",
		},
	},
	{
		label: "Tools",
		href: "https://recast.li/tools",
		eyebrow: "Free in the browser",
		description:
			"Quick fixes for any video file. Everything runs on your device; nothing is uploaded.",
		items: [
			{
				label: "Trim video",
				href: "https://recast.li/tools/trim-video",
				description: "Cut to the part you want, losslessly",
				external: true,
			},
			{
				label: "Compress video",
				href: "https://recast.li/tools/compress-video",
				description: "Shrink a file to fit an upload cap",
				external: true,
			},
		],
		footer: {
			label: "Browse all tools",
			href: "https://recast.li/tools",
			hint: "Free, nothing uploaded",
		},
	},
	{
		label: "Resources",
		href: "https://recast.li/blog",
		eyebrow: "Follow along",
		description: "What we are shipping, how it is built and where the code lives.",
		items: [
			{
				label: "Blog",
				href: "https://recast.li/blog",
				description: "What we are building and why",
				external: true,
			},
			{
				label: "GitHub",
				href: "https://github.com/kanakkholwal/recast",
				description: "Source, issues and releases",
				external: true,
			},
		],
	},
];

const links = [
	{ label: "Changelog", href: "https://recast.li/changelog", external: true },
];
</script>

<!-- No overflow clipping: the menu panels open past the bar, as on a real page. -->
<div class="isolate w-full max-w-5xl rounded-xl border border-border bg-background">
	<MegaNavbar
		active={p.active || undefined}
		sticky={false}
		blur={props.blur !== false}
		{variant}
		class={variant === "solid" ? "rounded-t-[11px] border-border border-b bg-card" : undefined}
		groups={GROUPS}
		{links}
	>
		{#snippet brand()}
			<span class="grid size-7 place-items-center rounded-lg bg-foreground p-1">
				<svg width="20" height="20" viewBox="0 0 584 584" fill="none" aria-hidden="true">
					<rect width="584" height="584" rx="75" class="fill-foreground" />
					<path d="M200.12 204.56C200.12 167.8 170.32 138 133.56 138C96.7999 138 67 167.8 67 204.56V378.64C67 415.4 96.7999 445.2 133.56 445.2C170.32 445.2 200.12 415.4 200.12 378.64V204.56Z" class="fill-background" />
					<path d="M358.84 204.56C358.84 167.8 329.04 138 292.28 138C255.52 138 225.72 167.8 225.72 204.56V378.64C225.72 415.4 255.52 445.2 292.28 445.2C329.04 445.2 358.84 415.4 358.84 378.64V204.56Z" class="fill-background" />
					<path d="M517.56 204.56C517.56 167.8 487.76 138 451 138C414.24 138 384.44 167.8 384.44 204.56V378.64C384.44 415.4 414.24 445.2 451 445.2C487.76 445.2 517.56 415.4 517.56 378.64V204.56Z" class="fill-background" />
				</svg>
			</span>
			<span class="whitespace-nowrap font-semibold text-foreground text-lg tracking-wide">Recast</span>
		{/snippet}
		{#snippet actions()}
			<Button href="https://recast.li/download" variant="dark">Download</Button>
		{/snippet}
	</MegaNavbar>
	<div class="flex min-h-[26rem] flex-col items-center justify-center gap-4 px-6 text-center">
		<h3 class="max-w-md text-balance font-sans font-semibold text-3xl text-foreground tracking-tight">
			Record, trim and share in one place
		</h3>
		<p class="max-w-sm text-pretty text-muted-foreground">
			Hover the menu to open a section; move along the bar to slide between them.
		</p>
	</div>
</div>
