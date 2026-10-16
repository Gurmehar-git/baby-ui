<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import TableCell from "../../table/svelte/table-cell.svelte";
import TableRow from "../../table/svelte/table-row.svelte";
import { getInvoiceList } from "./context";
import {
	formatInvoiceAmount,
	formatInvoiceDate,
	type Invoice,
	isoDate,
} from "./invoice-core";
import InvoiceListDownloads from "./invoice-list-downloads.svelte";
import InvoiceListStatus from "./invoice-list-status.svelte";

let { invoice }: { invoice: Invoice } = $props();
const ctx = getInvoiceList();
</script>

<!-- Each cell opens from zero height as the row arrives, so a loaded page never pops in. -->
<TableRow data-slot="invoice-list-row">
	<TableCell class={ctx.styles.cell()}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}>
				<time datetime={isoDate(invoice.date)}>{formatInvoiceDate(invoice.date, ctx.locale)}</time>
			</div>
		</div>
	</TableCell>
	<TableCell class={ctx.styles.cell()}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}>
				<span class={ctx.styles.number()}>{invoice.number}</span>
			</div>
		</div>
	</TableCell>
	<TableCell class={ctx.styles.cell()}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}>{invoice.description}</div>
		</div>
	</TableCell>
	<TableCell class={cn(ctx.styles.cell(), ctx.styles.amount())}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}>
				{formatInvoiceAmount(invoice.amount, invoice.currency, ctx.locale)}
			</div>
		</div>
	</TableCell>
	<TableCell class={ctx.styles.cell()}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}><InvoiceListStatus status={invoice.status} /></div>
		</div>
	</TableCell>
	<TableCell class={ctx.styles.cell()}>
		<div class={ctx.styles.grow()}>
			<div class={ctx.styles.growInner()}><InvoiceListDownloads {invoice} /></div>
		</div>
	</TableCell>
</TableRow>
