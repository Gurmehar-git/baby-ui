<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import Checkbox from "../../checkbox/svelte/checkbox.svelte";
import HoverCard from "../../hover-card/svelte/hover-card.svelte";
import HoverCardContent from "../../hover-card/svelte/hover-card-content.svelte";
import HoverCardTrigger from "../../hover-card/svelte/hover-card-trigger.svelte";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import Select from "../../select/svelte/select.svelte";
import SelectContent from "../../select/svelte/select-content.svelte";
import SelectItem from "../../select/svelte/select-item.svelte";
import SelectTrigger from "../../select/svelte/select-trigger.svelte";
import SelectValue from "../../select/svelte/select-value.svelte";
import Switch from "../../switch/svelte/switch.svelte";
import GlyphIcon from "./glyph-icon.svelte";
import { NEW_PROPERTY_TYPES, TYPE_GLYPHS, toggleIn } from "./model";
import type {
	RecordsColumnConfig,
	RecordsColumnSettings,
	RecordsColumnType,
	RecordsTableLabels,
	ResolvedColumn,
} from "./types";

let {
	title,
	labels,
	column,
	onChange,
	inputOptions,
	modelOptions,
	pinned,
	onTogglePin,
	onHide,
	onCalculate,
	calculating,
}: {
	title: string;
	labels: RecordsTableLabels;
	column: ResolvedColumn;
	onChange: (patch: RecordsColumnConfig) => void;
	inputOptions: string[];
	modelOptions: string[];
	pinned: boolean;
	onTogglePin: () => void;
	onHide?: () => void;
	onCalculate: () => void;
	calculating: boolean;
} = $props();

let moreOpen = $state(false);
const behaviour: (keyof Omit<RecordsColumnSettings, "grounding">)[] = [
	"required",
	"allowEmpty",
	"confidence",
];
const typeItems = NEW_PROPERTY_TYPES.map((type) => ({ value: type, label: type }));
const actionRow =
	"flex h-8 items-center gap-2.5 rounded-md px-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent";
const pickerTrigger =
	"h-7 w-auto min-w-0 gap-1.5 border-none bg-transparent px-1.5 font-medium text-sm text-foreground hover:bg-accent";
</script>

