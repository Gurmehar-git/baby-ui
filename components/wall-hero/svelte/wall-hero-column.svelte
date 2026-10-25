<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import type { WallHeroDirection } from "../variants";
import { wallHeroState } from "./context";

let {
	direction = "up",
	duration,
	class: classProp,
	children,
}: {
	direction?: WallHeroDirection;
	/** One full loop, e.g. "70s". Defaults to `--wall-hero-duration` (60s). */
	duration?: string;
	class?: string;
	children?: Snippet;
} = $props();
const ctx = wallHeroState("WallHeroColumn");
</script>

<!-- One column of cards, drawn twice so its drift loops without a seam. -->
<div data-slot="wall-hero-column" class={cn(ctx.styles.column(), classProp)}>
	<div data-direction={direction} class={ctx.styles.track()} style:--wall-hero-duration={duration}>
		<div class={ctx.styles.group()}>{@render children?.()}</div>
		<div class={ctx.styles.group()}>{@render children?.()}</div>
	</div>
</div>
