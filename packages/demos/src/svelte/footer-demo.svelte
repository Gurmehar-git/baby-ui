<script lang="ts">
import {
	Button,
	Footer,
	type FooterColumn,
	type FooterLink,
	type FooterSocialLink,
} from "@baby-ui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Footer>>(props));

const COLUMNS: FooterColumn[] = [
	{
		title: "Product",
		links: [
			{
				label: "Features",
				href: "https://recast.li/features",
				external: true,
				description: "Zoom, cursor smoothing, captions",
			},
			{
				label: "Download",
				href: "https://recast.li/download",
				external: true,
				description: "Windows, macOS and Linux",
			},
			{
				label: "Pricing",
				href: "https://recast.li/pricing",
				external: true,
				description: "Free to record",
			},
			{
				label: "Sign in",
				href: "https://recast.li/login",
				external: true,
				description: "The optional cloud tier",
			},
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Tools", href: "https://recast.li/tools", external: true },
			{ label: "Blog", href: "https://recast.li/blog", external: true },
			{ label: "GitHub", href: "https://github.com/kanakkholwal/recast", external: true },
			{ label: "Changelog", href: "https://recast.li/changelog", external: true },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "Contact", href: "mailto:try-recast@gmail.com" },
			{ label: "X / Twitter", href: "https://x.com/kanakkholwal", external: true },
		],
	},
];

const LEGAL: FooterLink[] = [
	{ label: "Privacy", href: "https://recast.li/privacy-policy", external: true },
	{ label: "Terms", href: "https://recast.li/terms-of-service", external: true },
];
</script>

{#snippet githubIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
{/snippet}

{#snippet xIcon()}
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.6l-5.2-6.8L5.3 22H2.2l8.1-9.3L2 2h6.8l4.7 6.2Zm-1.2 18h1.7L7.5 4H5.6Z" /></svg>
{/snippet}

{#snippet mailIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
{/snippet}

{#snippet copyright()}
	© {new Date().getFullYear()} Recast. All rights reserved.
{/snippet}

<Footer
	wordmark={p.wordmark ?? "Recast"}
	layout={p.layout ?? "split"}
	status={{ label: "All systems normal", href: "#status" }}
	description={p.description || "Turns a raw screen capture into a polished, shareable demo while you record."}
	columns={COLUMNS}
	socials={[
		{ icon: githubIcon, href: "https://github.com/kanakkholwal/recast", label: "GitHub" },
		{ icon: xIcon, href: "https://x.com/kanakkholwal", label: "X / Twitter" },
		{ icon: mailIcon, href: "mailto:try-recast@gmail.com", label: "Email" },
	] as FooterSocialLink[]}
	copyright={copyright as unknown as Snippet}
	legal={LEGAL}
	topHref="#top"
	topLabel={p.topLabel || "Back to top"}
>
	{#snippet actions()}
		<Button href="https://github.com/kanakkholwal/recast/releases" size="sm" variant="ghost">Releases</Button>
	{/snippet}
	{#snippet brand()}
		<span class="grid size-8 place-items-center rounded-lg bg-foreground p-1">
			<svg width="22" height="22" viewBox="0 0 584 584" fill="none" aria-hidden="true">
				<rect width="584" height="584" rx="75" class="fill-foreground" />
				<path d="M200.12 204.56C200.12 167.8 170.32 138 133.56 138C96.7999 138 67 167.8 67 204.56V378.64C67 415.4 96.7999 445.2 133.56 445.2C170.32 445.2 200.12 415.4 200.12 378.64V204.56Z" class="fill-background" />
				<path d="M358.84 204.56C358.84 167.8 329.04 138 292.28 138C255.52 138 225.72 167.8 225.72 204.56V378.64C225.72 415.4 255.52 445.2 292.28 445.2C329.04 445.2 358.84 415.4 358.84 378.64V204.56Z" class="fill-background" />
				<path d="M517.56 204.56C517.56 167.8 487.76 138 451 138C414.24 138 384.44 167.8 384.44 204.56V378.64C384.44 415.4 414.24 445.2 451 445.2C487.76 445.2 517.56 415.4 517.56 378.64V204.56Z" class="fill-background" />
			</svg>
		</span>
		<span class="font-semibold text-foreground text-lg">Recast</span>
	{/snippet}
</Footer>
