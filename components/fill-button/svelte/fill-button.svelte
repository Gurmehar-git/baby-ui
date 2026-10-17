<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type FillButtonSize, type FillButtonTone, fillButton } from "../variants";

type Props = {
	/** Label; also rendered on the fill as a decorative copy. */
	children: Snippet;
	/** Icon inside the tile. Defaults to an arrow. */
	icon?: Snippet;
	tone?: FillButtonTone;
	size?: FillButtonSize;
	href?: string;
	class?: string;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;

let { children, icon, tone, size, href, class: classProp, ...rest }: Props = $props();

const s = $derived(fillButton({ tone, size }));
</script>

{#snippet inner()}
	<span aria-hidden="true" class={s.fill()}></span>
	<span aria-hidden="true" class={s.track()}>
		<span class={s.icon()}>
			{#if icon}
				{@render icon()}
			{:else}
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/if}
		</span>
	</span>
	<span class={s.label()}>{@render children()}</span>
	<span aria-hidden="true" class={s.fillLabel()}>{@render children()}</span>
{/snippet}

{#if href !== undefined}
	<a {...rest as HTMLAnchorAttributes} {href} data-slot="fill-button" class={cn(s.root(), classProp)}>
		{@render inner()}
	</a>
{:else}
	<button
		type="button"
		{...rest as HTMLButtonAttributes}
		data-slot="fill-button"
		class={cn(s.root(), classProp)}
	>
		{@render inner()}
	</button>
{/if}
