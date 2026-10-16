<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { getInvoiceList } from "./context";
import type { Invoice } from "./invoice-core";

let { invoice, class: classProp }: { invoice: Invoice; class?: string } = $props();
const ctx = getInvoiceList();
</script>

<!-- Receipt and invoice links, each only when its URL exists. -->
<span class={cn(ctx.styles.links(), classProp)}>
	{#if invoice.receiptUrl}
		<a
			href={invoice.receiptUrl}
			target="_blank"
			rel="noopener noreferrer"
			download
			aria-label={ctx.labels.downloadReceipt(invoice.number)}
			class={ctx.styles.link()}
		>
			{ctx.labels.receipt}
		</a>
	{/if}
	{#if invoice.invoiceUrl}
		<a
			href={invoice.invoiceUrl}
			target="_blank"
			rel="noopener noreferrer"
			download
			aria-label={ctx.labels.downloadInvoice(invoice.number)}
			class={ctx.styles.link()}
		>
			{ctx.labels.invoice}
		</a>
	{/if}
</span>
