<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { wallHeroState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = wallHeroState("WallHeroWall");
</script>

<!-- The tilted plane of columns. Decoration only: hidden from assistive tech and inert. -->
<div data-slot="wall-hero-wall" aria-hidden="true" inert class={cn(ctx.styles.wall(), classProp)}>
	<div data-motion="explanatory" class={ctx.styles.plane()}>
		{@render children?.()}
	</div>
</div>
