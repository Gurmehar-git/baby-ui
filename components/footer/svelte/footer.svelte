<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import NotchedShelf from "../../notched-shelf/svelte/notched-shelf.svelte";
import { type FooterLayout, footer } from "../variants";
import type { FooterColumn, FooterLink, FooterSocialLink, FooterStatus } from "./types";

let {
	brand,
	description,
	columns,
	socials = [],
	copyright,
	legal = [],
	actions,
	wordmark,
	topHref,
	topLabel = "Back to top",
	layout = "split",
	status,
	class: className,
}: {
	brand?: Snippet;
	description?: string;
	columns: FooterColumn[];
	socials?: FooterSocialLink[];
	copyright?: Snippet;
	/** Policy links beside the copyright. */
	legal?: FooterLink[];
	/** Small controls beside the copyright, e.g. a theme toggle. */
	actions?: Snippet;
	/** Giant background wordmark text; omit to skip that section entirely. */
	wordmark?: string;
	/** Target of the notched layout's back-to-top tab; the tab only renders with one. */
	topHref?: string;
	topLabel?: string;
	layout?: FooterLayout;
	/** A system status link with a pulsing dot in its tone. */
	status?: FooterStatus;
	class?: string;
} = $props();

const styles = $derived(footer({ layout }));
const notched = $derived(layout === "notched");
</script>

{#snippet arrowUpRight()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M17 7 7 17M8 7h9v9" /></svg>
{/snippet}

{#snippet legalList()}
	{#if legal.length}
		<ul class={styles.legal()}>
			{#each legal as link (link.href)}
				<li>
					<a
						href={link.href}
						target={link.external ? "_blank" : undefined}
						rel={link.external ? "noreferrer" : undefined}
						class={styles.bottomLink()}>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{#snippet statusLink()}
	{#if status}
		{#if status.href}
			<a href={status.href} class={styles.status()}><span aria-hidden="true" data-tone={status.tone} class={styles.statusDot()}></span>{status.label}</a>
		{:else}
			<p class={styles.status()}><span aria-hidden="true" data-tone={status.tone} class={styles.statusDot()}></span>{status.label}</p>
		{/if}
	{/if}
{/snippet}

{#snippet actionsSlot()}
	{#if actions}
		<div class={styles.actions()}>{@render actions()}</div>
	{/if}
{/snippet}

<footer data-slot="footer" data-layout={layout} class={cn(styles.root(), className)}>
	{#if notched && topHref}
		<div class={styles.notch()}>
			<NotchedShelf fill="text-background">
				<a href={topHref} class={styles.topLink()}>
					<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class={styles.topIcon()}><path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" /></svg>
					{topLabel}
				</a>
			</NotchedShelf>
		</div>
	{/if}
	<div class={styles.inner()}>
		<div class={styles.grid()}>
			<div class={styles.brandBlock()}>
				{#if brand}
					<span class="inline-flex items-center gap-2.5">{@render brand()}</span>
				{/if}
				{#if description}
					<p class={styles.description()}>{description}</p>
				{/if}
				{#if socials.length}
					<ul class={styles.socials()}>
						{#each socials as social (social.href)}
							{@const external = social.href.startsWith("http")}
							{@const iconOnly = Boolean(social.icon) && !notched}
							<li>
								<a
									href={social.href}
									aria-label={iconOnly ? social.label : undefined}
									target={external ? "_blank" : undefined}
									rel={external ? "noreferrer" : undefined}
									class={iconOnly ? styles.social() : styles.link()}
								>
									{#if iconOnly}
										{@render social.icon?.()}
									{:else}
										{social.label}
										{#if external}{@render arrowUpRight()}{/if}
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
				{#if !notched}
					{#if copyright}
						<p class={styles.copyright()}>{@render copyright()}</p>
					{/if}
					{@render statusLink()}
					{@render legalList()}
					{@render actionsSlot()}
				{/if}
			</div>

			<div class={styles.columns()}>
				{#each columns as column (column.title)}
					<div class={styles.column()}>
						<h4 class={styles.columnTitle()}>{column.title}</h4>
						<ul class={styles.links()}>
							{#each column.links as link (link.href)}
								<li>
									<a
										href={link.href}
										target={link.external ? "_blank" : undefined}
										rel={link.external ? "noreferrer" : undefined}
										class={styles.link()}
									>
										<span>
											<span class="inline-flex items-center gap-1">
												{link.label}
												{#if link.external}{@render arrowUpRight()}{/if}
											</span>
											{#if link.description}
												<span class={styles.linkDescription()}>{link.description}</span>
											{/if}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		{#if notched}
			<span aria-hidden="true" class={styles.rule()}></span>
			<div class={styles.bottom()}>
				{#if copyright}<p>{@render copyright()}</p>{/if}
				{@render statusLink()}
				{@render legalList()}
				{@render actionsSlot()}
			</div>
		{/if}
	</div>

	{#if wordmark}
		<div class={styles.wordmarkWrap()}>
			<span class={styles.wordmark()}>{wordmark}</span>
		</div>
	{/if}
</footer>
