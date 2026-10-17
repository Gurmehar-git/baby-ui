<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { faqSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const faq = faqSectionState();
</script>

<p data-slot="faq-section-description" {...rest} class={cn(faq.styles.description(), classProp)}>
	{@render children?.()}
</p>
