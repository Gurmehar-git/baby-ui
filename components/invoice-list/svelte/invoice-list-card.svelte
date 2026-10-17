<script lang="ts">
import { cn } from "../../lib/cn";
import {
	formatInvoiceAmount,
	formatInvoiceDate,
	type Invoice,
	isoDate,
} from "../invoice-core";
import { getInvoiceList } from "./context";
import InvoiceListDownloads from "./invoice-list-downloads.svelte";
import InvoiceListStatus from "./invoice-list-status.svelte";

let { invoice }: { invoice: Invoice } = $props();
const ctx = getInvoiceList();
</script>

<li data-slot="invoice-list-card" class={ctx.styles.grow()}>
	<div class={ctx.styles.growInner()}>
		<div class={ctx.styles.item()}>
			<div class={ctx.styles.itemTop()}>
				<span class={ctx.styles.itemTitle()}>{invoice.description}</span>
				<span class={cn(ctx.styles.amount(), "font-medium text-sm")}>
					{formatInvoiceAmount(invoice.amount, invoice.currency, ctx.locale)}
				</span>
			</div>
			<div class={ctx.styles.itemMeta()}>
				<time datetime={isoDate(invoice.date)}>{formatInvoiceDate(invoice.date, ctx.locale)}</time>
				<span class={ctx.styles.number()}>{invoice.number}</span>
				<InvoiceListStatus status={invoice.status} />
				<InvoiceListDownloads {invoice} class="ml-auto" />
			</div>
		</div>
	</div>
</li>
