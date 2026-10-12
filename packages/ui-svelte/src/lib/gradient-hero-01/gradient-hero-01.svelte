<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Badge from "../badge/badge.svelte";
import Button from "../button/button.svelte";
import CopyButton from "../copy-button/copy-button.svelte";
import { cn } from "../lib/cn";
import type { GradientHero01Action } from "./types";
import {
	type GradientHero01Size,
	type GradientHero01Tone,
	gradientHero01,
} from "./variants";

type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
	headline: string;
	description?: string;
	/** Pill above the headline. */
	badge?: string;
	/** The first is the primary action; the rest are outlined. */
	actions?: GradientHero01Action[];
	tone?: GradientHero01Tone;
	size?: GradientHero01Size;
	/** An install command in a pill with a copy button, e.g. `npm i acme`. */
	install?: string;
	/** Small facts under the actions, e.g. the version and licence. */
	meta?: string[];
	/** A visual beside the copy; the hero switches to a split layout. */
	media?: Snippet;
};

let {
	headline,
	description,
	badge,
	actions = [],
	tone = "chart",
	size = "screen",
	install,
	meta = [],
	media,
	class: classProp,
	...rest
}: Props = $props();

const s = $derived(gradientHero01({ tone, size, split: Boolean(media) }));
const live = $derived(
	actions.filter((a) => a.href !== undefined || a.onClick !== undefined),
);
</script>

<section data-slot="gradient-hero-01" class={cn(s.root(), classProp)} {...rest}>
	<div aria-hidden="true" class={s.blob()}></div>
	<div aria-hidden="true" class={s.wash()}></div>
	<div aria-hidden="true" class={s.vignette()}></div>
	<div aria-hidden="true" class={s.fade()}></div>
	<div class={s.inner()}>
		<div class={s.copy()}>
		{#if badge}
			<Badge variant="outline" class={s.badge()}>{badge}</Badge>
		{/if}
		<h1 class={s.title()}>{headline}</h1>
		{#if description}<p class={s.description()}>{description}</p>{/if}
		{#if live.length}
			<div class={s.actions()}>
				{#each live as action, i (i)}
					{#if action.href !== undefined}
						<Button
							href={action.href}
							variant={i === 0 ? "default" : "outline"}
							size="lg"
							class={s.action()}
							onclick={action.onClick}
						>
							{action.label}
						</Button>
					{:else}
						<Button
							variant={i === 0 ? "default" : "outline"}
							size="lg"
							class={s.action()}
							onclick={action.onClick}
						>
							{action.label}
						</Button>
					{/if}
				{/each}
			</div>
		{/if}
		{#if install}
			<div class={s.install()}>
				<span aria-hidden="true">$</span>
				<code>{install}</code>
				<CopyButton text={install} label="Copy install command" iconOnly />
			</div>
		{/if}
		{#if meta.length}
			<ul class={s.meta()}>
				{#each meta as fact (fact)}<li>{fact}</li>{/each}
			</ul>
		{/if}
		</div>
		{#if media}<div class={s.media()}>{@render media()}</div>{/if}
	</div>
</section>
