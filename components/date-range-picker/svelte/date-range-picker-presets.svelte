<script lang="ts">
import { tick } from "svelte";
import { type PillBox, pillCss, pressedBox } from "../../lib/pill";
import {
	type DateRangeParts,
	type DateRangePreset,
	sameRange,
	todayParts,
} from "../core";
import { dateRangePicker } from "../variants";

let {
	presets,
	label,
	selected,
	onPick,
}: {
	presets: DateRangePreset[];
	label: string;
	selected: DateRangeParts | null;
	onPick: (range: DateRangeParts) => void;
} = $props();

const s = dateRangePicker();
const today = todayParts();
let rail = $state<HTMLFieldSetElement>();
let box = $state<PillBox | null>(null);
let ready = $state(false);
const pressedKey = $derived(
	presets.find((p) => sameRange(selected, p.range(today)))?.label,
);

// The fill follows the pressed preset; it slides only once it has a first position.
$effect(() => {
	void pressedKey;
	const el = rail;
	if (!el) return;
	void tick().then(() => {
		box = pressedBox(el);
		if (box && !ready) requestAnimationFrame(() => (ready = true));
	});
});
</script>

<!-- The preset rail: one pressed preset at most, marked by a fill that slides between them. -->
<fieldset bind:this={rail} aria-label={label} class={s.rail()}>
	<span
		aria-hidden="true"
		data-ready={ready ? "" : undefined}
		class={s.pill()}
		style={pillCss(box)}
	></span>
	{#each presets as preset (preset.label)}
		<button
			type="button"
			aria-pressed={preset.label === pressedKey}
			class={s.preset()}
			onclick={() => onPick(preset.range(today))}
		>
			{preset.label}
		</button>
	{/each}
</fieldset>
