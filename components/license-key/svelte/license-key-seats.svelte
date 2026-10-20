<script lang="ts">
import { LICENSE_KEY_LABELS } from "../license-core";
import { getLicenseKey } from "./context";
import LicenseKeyMetaItem from "./license-key-meta-item.svelte";

let {
	used,
	total,
	label = LICENSE_KEY_LABELS.seats,
	of = LICENSE_KEY_LABELS.seatsOf,
	class: classProp,
}: {
	used: number;
	total: number;
	label?: string;
	of?: string;
	class?: string;
} = $props();
const ctx = getLicenseKey();
</script>

<!-- Seats as pips, one per seat, when there are few enough to count at a glance. -->
<LicenseKeyMetaItem {label} class={classProp}>
	{#if total <= 12}
		<span aria-hidden="true" class={ctx.styles.pips()}>
			{#each { length: total }, i (i)}
				<span
					data-on={i < used ? "" : undefined}
					class={ctx.styles.pip()}
					style:transition-delay="{120 + i * 45}ms"
				></span>
			{/each}
		</span>
	{/if}
	{used}
	{of}
	{total}
</LicenseKeyMetaItem>
