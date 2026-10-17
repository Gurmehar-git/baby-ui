<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { orbitHeroState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const hero = orbitHeroState();
</script>

<span data-slot="orbit-hero-subheading" {...rest} class={cn("block", hero.styles.subheading(), classProp)}>
	{@render children?.()}
</span>
