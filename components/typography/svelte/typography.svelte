<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { TYPOGRAPHY_TAG, type TypographyVariant, typography } from "./variants";

let {
	children,
	variant = "body",
	as,
	class: classProp,
}: {
	children: Snippet;
	variant?: TypographyVariant;
	as?: string;
	class?: string;
} = $props();

const tag = $derived(as ?? TYPOGRAPHY_TAG[variant]);
</script>

<svelte:element this={tag} class={cn(typography({ variant }), classProp)}>
	{@render children()}
</svelte:element>
