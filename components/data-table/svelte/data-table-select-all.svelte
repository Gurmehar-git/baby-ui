<script lang="ts" generics="TData extends RowData">
import type { RowData } from "@tanstack/table-core";
import Checkbox from "../../checkbox/svelte/checkbox.svelte";
import { getDataTableStatus } from "./context";
import type { DataTableInstance } from "./core";

let { table }: { table: DataTableInstance<TData> } = $props();

const status = getDataTableStatus();
</script>

<Checkbox
	size="sm"
	aria-label={status().labels.selectAll}
	indeterminate={table.getIsSomePageRowsSelected()}
	bind:checked={() => table.getIsAllPageRowsSelected(), (on) => table.toggleAllPageRowsSelected(on)}
/>
