<script lang="ts">
import type { Snippet } from "svelte";
import Collapsible from "../collapsible/collapsible.svelte";
import CollapsibleContent from "../collapsible/collapsible-content.svelte";
import { cn } from "../lib/cn";
import { pillStyle } from "../lib/pill";
import NotchedShelf from "../notched-shelf/notched-shelf.svelte";
import Sheet from "../sheet/sheet.svelte";
import SheetContent from "../sheet/sheet-content.svelte";
import SheetHeader from "../sheet/sheet-header.svelte";
import SheetTitle from "../sheet/sheet-title.svelte";
import { capsuleBox, currentHref, groupHrefs } from "./current";
import MegaMenu from "./mega-menu.svelte";
import MegaNavbarExpand from "./mega-navbar-expand.svelte";
import type { MegaMenuGroup, MegaNavLink } from "./types";
import { type MegaNavbarVariant, megaNavbar } from "./variants";

let {
	brand,
	groups,
	links = [],
	actions,
	mobileActions,
	active,
	sticky = true,
	blur = true,
	variant = "solid",
	class: className,
}: {
	brand?: Snippet;
	groups: MegaMenuGroup[];
	links?: MegaNavLink[];
	actions?: Snippet;
	mobileActions?: Snippet;
	active?: string;
	sticky?: boolean;
	blur?: boolean;
	variant?: MegaNavbarVariant;
	class?: string;
} = $props();

const current = $derived(currentHref(groupHrefs(groups, links), active));

let scrolled = $state(false);
const styles = $derived(
	megaNavbar({
		variant,
		sticky,
		surface: scrolled ? (blur ? "blurred" : "opaque") : "clear",
	}),
);
let mobileOpen = $state(false);
let openMobileGroup = $state(0);

// Navigating from inside the sheet should leave it closed.
$effect(() => {
	void active;
	mobileOpen = false;
});

const footerActions = $derived(mobileActions ?? actions);
let capsule = $state<HTMLDivElement | null>(null);
let pill = $state<HTMLSpanElement | null>(null);
function placePill(target: EventTarget | null) {
	if (!capsule || !pill) return;
	const box = capsuleBox(capsule, target);
	Object.assign(pill.style, pillStyle(box));
	pill.dataset.on = String(Boolean(box));
}
$effect(() => {
	void active;
	void variant;
	placePill(null);
});
</script>

<svelte:window
	onscroll={() => {
		if (sticky) scrolled = window.scrollY > 8;
	}}
/>

