<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { currentHref, groupHrefs, isCurrentSection } from "./current";
import type { MegaMenuGroup, MegaMenuItem } from "./types";
import { type MegaNavbarVariant, megaNavbar } from "./variants";

/** Desktop dropdowns sharing one panel that resizes and slides to centre under the open
 * trigger, so moving along the row reads as the panel morphing, not popovers swapping. */
let {
	groups,
	active,
	variant = "solid",
	itemIcon,
	class: className,
}: {
	groups: MegaMenuGroup[];
	/** Current path; marks the matching trigger and links current. */
	active?: string;
	variant?: MegaNavbarVariant;
	/** Renders an icon for items without their own, so one snippet can map a whole menu. */
	itemIcon?: Snippet<[MegaMenuItem]>;
	class?: string;
} = $props();

const panelId = $props.id();
const styles = $derived(megaNavbar({ variant }));
// The notched shelf drops its panel a little further, clearing the wing curve.
const drop = $derived(variant === "notched" ? 10 : 8);

let open = $state(-1);
let box = $state({ width: 0, height: 0, left: 0 });
let row: HTMLDivElement | undefined = $state();
let panels: (HTMLDivElement | undefined)[] = $state([]);
let triggers: (HTMLButtonElement | undefined)[] = $state([]);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const current = $derived(currentHref(groupHrefs(groups), active));

function measure() {
	if (open < 0 || !row) return;
	const panel = panels[open];
	const trigger = triggers[open];
	if (!panel || !trigger) return;
	const rowRect = row.getBoundingClientRect();
	const triggerRect = trigger.getBoundingClientRect();
	const width = panel.scrollWidth;
	const ideal = triggerRect.left - rowRect.left + triggerRect.width / 2 - width / 2;
	// Centred under the trigger, but never past the row's start or the window's end.
	const room = window.innerWidth - rowRect.left - width - 8;
	box = { width, height: panel.scrollHeight, left: Math.max(0, Math.min(ideal, room)) };
}

$effect(() => {
	void open;
	measure();
});

// A diagonal path to the panel leaves the row for a frame; closing at once would make it unusable.
function cancelClose() {
	if (closeTimer) clearTimeout(closeTimer);
	closeTimer = null;
}
function scheduleClose() {
	cancelClose();
	closeTimer = setTimeout(() => (open = -1), 140);
}
function show(i: number) {
	cancelClose();
	open = i;
}
</script>

<svelte:window onresize={measure} />

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

{#snippet arrowRight(cls: string)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={cls}>
		<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

<!-- A disclosure, not role="menu": the contents are page links. -->
<div
	bind:this={row}
	data-slot="mega-menu"
	class={cn(styles.menu(), className)}
	onmouseleave={scheduleClose}
	onmouseenter={cancelClose}
	role="presentation"
>
	{#each groups as group, i (group.label)}
		{@const isOpen = open === i}
		<button
			bind:this={triggers[i]}
			type="button"
			aria-expanded={isOpen}
			aria-controls={panelId}
			onmouseenter={() => show(i)}
			onclick={() => (open = open === i ? -1 : i)}
			onkeydown={(e) => {
				if (e.key === "Escape") {
					open = -1;
					triggers[i]?.focus();
				} else if (e.key === "ArrowDown") {
					e.preventDefault();
					show(i);
					// The pane is inert until the open state renders.
					requestAnimationFrame(() => panels[i]?.querySelector("a")?.focus());
				}
			}}
			data-current={isCurrentSection(group.href, active)}
			class={styles.trigger({ current: isOpen || isCurrentSection(group.href, active) })}
		>
			{group.label}
			{@render chevronDown(styles.chevron({ open: isOpen }))}
		</button>
	{/each}

	<div
		id={panelId}
		aria-hidden={open < 0}
		onmouseenter={cancelClose}
		onmouseleave={scheduleClose}
		onkeydown={(e) => {
			if (e.key !== "Escape" || open < 0) return;
			triggers[open]?.focus();
			open = -1;
		}}
		role="presentation"
		class={styles.panel({ open: open >= 0 })}
		style="width:{box.width}px;height:{box.height}px;transform:translate3d({box.left}px, {open >= 0 ? drop : 2}px, 0) scale({open >= 0 ? 1 : 0.98});"
	>
		{#each groups as group, i (group.label)}
			{@const isOpen = open === i}
			<div bind:this={panels[i]} inert={!isOpen} class={styles.pane({ open: isOpen })}>
				<ul class={styles.list()}>
					{#each group.items as item (item.href)}
						<li>
							<a
								href={item.href}
								target={item.external ? "_blank" : undefined}
								rel={item.external ? "noreferrer" : undefined}
								onclick={() => (open = -1)}
								aria-current={item.href === current ? "page" : undefined}
								class={styles.item()}
							>
								{#if item.icon || itemIcon}
									<span class="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4">
										{#if item.icon}{@render item.icon()}{:else}{@render itemIcon?.(item)}{/if}
									</span>
								{/if}
								<span class="min-w-0">
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
				{#if group.more?.links.length}
					<div class={styles.more()}>
						{#if group.more.heading}
							<p class={styles.moreHeading()}>{group.more.heading}</p>
						{/if}
						<ul class={styles.moreList()}>
							{#each group.more.links as link (link.href)}
								<li>
									<a
										href={link.href}
										target={link.external ? "_blank" : undefined}
										rel={link.external ? "noreferrer" : undefined}
										onclick={() => (open = -1)}
										aria-current={link.href === current ? "page" : undefined}
										class={styles.moreLink()}>{link.label}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if group.footer}
					<a href={group.footer.href} onclick={() => (open = -1)} class={styles.footer()}>
						<span class="font-medium text-foreground text-sm">{group.footer.label}</span>
						<span class="flex items-center gap-1.5 text-muted-foreground text-xs">
							{group.footer.hint}
							{@render arrowRight(
								"size-3.5 transition-transform group-hover/cta:translate-x-0.5 motion-reduce:transition-none",
							)}
						</span>
					</a>
				{/if}
			</div>
		{/each}
	</div>
</div>
