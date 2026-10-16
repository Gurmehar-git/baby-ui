<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { getInvoiceList } from "./context";

let {
	title,
	hint,
	class: classProp,
}: { title?: string; hint?: string; class?: string } = $props();
const ctx = getInvoiceList();
</script>

<div class={cn(ctx.styles.empty(), classProp)}>
	<p class={ctx.styles.emptyTitle()}>{title ?? ctx.labels.empty}</p>
	<p class={ctx.styles.emptyHint()}>{hint ?? ctx.labels.emptyHint}</p>
</div>
