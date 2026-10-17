<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { faqSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const faq = faqSectionState();
</script>

<!-- The heading that names the section. -->
<h2
	data-slot="faq-section-title"
	id={faq.titleId}
	{...rest}
	class={cn(faq.styles.title(), classProp)}
>
	{@render children?.()}
</h2>