{#snippet icon(size: number, d: string[], circles: [number, number, number][] = [])}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#each circles as [cx, cy, r], i (i)}<circle {cx} {cy} {r} />{/each}
		{#each d as path, i (i)}<path d={path} />{/each}
	</svg>
{/snippet}

<div data-slot="records-table-config-popover">
	<div class="pb-2 font-medium text-sm text-foreground">{title}</div>

	<div class="relative flex h-8 items-center justify-between">
		<span class="text-sm text-muted-foreground">{labels.type}</span>
		<Select
			bind:value={() => column.type, (v) => onChange({ type: v as RecordsColumnType })}
			items={typeItems}
		>
			<SelectTrigger aria-label={labels.type} class={pickerTrigger}>
				<GlyphIcon glyphs={TYPE_GLYPHS[column.type]} />
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="start">
				{#each NEW_PROPERTY_TYPES as type (type)}
					<SelectItem value={type}>
						<span class="flex items-center gap-1.5">
							<GlyphIcon glyphs={TYPE_GLYPHS[type]} />
							{type}
						</span>
					</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>

	<div class="relative flex h-8 items-center justify-between">
		<span class="text-sm text-muted-foreground">{labels.tool}</span>
		<Select
			bind:value={() => column.tool, (tool) => onChange({ tool, toolKind: "model" })}
			items={modelOptions.map((model) => ({ value: model, label: model }))}
		>
			<SelectTrigger aria-label={labels.tool} class={pickerTrigger}>
				<span class={column.toolKind === "model" ? "text-primary" : "text-muted-foreground"}>
					{#if column.toolKind === "model"}
						{@render icon(14, ["M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z"])}
					{:else if column.toolKind === "web"}
						{@render icon(14, ["M3 12h18M12 3a13.5 13.5 0 0 1 3.5 9 13.5 13.5 0 0 1-3.5 9 13.5 13.5 0 0 1-3.5-9A13.5 13.5 0 0 1 12 3z"], [[12, 12, 9]])}
					{:else}
						{@render icon(14, ["M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"], [[12, 8, 4]])}
					{/if}
				</span>
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="start">
				{#each modelOptions as model (model)}
					<SelectItem value={model}>{model}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>

	<div class="relative flex h-8 items-center justify-between">
		<span class="text-sm text-muted-foreground">{labels.grounding}</span>
		<span class="flex items-center gap-2">
			<Switch
				aria-label={labels.grounding}
				bind:checked={() => column.grounding, (grounding) => onChange({ grounding })}
			/>
			<HoverCard>
				<HoverCardTrigger
					aria-label={labels.aboutGrounding}
					class="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					{@render icon(13, ["M12 8h.01M11 12h1v4h1"], [[12, 12, 9]])}
				</HoverCardTrigger>
				<HoverCardContent side="top" class="w-56 text-xs leading-relaxed">
					{labels.groundingHelp}
				</HoverCardContent>
			</HoverCard>
		</span>
	</div>

	<div class="relative flex h-8 items-center justify-between">
		<span class="text-sm text-muted-foreground">{labels.inputs}</span>
		<Popover>
			<PopoverTrigger
				aria-label={labels.inputs}
				class="flex h-7 max-w-[220px] items-center gap-1.5 rounded-md px-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				{#if column.inputs.length}
					<span class="flex min-w-0 items-center gap-1">
						{#each column.inputs.slice(0, 2) as input (input)}
							<span class="max-w-[92px] truncate rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-medium text-xs text-primary">
								{input}
							</span>
						{/each}
						{#if column.inputs.length > 2}
							<span class="font-medium text-xs text-muted-foreground">+{column.inputs.length - 2}</span>
						{/if}
					</span>
				{:else}
					<span>{labels.selectInputs}</span>
				{/if}
			</PopoverTrigger>
			<PopoverContent align="start" class="w-56 p-1.5">
				<div class="px-1.5 pt-0.5 pb-1 font-medium text-xs text-muted-foreground">{labels.useValuesFrom}</div>
				<div class="flex flex-col gap-0.5">
					{#each inputOptions as option (option)}
						<Checkbox
							label={option}
							bind:checked={
								() => column.inputs.includes(option),
								() => onChange({ inputs: toggleIn(column.inputs, option) })
							}
							class="min-h-8 rounded-md px-1.5 py-1 hover:bg-accent"
						/>
					{/each}
				</div>
			</PopoverContent>
		</Popover>
	</div>

	{#if column.prompt}
		<div class="mt-2 min-h-[64px] rounded-lg border border-border bg-muted p-3 text-sm leading-relaxed">
			<span class="text-foreground">
				{column.prompt.before}{#if column.prompt.chip}<span class="rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-medium text-xs text-primary">{column.prompt.chip}</span>{/if}{column.prompt.after}
			</span>
		</div>
	{/if}

	<Button variant="secondary" size="sm" disabled={calculating} onclick={onCalculate} class="mt-2.5 w-full">
		{@render icon(14, ["M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"])}
		{labels.calculate}
	</Button>

	<div class="mt-3 flex flex-col gap-0.5 border-border border-t pt-2">
		<button type="button" aria-pressed={pinned} onclick={onTogglePin} class={actionRow}>
			<span class={pinned ? "text-primary" : "text-muted-foreground"}>
				{@render icon(15, ["M12 17v5M8 3h8l-1 7 3 3H6l3-3-1-7z"])}
			</span>
			{pinned ? labels.unpin : labels.pin}
		</button>
		<button type="button" aria-expanded={moreOpen} onclick={() => (moreOpen = !moreOpen)} class={actionRow}>
			<span class="text-muted-foreground">
				{@render icon(15, ["M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"], [[12, 12, 3]])}
			</span>
			<span class="flex-1">{labels.moreSettings}</span>
			<span class={cn("text-muted-foreground transition-transform duration-(--duration-fast) motion-reduce:transition-none", moreOpen && "rotate-90")}>
				{@render icon(12, ["M9 6l6 6-6 6"])}
			</span>
		</button>
		{#if onHide}
			<button type="button" onclick={onHide} class={actionRow}>
				<span class="text-muted-foreground">
					{@render icon(15, [
						"M10.6 5.1A9.8 9.8 0 0 1 12 5c7 0 10 7 10 7a16.3 16.3 0 0 1-2.1 3M6.6 6.6A16 16 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6M3 3l18 18",
						"M9.9 9.9a3 3 0 0 0 4.2 4.2",
					])}
				</span>
				{labels.hide}
			</button>
		{/if}
	</div>

	<div
		data-slot="records-table-more-settings"
		data-open={moreOpen || undefined}
		inert={!moreOpen}
		class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] data-[open]:grid-rows-[1fr] motion-reduce:transition-none"
	>
		<div class="min-h-0 overflow-hidden">
			<div class="mt-2 border-border border-t pt-2">
				<div class="pb-1 font-medium text-xs text-muted-foreground">{labels.behavior}</div>
				{#each behaviour as key (key)}
					<div class="relative flex h-8 items-center justify-between">
						<span class="text-sm text-muted-foreground">{labels[key]}</span>
						<Switch
							aria-label={labels[key]}
							bind:checked={() => column[key], (on) => onChange({ [key]: on })}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