{#snippet chevronDown(cls: string)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={cls}>
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet arrowUpRight(cls: string)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={cls}>
		<path d="M5 11 11 5M6 5h5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet brandSlot()}
	{#if brand}
		<span class="flex shrink-0 items-center gap-2.5 py-1 pr-2">{@render brand()}</span>
	{/if}
{/snippet}

{#snippet desktopMenu()}
	<MegaMenu {groups} {active} {variant} class="hidden @3xl:flex" />
{/snippet}

{#snippet linkList()}
	<ul class="flex items-center gap-1">
		{#each links as link (link.href)}
			<li>
				<a
					href={link.href}
					target={link.external ? "_blank" : undefined}
					rel={link.external ? "noreferrer" : undefined}
					aria-current={link.href === current ? "page" : undefined}
					data-current={link.href === current}
					class={styles.link({ current: link.href === current })}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet menuButton()}
	<button
		type="button"
		onclick={() => (mobileOpen = true)}
		aria-expanded={mobileOpen}
		aria-label="Open menu"
		class={styles.menuButton()}
	>
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-5">
			<path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	</button>
{/snippet}

{#if variant === "expand"}
	<MegaNavbarExpand
		{brand}
		{groups}
		{links}
		{actions}
		{mobileActions}
		{active}
		{sticky}
		surface={scrolled ? (blur ? "blurred" : "opaque") : "clear"}
		class={className}
	/>
{:else}
<div data-slot="mega-navbar" data-variant={variant} class={cn(styles.root(), className)}>
	{#if variant === "notched"}
		<nav aria-label="Primary">
			<div class={styles.shelf()}>
				<NotchedShelf size="lg" fill="text-card">
					<div class={styles.shelfBar()}>
						{@render brandSlot()}
						{@render desktopMenu()}
						{@render linkList()}
						{#if actions}
							<span class="flex items-center gap-2">{@render actions()}</span>
						{/if}
					</div>
				</NotchedShelf>
			</div>
			<div class={styles.mobileBar()}>
				{@render brandSlot()}
				{@render menuButton()}
			</div>
			<span aria-hidden="true" class={styles.rule()}></span>
		</nav>
	{:else}
		<nav aria-label="Primary" class={styles.nav()}>
			{@render brandSlot()}
			<div class={styles.center()}>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					bind:this={capsule}
					class={styles.capsule()}
					onpointerover={(event) => placePill(event.target)}
					onpointerleave={() => placePill(null)}
				>
					{#if variant === "capsule"}<span bind:this={pill} aria-hidden="true" class={styles.capsulePill()}></span>{/if}
					{@render desktopMenu()}
					{@render linkList()}
				</div>
			</div>
			<div class="ml-auto flex shrink-0 items-center gap-2 @3xl:ml-0">
				{#if actions}
					<span class="hidden items-center gap-2 @3xl:flex">{@render actions()}</span>
				{/if}
				{@render menuButton()}
			</div>
		</nav>
	{/if}
</div>

<Sheet bind:open={mobileOpen}>
	<SheetContent side={variant === "notched" ? "top" : "right"} class={styles.sheet()}>
		<SheetHeader class="border-border border-b px-5 py-4">
			<SheetTitle class="flex items-center gap-2.5">
				{#if brand}{@render brand()}{/if}
			</SheetTitle>
		</SheetHeader>
		<nav aria-label="Mobile" class="flex-1 overflow-y-auto px-3 py-3">
			{#each groups as group, i (group.label)}
				{@const isOpen = openMobileGroup === i}
				<Collapsible
					open={isOpen}
					class="border-border border-b last:border-b-0"
				>
					<button
						type="button"
						aria-expanded={isOpen}
						onclick={() => (openMobileGroup = openMobileGroup === i ? -1 : i)}
						class="flex min-h-12 w-full items-center justify-between gap-4 px-2 text-left font-medium text-foreground"
					>
						{group.label}
						{@render chevronDown(styles.mobileChevron({ open: isOpen }))}
					</button>
					<CollapsibleContent class="px-0 pb-2">
						<ul>
							{#each group.items as item (item.href)}
								<li>
									<a
										href={item.href}
										target={item.external ? "_blank" : undefined}
										rel={item.external ? "noreferrer" : undefined}
										onclick={() => (mobileOpen = false)}
										aria-current={item.href === current ? "page" : undefined}
										class={styles.mobileItem({ current: item.href === current })}
									>
										{#if item.icon}
											<span class="shrink-0 text-muted-foreground [&_svg]:size-4">
												{@render item.icon()}
											</span>
										{/if}
										<span class="min-w-0 flex-1">
											<span class="flex items-center gap-1 font-medium text-foreground text-sm">
												{item.label}
												{#if item.external}
													{@render arrowUpRight("size-3 text-muted-foreground")}
												{/if}
											</span>
											{#if item.description}
												<span class="mt-0.5 block text-muted-foreground text-xs">{item.description}</span>
											{/if}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					</CollapsibleContent>
				</Collapsible>
			{/each}
			<ul class="mt-1 pt-1">
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							target={link.external ? "_blank" : undefined}
							rel={link.external ? "noreferrer" : undefined}
							onclick={() => (mobileOpen = false)}
							aria-current={link.href === current ? "page" : undefined}
							class={styles.mobileLink({ current: link.href === current })}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		{#if footerActions}
			<div class="mt-auto flex flex-col gap-2 border-border border-t px-5 py-4">
				{@render footerActions()}
			</div>
		{/if}
	</SheetContent>
</Sheet>
{/if}
