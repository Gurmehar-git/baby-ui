<script lang="ts">
import {
	Button,
	Combobox,
	ComboboxTrigger,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	type InputSize,
	NativeSelect,
	NativeSelectOption,
	NumberInput,
	PaginationLink,
	Select,
	SelectTrigger,
	SelectValue,
	Tabs,
	TabsList,
	TabsTrigger,
	TagInput,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/svelte";
import { watchLayout } from "./measure";

const LADDER: { size: InputSize; height: number; radius: string }[] = [
	{ size: "xs", height: 24, radius: "sm" },
	{ size: "sm", height: 32, radius: "md" },
	{ size: "default", height: 36, radius: "lg" },
	{ size: "lg", height: 40, radius: "lg" },
	{ size: "xl", height: 48, radius: "xl" },
];

type Reading = { name: string; height: number; radius: number };
let readings = $state<Record<string, Reading[]>>({});

// Reads every probed control's rendered box, so the readout is what the browser drew.
function measure(row: HTMLElement) {
	const size = row.dataset.size ?? "";
	return watchLayout(row, () => {
		readings[size] = [...row.querySelectorAll<HTMLElement>("[data-probe]")].map(
			(probe) => {
				// A composite names the part that carries the frame, such as the NumberInput field box.
				const inner = probe.dataset.probeInner;
				const el = (inner && probe.querySelector<HTMLElement>(inner)) || probe;
				return {
					name: probe.dataset.probe ?? "",
					height: Math.round(el.getBoundingClientRect().height * 10) / 10,
					radius: Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
				};
			},
		);
	});
}

const off = (r: Reading, height: number) => Math.abs(r.height - height) > 0.5;
</script>

<div class="overflow-hidden rounded-2xl border border-border">
	<table class="w-full text-sm">
		<thead class="bg-card text-left text-muted-foreground text-xs">
			<tr>
				<th class="px-4 py-2.5 font-medium">size</th>
				<th class="px-4 py-2.5 font-medium">Height</th>
				<th class="px-4 py-2.5 font-medium">Radius</th>
				<th class="hidden px-4 py-2.5 font-medium sm:table-cell">Text</th>
				<th class="hidden px-4 py-2.5 font-medium sm:table-cell">Icon</th>
				<th class="px-4 py-2.5 font-medium">Ratio</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-border font-mono text-xs tabular-nums">
			{#each LADDER as row, i (row.size)}
				<tr>
					<td class="px-4 py-2.5 font-sans font-medium text-foreground text-sm">{row.size}</td>
					<td class="px-4 py-2.5">{row.height}px</td>
					<td class="px-4 py-2.5">rounded-{row.radius}</td>
					<td class="hidden px-4 py-2.5 sm:table-cell">{["12", "12", "14", "14", "16"][i]}px</td>
					<td class="hidden px-4 py-2.5 sm:table-cell">{["12", "14", "16", "18", "20"][i]}px</td>
					<td class="px-4 py-2.5 text-muted-foreground">
						{#if readings[row.size]?.[0]}
							{Math.round((readings[row.size]?.[0]?.radius ?? 0) / row.height * 100)}%
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<p class="mt-6 text-muted-foreground text-sm">
	Every control at every size, drawn live. Dashed lines mark the ladder's height; each readout is
	the rendered height and corner radius.
</p>

<div class="mt-4 flex flex-col gap-3">
	{#each LADDER as row (row.size)}
		{@const r = (name: string) => readings[row.size]?.find((x) => x.name === name)}
		<div class="rounded-2xl border border-border bg-card p-1">
			<div class="flex items-center justify-between px-3 pt-1.5 pb-2 text-xs">
				<span class="font-medium text-foreground">{row.size}</span>
				<span class="font-mono text-muted-foreground tabular-nums">{row.height}px · rounded-{row.radius}</span>
			</div>
			<div class="overflow-x-auto rounded-[11px] border border-border bg-background">
				<div
					data-size={row.size}
					{@attach measure}
					class="relative flex w-max items-start gap-6 px-5 py-5"
				>
					<span
						aria-hidden="true"
						class="pointer-events-none absolute inset-x-0 top-5 border-primary/40 border-t border-dashed"
					></span>
					<span
						aria-hidden="true"
						class="pointer-events-none absolute inset-x-0 border-primary/40 border-t border-dashed"
						style:top="calc(1.25rem + {row.height}px)"
					></span>

					{#snippet probe(name: string, reading: Reading | undefined)}
						<span
							class="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums data-[off=true]:text-destructive-strong"
							data-off={reading ? off(reading, row.height) : false}
						>
							{name}
							{#if reading}· {reading.height} / r{reading.radius}{/if}
						</span>
					{/snippet}

					<div class="flex flex-col items-start gap-2">
						<Button size={row.size} data-probe="Button">Button</Button>
						{@render probe("Button", r("Button"))}
					</div>
					<div class="flex w-40 flex-col gap-2">
						<Input size={row.size} placeholder="Input" aria-label="Input" data-probe="Input" />
						{@render probe("Input", r("Input"))}
					</div>
					<div class="flex w-40 flex-col gap-2">
						<Select type="single" items={[{ value: "a", label: "Option" }]}>
							<SelectTrigger size={row.size} aria-label="Select" data-probe="Select">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
						</Select>
						{@render probe("Select", r("Select"))}
					</div>
					<div class="flex w-40 flex-col gap-2">
						<NativeSelect size={row.size} aria-label="Native select" class="w-full" data-probe="Native">
							<NativeSelectOption value="a">Native</NativeSelectOption>
						</NativeSelect>
						{@render probe("Native", r("Native"))}
					</div>
					<div class="flex w-40 flex-col gap-2">
						<Combobox>
							<ComboboxTrigger size={row.size} data-probe="Combobox">
								Combobox
								<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="shrink-0 text-muted-foreground">
									<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</ComboboxTrigger>
						</Combobox>
						{@render probe("Combobox", r("Combobox"))}
					</div>
					<div class="flex w-44 flex-col gap-2">
						<InputGroup size={row.size} data-probe="Group">
							<InputGroupAddon>https://</InputGroupAddon>
							<InputGroupInput placeholder="acme" aria-label="Domain" />
						</InputGroup>
						{@render probe("Group", r("Group"))}
					</div>
					<div class="flex flex-col items-start gap-2">
						<Toggle size={row.size} aria-label="Bold" data-probe="Toggle">
							<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path d="M5 3.5h4a2.25 2.25 0 0 1 0 4.5H5zM5 8h4.5a2.25 2.25 0 0 1 0 4.5H5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
							</svg>
						</Toggle>
						{@render probe("Toggle", r("Toggle"))}
					</div>
					<div class="flex flex-col items-start gap-2">
						<ToggleGroup type="single" value="day" size={row.size} label="Range" data-probe="Group·toggle">
							<ToggleGroupItem value="day">Day</ToggleGroupItem>
							<ToggleGroupItem value="week">Week</ToggleGroupItem>
						</ToggleGroup>
						{@render probe("ToggleGroup", r("Group·toggle"))}
					</div>
					<div class="flex flex-col items-start gap-2">
						<span data-probe="Tabs" data-probe-inner="[data-slot=tabs-list]">
							<Tabs value="a" variant="segment" size={row.size}>
								<TabsList>
									<TabsTrigger value="a">Daily</TabsTrigger>
									<TabsTrigger value="b">Weekly</TabsTrigger>
								</TabsList>
							</Tabs>
						</span>
						{@render probe("Tabs", r("Tabs"))}
					</div>
					<div class="flex w-40 flex-col gap-2">
						<span data-probe="Number" data-probe-inner="[data-slot=number-input-group]">
							<NumberInput size={row.size} value={2} min={0} max={9} label="Seats" />
						</span>
						{@render probe("Number", r("Number"))}
					</div>
					<div class="flex w-60 flex-col gap-2">
						<span data-probe="Tags" data-probe-inner="[data-slot=tag-input]">
							<TagInput size={row.size} tags={["design"]} placeholder="Add" label="Tags" />
						</span>
						{@render probe("Tags", r("Tags"))}
					</div>
					<div class="flex flex-col items-start gap-2">
						<span data-probe="Page" data-probe-inner="[data-slot=pagination-link]">
							<PaginationLink size={row.size} active>12</PaginationLink>
						</span>
						{@render probe("Page", r("Page"))}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
