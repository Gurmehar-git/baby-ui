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
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const context = getTestimonial();
const s = $derived(testimonial({ variant: context.variant }));
</script>

<span data-slot="testimonial-author-name" class={cn(s.name(), classProp)} {...rest}>
	{@render children?.()}
</span>
