<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { testimonial } from "../variants";
import { getTestimonial } from "./context";

let {
	children,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const context = getTestimonial();
const s = $derived(testimonial({ variant: context.variant }));
</script>

<blockquote data-slot="testimonial-quote" class={cn(s.quote(), classProp)} {...rest}>
	{@render children?.()}
</blockquote>
