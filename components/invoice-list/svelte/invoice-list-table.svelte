<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import Table from "../../table/svelte/table.svelte";
import TableBody from "../../table/svelte/table-body.svelte";
import TableCaption from "../../table/svelte/table-caption.svelte";
import TableHead from "../../table/svelte/table-head.svelte";
import TableHeader from "../../table/svelte/table-header.svelte";
import TableRow from "../../table/svelte/table-row.svelte";
import { getInvoiceList } from "./context";

let {
	showCaption = false,
	class: classProp,
	children,
}: {
	/** The caption stays in the accessibility tree; this also paints it under the table. */
	showCaption?: boolean;
	class?: string;
	children?: Snippet;
} = $props();
const ctx = getInvoiceList();
</script>

<!-- The wide layout: a captioned table that takes over from the cards at the @xl container width. -->
<div class={cn(ctx.styles.table(), classProp)}>
	<Table density={ctx.density}>
		<TableCaption class={showCaption ? undefined : "sr-only"}>{ctx.labels.caption}</TableCaption>
		<TableHeader>
			<TableRow>
				<TableHead scope="col">{ctx.labels.columns.date}</TableHead>
				<TableHead scope="col">{ctx.labels.columns.number}</TableHead>
				<TableHead scope="col">{ctx.labels.columns.description}</TableHead>
				<TableHead scope="col" class="text-right">{ctx.labels.columns.amount}</TableHead>
				<TableHead scope="col">{ctx.labels.columns.status}</TableHead>
				<TableHead scope="col" class="text-right">
					<span class="sr-only">{ctx.labels.columns.actions}</span>
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>{@render children?.()}</TableBody>
	</Table>
</div>
