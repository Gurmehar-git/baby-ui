<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { gradientHero01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const hero = gradientHero01State();
</script>

<p data-slot="gradient-hero-01-description" {...rest} class={cn(hero.styles.description(), classProp)}>
	{@render children?.()}
</p>
