<script lang="ts">
import type { Snippet } from "svelte";
import { onDestroy } from "svelte";
import { cn } from "../lib/cn";
import { currentHref, groupHrefs, isCurrentSection } from "./current";
import {
	EXPAND_CLOSE_MS,
	EXPAND_OPEN_MS,
	expandSide,
	placeMark,
	slideBox,
} from "./expand";
import type { MegaMenuGroup, MegaMenuItem, MegaNavLink } from "./types";
import { megaNavbar } from "./variants";

let {
	brand,
	groups,
	links,
	actions,
	mobileActions,
	active,
	sticky,
	surface,
	class: className,
}: {
	brand?: Snippet;
	groups: MegaMenuGroup[];
	links: MegaNavLink[];
	actions?: Snippet;
	mobileActions?: Snippet;
	active?: string;
	sticky: boolean;
	surface: "clear" | "blurred" | "opaque";
	class?: string;
} = $props();

const uid = $props.id();
const styles = $derived(megaNavbar({ variant: "expand", sticky, surface }));
const current = $derived(currentHref(groupHrefs(groups, links), active));
let open = $state(-1);
let mobile = $state(false);
let timer: ReturnType<typeof setTimeout> | null = null;
const triggers: (HTMLButtonElement | null)[] = $state([]);
const heights: number[] = $state([]);
const MOBILE = $derived(groups.length);
const expanded = $derived(open >= 0 || mobile);
const height = $derived(mobile ? heights[MOBILE] : open >= 0 ? heights[open] : 0);
const footer = $derived(mobileActions ?? actions);

let track = $state<HTMLDivElement | null>(null);
let pill = $state<HTMLSpanElement | null>(null);
function placePill(target: EventTarget | null) {
	if (track && pill) placeMark(pill, slideBox(track, target));
}
$effect(() => {
	void active;
	placePill(open >= 0 ? (triggers[open] ?? null) : null);
});

function cancel() {
	if (timer) clearTimeout(timer);
	timer = null;
}
function show(index: number) {
	cancel();
	open = index;
}
// Once a section is open, moving along the bar switches at once; from rest it waits a beat.
function aim(index: number) {
	if (open >= 0) return show(index);
	cancel();
	timer = setTimeout(() => show(index), EXPAND_OPEN_MS);
}
function closeSoon() {
	cancel();
	timer = setTimeout(() => show(-1), EXPAND_CLOSE_MS);
}
function closeAll() {
	show(-1);
	mobile = false;
}
onDestroy(cancel);

/** One highlight that slides to the hovered or focused item in a grid. */
function slideHighlight(grid: HTMLElement) {
	const mark = grid.querySelector<HTMLElement>("[data-highlight]");
	const place = (target: EventTarget | null) => {
		if (mark) placeMark(mark, slideBox(grid, target));
	};
	const over = (event: Event) => place(event.target);
	const leave = () => place(null);
	grid.addEventListener("pointerover", over);
	grid.addEventListener("focusin", over);
	grid.addEventListener("pointerleave", leave);
	return {
		destroy() {
			grid.removeEventListener("pointerover", over);
			grid.removeEventListener("focusin", over);
			grid.removeEventListener("pointerleave", leave);
		},
	};
}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key !== "Escape") return;
		if (open >= 0) triggers[open]?.focus();
		closeAll();
	}}
/>

