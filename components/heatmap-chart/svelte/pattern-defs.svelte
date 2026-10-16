<svelte:options namespace="svg" />

<script lang="ts">
let { uid, size }: { uid: string; size: number } = $props();

const tile = $derived(Math.max(3, Math.round(size / 3)));
const stroke = "color-mix(in oklch, var(--background) 60%, transparent)";
</script>

<defs>
	<pattern id="{uid}-dots" width={tile} height={tile} patternUnits="userSpaceOnUse">
		<circle cx={tile / 2} cy={tile / 2} r={Math.max(0.6, tile / 6)} fill={stroke} />
	</pattern>
	<pattern id="{uid}-lines" width={tile} height={tile} patternUnits="userSpaceOnUse">
		<path d="M0 {tile} {tile} 0" {stroke} stroke-width={1} />
	</pattern>
	<pattern id="{uid}-cross" width={tile} height={tile} patternUnits="userSpaceOnUse">
		<path d="M0 {tile} {tile} 0M0 0 {tile} {tile}" {stroke} stroke-width={1} />
	</pattern>
</defs>
