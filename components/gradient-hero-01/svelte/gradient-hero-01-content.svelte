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

<div data-slot="gradient-hero-01-content" {...rest} class={cn(hero.styles.copy(), classProp)}>
	{@render children?.()}
</div>
