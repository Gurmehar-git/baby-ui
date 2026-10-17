<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { gradientHero01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const hero = gradientHero01State();
</script>

<h1 data-slot="gradient-hero-01-title" {...rest} class={cn(hero.styles.title(), classProp)}>
	{@render children?.()}
</h1>
