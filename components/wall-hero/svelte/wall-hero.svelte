<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type WallHeroVariant, wallHero } from "../variants";
import { setWallHero } from "./context";

let {
	variant = "split",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	variant?: WallHeroVariant;
	children?: Snippet;
} = $props();

const styles = $derived(wallHero({ variant }));
setWallHero({
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: copy and a tilted wall of cards that drift past, beside it or behind it. -->
<section data-slot="wall-hero" data-variant={variant} {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
</section>
