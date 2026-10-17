<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { orbitHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const hero = orbitHeroState();
</script>

<div data-slot="orbit-hero-actions" {...rest} class={cn(hero.styles.actions(), classProp)}>
	{@render children?.()}
</div>
