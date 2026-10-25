<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { wallHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const ctx = wallHeroState("WallHeroTitle");
</script>

<h1 data-slot="wall-hero-title" {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</h1>
