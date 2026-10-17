<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { orbitHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const hero = orbitHeroState();
</script>

<!-- The h1; put OrbitHeroSubheading inside for a second, muted line. -->
<h1 data-slot="orbit-hero-title" {...rest} class={cn(hero.styles.title(), classProp)}>
	{@render children?.()}
</h1>
