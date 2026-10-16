<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { getInvoiceList } from "./context";
import { INVOICE_STATUS_TONE, type InvoiceStatus } from "./invoice-core";

let { status, class: classProp }: { status: InvoiceStatus; class?: string } = $props();
const ctx = getInvoiceList();
</script>

<Badge variant={INVOICE_STATUS_TONE[status]} size="sm" class={classProp}>
	{ctx.labels.status[status]}
</Badge>
