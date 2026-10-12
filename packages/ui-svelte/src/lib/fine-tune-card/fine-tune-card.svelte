<script lang="ts">
import { cn } from "../lib/cn";
import PropertyPanelControls from "../property-panel/property-panel-controls.svelte";
import type { PropertyValues } from "../property-panel/schema";
import {
	FINE_TUNE_LAYOUTS,
	type FineTuneCardLabels,
	type FineTuneField,
	type FineTuneState,
	fineTuneInitial,
	fineTuneSchema,
} from "./types";
import { type FineTuneCardSize, fineTuneCard } from "./variants";

let {
	fields,
	options = [],
	labels,
	size = "default",
	id,
	state: stateProp = $bindable(),
	defaultState,
	onChange,
	class: classProp,
}: {
	/** The tunable numbers, one slider row each. */
	fields: FineTuneField[];
	/** Options offered in the Type select; the row is hidden when empty. */
	options?: string[];
	labels?: FineTuneCardLabels;
	size?: FineTuneCardSize;
	/** Identifies the subject `fields` describes; changing it resets uncontrolled edits. */
	id?: string;
	/** Bindable editable state; starts at `defaultState` or the fields' own values. */
	state?: FineTuneState;
	defaultState?: FineTuneState;
	onChange?: (state: FineTuneState) => void;
	class?: string;
} = $props();

const text = $derived({
	title: "Untitled",
	adjust: "Adjust",
	edited: "Edited",
	...labels,
});
const s = $derived(fineTuneCard({ size }));
// svelte-ignore state_referenced_locally -- one-time seed, matching React's useState(initialValue)
let own = $state<FineTuneState>(defaultState ?? fineTuneInitial(fields));
// svelte-ignore state_referenced_locally
let seenId = id;
$effect.pre(() => {
	if (id === seenId) return;
	seenId = id;
	own = fineTuneInitial(fields);
});
const current = $derived(stateProp ?? own);
const values: PropertyValues = $derived({
	layout: current.layout,
	...current.values,
	variant: current.type,
});
const edited = $derived(
	current.layout !== FINE_TUNE_LAYOUTS[0] ||
		current.type !== "" ||
		fields.some((f) => (current.values[f.key] ?? f.value) !== f.value),
);

function update(next: PropertyValues) {
	const nextState: FineTuneState = {
		layout: typeof next.layout === "string" ? next.layout : current.layout,
		values: Object.fromEntries(
			fields.map((f) => {
				const v = next[f.key];
				return [f.key, typeof v === "number" ? v : f.value];
			}),
		),
		type: typeof next.variant === "string" ? next.variant : current.type,
	};
	if (stateProp === undefined) own = nextState;
	else stateProp = nextState;
	onChange?.(nextState);
}
</script>

<!-- An element inspector: layout, tunable numbers and a type, with an Edited badge once changed. -->
<div data-slot="fine-tune-card" class={cn(s.root(), classProp)}>
	<div class={s.header()}>
		<span class={s.title()}>{text.title}</span>
		{#if edited}
			<span class={s.edited()}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-2.5"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
				{text.edited}
			</span>
		{:else}
			<span class={s.adjust()}>{text.adjust}</span>
		{/if}
	</div>
	<PropertyPanelControls
		schema={fineTuneSchema(fields, options)}
		{values}
		onValuesChange={(next) => update(next)}
	/>
</div>
