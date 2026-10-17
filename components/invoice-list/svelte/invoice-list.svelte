<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { INVOICE_LIST_LABELS, type InvoiceListLabels } from "../invoice-core";
import { type InvoiceListDensity, invoiceList } from "../variants";
import { setInvoiceList } from "./context";

let {
	density = "comfortable",
	loading = false,
	locale,
	labels: labelOverrides,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	density?: InvoiceListDensity;
	/** Marks the list busy and announces `labels.loading`; render skeleton parts alongside. */
	loading?: boolean;
	locale?: string;
	labels?: Partial<InvoiceListLabels>;
} = $props();

const labels = $derived({ ...INVOICE_LIST_LABELS, ...labelOverrides });
const styles = $derived(invoiceList({ density }));

setInvoiceList({
	get styles() {
		return styles;
	},
	get density() {
		return density;
	},
	get locale() {
		return locale;
	},
	get labels() {
		return labels;
	},
});
</script>

<!-- Billing history. Holds density, locale and copy; the table, cards and states are parts. -->
<div
	{...rest}
	data-slot="invoice-list"
	aria-busy={loading || undefined}
	class={cn(styles.root(), classProp)}
>
	{#if loading}
		<span role="status" class="sr-only">{labels.loading}</span>
	{/if}
	{@render children?.()}
</div>
