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
const ctx = wallHeroState("WallHeroBrand");
</script>

<!-- A logo mark and the product name. -->
<div data-slot="wall-hero-brand" {...rest} class={cn(ctx.styles.brand(), classProp)}>
	{@render children?.()}
</div>
