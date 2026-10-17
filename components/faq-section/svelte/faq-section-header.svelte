<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { faqSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const faq = faqSectionState();
</script>

<div data-slot="faq-section-header" {...rest} class={cn(faq.styles.intro(), classProp)}>
	{@render children?.()}
</div>
