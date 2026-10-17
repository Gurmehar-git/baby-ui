<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { gradientHero01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLUListElement> & { children?: Snippet } = $props();
const hero = gradientHero01State();
</script>

<!-- Small facts under the actions, e.g. the version and licence; one `<li>` each. -->
<ul data-slot="gradient-hero-01-meta" {...rest} class={cn(hero.styles.meta(), classProp)}>
	{@render children?.()}
</ul>
