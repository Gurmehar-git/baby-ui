<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<div
	data-slot="cta-section-actions"
	{...rest}
	class={cn(cta.variant === "banner" ? cta.styles.bannerActions() : cta.styles.actions(), classProp)}
>
	{@render children?.()}
</div>
