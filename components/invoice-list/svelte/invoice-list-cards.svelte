<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getInvoiceList } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
const ctx = getInvoiceList();
</script>

<!-- The narrow layout: stacked cards until the container reaches @xl. -->
<ul {...rest} aria-label={ctx.labels.caption} class={cn(ctx.styles.list(), classProp)}>
	{@render children?.()}
</ul>
