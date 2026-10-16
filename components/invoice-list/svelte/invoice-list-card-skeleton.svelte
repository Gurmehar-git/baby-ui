<script lang="ts">
import Skeleton from "../../skeleton/svelte/skeleton.svelte";
import { getInvoiceList } from "./context";

const ctx = getInvoiceList();
</script>

<li aria-hidden="true" class={ctx.styles.item()}>
	<Skeleton width="60%" />
	<Skeleton width="40%" height="0.75rem" />
</li>
