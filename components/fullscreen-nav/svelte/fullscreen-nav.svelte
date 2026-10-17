<script lang="ts">
import { Dialog as DialogPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import { button } from "../../button/variants";
import { cn } from "../../lib/cn";
import {
	type FullscreenNavAlign,
	type FullscreenNavSize,
	type FullscreenNavVariant,
	fullscreenNav,
	linkDelay,
	linkIndex,
	panelDelay,
} from "../variants";

export type NavLink = {
	href: string;
	label: string;
	/** Optional short line under the label. */
	description?: string;
};

let {
	links,
	open = $bindable(false),
	onOpenChange,
	current,
	title = "Menu",
	closeLabel = "Close",
	numbered = false,
	variant = "fade",
	align,
	size,
	footer,
	class: classProp,
}: {
	links: NavLink[];
	/** Open state; bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** href of the page being viewed; that link gets aria-current="page". */
	current?: string;
	title?: string;
	closeLabel?: string;
	/** Prefix each link with 01, 02…. */
	numbered?: boolean;
	variant?: FullscreenNavVariant;
	align?: FullscreenNavAlign;
	size?: FullscreenNavSize;
	/** Content pinned under the links, e.g. contact details or socials. */
	footer?: Snippet;
	class?: string;
} = $props();

const styles = $derived(fullscreenNav({ variant, align, size }));

let firstLink = $state<HTMLAnchorElement>();

function refFirst(node: HTMLAnchorElement, isFirst: boolean) {
	if (isFirst) firstLink = node;
	return {
		update(next: boolean) {
			if (next) firstLink = node;
			else if (firstLink === node) firstLink = undefined;
		},
		destroy() {
			if (firstLink === node) firstLink = undefined;
		},
	};
}

function setOpen(next: boolean) {
	open = next;
	onOpenChange?.(next);
}
</script>

<DialogPrimitive.Root bind:open={() => open, setOpen}>
	<DialogPrimitive.Portal>
		<DialogPrimitive.Content
			data-slot="fullscreen-nav"
			data-variant={variant}
			style="transition-delay: {panelDelay(links.length, open)}"
			onOpenAutoFocus={(event) => {
				event.preventDefault();
				firstLink?.focus();
			}}
			class={cn(styles.popup(), classProp)}
		>
			<div class={styles.header()}>
				<DialogPrimitive.Title class={styles.title()}>{title}</DialogPrimitive.Title>
				<DialogPrimitive.Close aria-label={closeLabel} class={button({ variant: "outline", size: "icon" })}>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					</svg>
				</DialogPrimitive.Close>
			</div>

			<nav aria-label={title} class={styles.nav()}>
				{#each links as link, i (link.href)}
					<a
						use:refFirst={i === 0}
						href={link.href}
						aria-current={link.href === current ? "page" : undefined}
						onclick={() => setOpen(false)}
						data-state={open ? "open" : "closed"}
						style:transition-delay={linkDelay(i, links.length, open)}
						class={styles.link()}
					>
						<span class={styles.row()}>
							{#if numbered}<span class={styles.index()}>{linkIndex(i)}</span>{/if}
							<span class={styles.text()}>
								<span class={styles.label()}>{link.label}</span>
								{#if link.description}
									<span class={styles.description()}>{link.description}</span>
								{/if}
							</span>
						</span>
					</a>
				{/each}
			</nav>

			{#if footer}
				<div class={styles.footer()}>{@render footer()}</div>
			{/if}
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
