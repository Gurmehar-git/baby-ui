<script lang="ts">
import { untrack } from "svelte";
import Checkbox from "../../checkbox/svelte/checkbox.svelte";
import Input from "../../input/svelte/input.svelte";
import { cn } from "../../lib/cn";
import RadioGroup from "../../radio-group/svelte/radio-group.svelte";
import RadioGroupItem from "../../radio-group/svelte/radio-group-item.svelte";
import type { QuestionAnswer, QuestionItem } from "./types";

let {
	item,
	answer,
	onChange,
	onSingleSelect,
}: {
	item: QuestionItem;
	answer: QuestionAnswer;
	onChange: (next: QuestionAnswer) => void;
	onSingleSelect?: () => void;
} = $props();

// A fresh instance per question (parent remounts under `{#key item.id}`); seeds safely.
// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
const initialRadio = item.multiple ? "" : (answer.selected[0] ?? "");
let radioValue = $state(initialRadio);
// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let checkedMap = $state<Record<string, boolean>>(
	Object.fromEntries(
		(item.options ?? []).map((o) => [o.value, answer.selected.includes(o.value)]),
	),
);
// Plain (non-$state) trackers: each effect must fire exactly once per real change, since
// calling onChange flows a new `answer` reference back down and could retrigger itself.
let lastFiredRadio = initialRadio;
let lastFiredSelected = Object.entries(checkedMap)
	.filter(([, v]) => v)
	.map(([k]) => k)
	.join(",");

$effect(() => {
	if (item.multiple || !radioValue || radioValue === lastFiredRadio) return;
	lastFiredRadio = radioValue;
	onChange({ selected: [radioValue] });
	onSingleSelect?.();
});

$effect(() => {
	if (!item.multiple) return;
	const selected = Object.entries(checkedMap)
		.filter(([, checked]) => checked)
		.map(([value]) => value);
	const key = selected.join(",");
	if (key === lastFiredSelected) return;
	lastFiredSelected = key;
	onChange({ custom: untrack(() => answer.custom), selected });
});
</script>

{#if item.options?.length}
	<div class="mt-2">
		{#if item.multiple}
			<div class="flex flex-col gap-0.5">
				{#each item.options as option (option.value)}
					<Checkbox
						bind:checked={checkedMap[option.value]}
						disabled={option.disabled}
						label={option.label}
						class="min-h-9 rounded-lg px-1.5 py-1 hover:bg-foreground/[0.04]"
					/>
				{/each}
			</div>
		{:else}
			<RadioGroup bind:value={radioValue} class="gap-0.5">
				{#each item.options as option (option.value)}
					<RadioGroupItem
						value={option.value}
						label={option.label}
						disabled={option.disabled}
						class="min-h-9 rounded-lg px-1.5 py-1 hover:bg-foreground/[0.04]"
					/>
				{/each}
			</RadioGroup>
		{/if}
	</div>
{/if}

{#if item.allowCustom}
	<Input
		value={answer.custom ?? ""}
		placeholder={item.customPlaceholder ?? "Add another response…"}
		oninput={(e) =>
			onChange({
				selected: item.multiple ? answer.selected : [],
				custom: e.currentTarget.value,
			})}
		class={cn(item.options?.length && "mt-1.5")}
	/>
{/if}
