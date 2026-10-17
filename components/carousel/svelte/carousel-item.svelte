<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { carousel } from "../variants";
import { getCarousel } from "./context";

let {
	children,
	class: classProp,
	...rest
}: { children?: Snippet; class?: string } & HTMLAttributes<HTMLDivElement> = $props();

const ctx = getCarousel();
// Slides are positional: each takes the next index as it initialises, server and client alike.
const index = ctx.register();
const active = $derived(ctx.index === index);
</script>

<!-- Inert unless active, so focus never lands on an off-screen slide. -->
<div
	{...rest}
	id={ctx.slideId(index)}
	data-slot="carousel-item"
	data-carousel-slide=""
	role="tabpanel"
	aria-roledescription="slide"
	aria-label={ctx.slideLabel(index)}
	inert={!active}
	class={cn(carousel().slide(), classProp)}
>
	{@render children?.()}
</div>
