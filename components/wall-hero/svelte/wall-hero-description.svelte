<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { wallHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const ctx = wallHeroState("WallHeroDescription");
</script>

<p data-slot="wall-hero-description" {...rest} class={cn(ctx.styles.description(), classProp)}>
	{@render children?.()}
</p>
