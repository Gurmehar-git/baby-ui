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

<!-- svelte-ignore a11y_figcaption_parent -- composed under Testimonial's figure -->
<figcaption data-slot="testimonial-author" class={cn(s.author(), classProp)} {...rest}>
	{@render children?.()}
</figcaption>
