<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import ColorPicker from "../../color-picker/svelte/color-picker.svelte";
import Combobox from "../../combobox/svelte/combobox.svelte";
import ComboboxContent from "../../combobox/svelte/combobox-content.svelte";
import ComboboxTrigger from "../../combobox/svelte/combobox-trigger.svelte";
import CommandEmpty from "../../command/svelte/command-empty.svelte";
import CommandGroup from "../../command/svelte/command-group.svelte";
import CommandInput from "../../command/svelte/command-input.svelte";
import CommandItem from "../../command/svelte/command-item.svelte";
import CommandList from "../../command/svelte/command-list.svelte";
import Field from "../../field/svelte/field.svelte";
import FieldLabel from "../../field/svelte/field-label.svelte";
import Input from "../../input/svelte/input.svelte";
import NumberInput from "../../number-input/svelte/number-input.svelte";
import Select from "../../select/svelte/select.svelte";
import SelectContent from "../../select/svelte/select-content.svelte";
import SelectItem from "../../select/svelte/select-item.svelte";
import SelectTrigger from "../../select/svelte/select-trigger.svelte";
import SelectValue from "../../select/svelte/select-value.svelte";
import Slider from "../../slider/svelte/slider.svelte";
import Switch from "../../switch/svelte/switch.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import type { PropertyField, PropertyValue } from "../schema";
import { propertyPanel } from "../variants";

/** One config entry as a label column plus its baby-ui control, every kind at one height. */
let {
	field,
	value,
	onChange,
	onAction,
}: {
	field: PropertyField;
	value: PropertyValue | undefined;
	onChange: (value: PropertyValue) => void;
	onAction?: (path: string) => void;
} = $props();

const id = $props.id();
const s = propertyPanel();
let open = $state(false);
const text = $derived(typeof value === "string" ? value : "");
const num = $derived(typeof value === "number" ? value : 0);

// Shows as many decimals as the step has, so float drift never reaches the readout.
function formatStep(step: number, next: number) {
	return next.toFixed(Math.max(0, -Math.floor(Math.log10(step))));
}
</script>

{#if field.kind === "action"}
	<Button variant="outline" size="sm" class={s.fill()} onclick={() => onAction?.(field.path)}>
		{field.label}
	</Button>
{:else}
	<Field orientation="horizontal" size="sm" class={s.row()}>
		<FieldLabel for={field.kind === "text" ? id : undefined}>{field.label}</FieldLabel>
		{#if field.kind === "slider"}
			<div class={s.sliderCell()}>
				<Slider
					variant="track"
					size="sm"
					label={field.label}
					min={field.min}
					max={field.max}
					step={field.step}
					bind:value={() => num, (next) => onChange(Array.isArray(next) ? (next[0] ?? 0) : next)}
				/>
				<span class={s.sliderValue()}>{formatStep(field.step, num)}</span>
			</div>
		{:else if field.kind === "number"}
			<NumberInput
				size="sm"
				aria-label={field.label}
				bind:value={() => num, (next) => onChange(next ?? 0)}
				class={s.fill()}
			/>
		{:else if field.kind === "color"}
			<ColorPicker
				size="sm"
				label={field.label}
				bind:value={() => text, (next) => onChange(next)}
				class={s.fill()}
			/>
		{:else if field.kind === "switch"}
			<Switch
				size="sm"
				aria-label={field.label}
				class={s.switchCell()}
				bind:checked={() => value === true, (next) => onChange(next)}
			/>
		{:else if field.kind === "text"}
			<Input {id} size="sm" bind:value={() => text, (next) => onChange(next)} />
		{:else if field.kind === "select"}
			<Select items={field.options} bind:value={() => text, (next) => onChange(next)}>
				<SelectTrigger size="sm" aria-label={field.label} class={s.fill()}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent size="sm">
					{#each field.options as option (option.value)}
						<SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{:else if field.kind === "segmented"}
			<ToggleGroup
				size="sm"
				label={field.label}
				class={s.segmented()}
				bind:value={() => text, (next) => typeof next === "string" && next && onChange(next)}
			>
				{#each field.options as option (option.value)}
					<ToggleGroupItem value={option.value} class={s.segment()}>{option.label}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
		{:else if field.kind === "combobox"}
			{@const selected = field.options.find((option) => option.value === text)}
			<Combobox bind:open>
				<ComboboxTrigger size="sm" aria-label={field.label} class={s.fill()}>
					{selected?.label ?? field.placeholder ?? field.label}
				</ComboboxTrigger>
				<ComboboxContent size="sm">
					<CommandInput placeholder={field.placeholder ?? "Search"} />
					<CommandList>
						<CommandEmpty>No matches</CommandEmpty>
						<CommandGroup>
							{#each field.options as option (option.value)}
								<CommandItem
									value={option.value}
									keywords={option.label}
									onSelect={() => {
										onChange(option.value);
										open = false;
									}}
								>
									{option.label}
								</CommandItem>
							{/each}
						</CommandGroup>
					</CommandList>
				</ComboboxContent>
			</Combobox>
		{/if}
	</Field>
{/if}
