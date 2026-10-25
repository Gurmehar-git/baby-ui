<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { wallHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = wallHeroState("WallHeroContent");
</script>

<div data-slot="wall-hero-content" {...rest} class={cn(ctx.styles.content(), classProp)}>
	{@render children?.()}
</div>
