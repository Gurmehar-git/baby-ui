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
const ctx = wallHeroState("WallHeroCard");
</script>

<!-- A framed tile on the wall; put any component inside. -->
<div data-slot="wall-hero-card" {...rest} class={cn(ctx.styles.card(), classProp)}>
	<div class={ctx.styles.cardBody()}>{@render children?.()}</div>
</div>
