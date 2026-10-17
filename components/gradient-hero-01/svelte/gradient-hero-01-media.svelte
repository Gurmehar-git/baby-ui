<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { gradientHero01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const hero = gradientHero01State();
</script>

<!-- A visual beside the copy, e.g. a product shot; the hero switches to a split layout. -->
<div data-slot="gradient-hero-01-media" {...rest} class={cn(hero.styles.media(), classProp)}>
	{@render children?.()}
</div>
