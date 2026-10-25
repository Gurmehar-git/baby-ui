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
const ctx = wallHeroState("WallHeroActions");
</script>

<div data-slot="wall-hero-actions" {...rest} class={cn(ctx.styles.actions(), classProp)}>
	{@render children?.()}
</div>
