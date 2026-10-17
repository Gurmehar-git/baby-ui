<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { TYPOGRAPHY_TAG, type TypographyVariant, typography } from "../variants";

let {
	children,
	variant = "body",
	as,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & {
	children: Snippet;
	variant?: TypographyVariant;
	/** The element to render; defaults to the variant's semantic tag (`h1`, `p`, `code`...). */
	as?: string;
} = $props();

const tag = $derived(as ?? TYPOGRAPHY_TAG[variant]);
</script>

<svelte:element
	this={tag}
	data-slot="typography"
	data-variant={variant}
	{...rest}
	class={cn(typography({ variant }), classProp)}
>
	{@render children()}
</svelte:element>