{#snippet arrow(cls: string, external = false)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={cls}>
		<path
			d={external ? "M5 11 11 5M6 5h5v5" : "M3 8h10M9 4l4 4-4 4"}
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet grid(entries: MegaMenuItem[])}
	<div use:slideHighlight class={styles.expandGrid()}>
		<span data-highlight aria-hidden="true" class={styles.expandHighlight()}></span>
		{#each entries as entry, i (entry.href)}
			<a
				href={entry.href}
				target={entry.external ? "_blank" : undefined}
				rel={entry.external ? "noreferrer" : undefined}
				aria-current={entry.href === current ? "page" : undefined}
				data-current={entry.href === current}
				data-icon={Boolean(entry.icon)}
				style:--i={i}
				onclick={closeAll}
				class={styles.expandItem()}
			>
				{#if entry.icon}<span class={styles.expandIcon()}>{@render entry.icon()}</span>{/if}
				<span class="min-w-0">
					<span class={styles.expandLabel()}>{entry.label}</span>
					{#if entry.description}<span class={styles.expandDetail()}>{entry.description}</span>{/if}
				</span>
				{#if entry.external}{@render arrow(styles.expandArrow(), true)}{:else}<span></span>{/if}
			</a>
		{/each}
	</div>
{/snippet}

<div data-slot="mega-navbar" data-variant="expand" class={cn(styles.root(), className)}>
	<!-- A pointer-only dismiss; Escape is the keyboard path. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div aria-hidden="true" data-open={expanded} class={styles.expandScrim()} onclick={closeAll}></div>
	<div class={styles.expandFrame()}>
	<nav
		aria-label="Primary"
		data-open={expanded}
		data-raised={expanded || surface !== "clear"}
		class={styles.expandBar()}
		onmouseenter={cancel}
		onmouseleave={closeSoon}
		onfocusout={(event) => {
			if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)))
				show(-1);
		}}
	>
		{#if brand}<span class={styles.expandBrand()}>{@render brand()}</span>{:else}<span></span>{/if}

		<!-- A hover region for the sliding pill; the triggers inside are the controls. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={track}
			class={styles.expandTriggers()}
			onpointerover={(event) => placePill(event.target)}
			onpointerleave={() => placePill(open >= 0 ? (triggers[open] ?? null) : null)}
		>
			<span bind:this={pill} aria-hidden="true" class={styles.expandPill()}></span>
			{#each groups as group, index (group.label)}
				{@const isOpen = open === index}
				{@const isCurrent = isCurrentSection(group.href, active)}
				<button
					bind:this={triggers[index]}
					type="button"
					aria-expanded={isOpen}
					aria-controls="{uid}-panel"
					data-current={isCurrent}
					class={styles.expandTrigger({ current: isOpen || isCurrent })}
					onmouseenter={() => aim(index)}
					onclick={() => show(isOpen ? -1 : index)}
					onkeydown={(event) => {
						if (event.key !== "ArrowDown") return;
						event.preventDefault();
						show(index);
						// The pane is inert until the open state renders.
						requestAnimationFrame(() =>
							document.getElementById(`${uid}-pane-${index}`)?.querySelector<HTMLElement>("a")?.focus(),
						);
					}}
				>
					{group.label}
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-open={isOpen} class={styles.expandChevron()}>
						<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			{/each}
			{#each links as link (link.href)}
				<a
					href={link.href}
					target={link.external ? "_blank" : undefined}
					rel={link.external ? "noreferrer" : undefined}
					aria-current={link.href === current ? "page" : undefined}
					data-current={link.href === current}
					onmouseenter={closeSoon}
					class={styles.expandTrigger({ current: link.href === current })}
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class={styles.expandActions()}>
			{#if actions}<span class="hidden items-center gap-2 @3xl:flex">{@render actions()}</span>{/if}
			<button
				type="button"
				aria-label={mobile ? "Close menu" : "Open menu"}
				aria-expanded={mobile}
				aria-controls="{uid}-mobile"
				class={styles.menuButton()}
				onclick={() => {
					show(-1);
					mobile = !mobile;
				}}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-5">
					<path
						d={mobile ? "m4 4 8 8M12 4l-8 8" : "M2 4.5h12M2 8h12M2 11.5h12"}
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>

		<div id="{uid}-panel" data-open={expanded} class={styles.expandPanel()} style:height="{height ?? 0}px">
			<span aria-hidden="true" data-open={expanded} class={styles.expandDivider()}></span>
			<div class={styles.expandPanes()}>
				{#each groups as group, index (group.label)}
					{@const side = mobile ? "off" : expandSide(index, open)}
					<section
						id="{uid}-pane-{index}"
						bind:offsetHeight={heights[index]}
						aria-label={group.label}
						data-side={side}
						inert={side !== "on"}
						class={styles.expandPane()}
					>
						<div class={styles.expandIntro()}>
							<p class={styles.expandEyebrow()}>{group.eyebrow ?? group.label}</p>
							{#if group.description}<p class={styles.expandBlurb()}>{group.description}</p>{/if}
							{#if group.footer}
								<a href={group.footer.href} onclick={closeAll} class={styles.expandCta()}>
									{group.footer.label}
									{@render arrow("size-3.5 transition-transform group-hover/cta:translate-x-0.5 motion-reduce:transition-none")}
								</a>
							{/if}
						</div>
						<div>
							{@render grid(group.items)}
							{#if group.more?.links.length}
								<div class={styles.expandMore()}>
									{#each group.more.links as link (link.href)}
										<a
											href={link.href}
											target={link.external ? "_blank" : undefined}
											rel={link.external ? "noreferrer" : undefined}
											onclick={closeAll}
											class={styles.expandMoreLink()}
										>
											{link.label}
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</section>
				{/each}
			</div>

			<div
				id="{uid}-mobile"
				bind:offsetHeight={heights[MOBILE]}
				data-side={mobile ? "on" : "off"}
				inert={!mobile}
				class={styles.expandMobile()}
			>
				{#each groups as group (group.label)}
					<section aria-label={group.label} class={styles.expandMobileGroup()}>
						<p class={cn(styles.expandEyebrow(), "px-3 pb-1")}>{group.label}</p>
						{@render grid(group.items)}
					</section>
				{/each}
				{#if links.length}
					<div class={styles.expandMobileGroup()}>{@render grid(links)}</div>
				{/if}
				{#if footer}
					<div class={cn(styles.expandMobileGroup(), "flex flex-col gap-2 px-1")}>{@render footer()}</div>
				{/if}
			</div>
		</div>
	</nav>
	</div>
</div>
