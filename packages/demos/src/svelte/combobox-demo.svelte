<script lang="ts">
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
let open = $state(false);
let value = $state("");
const p = $derived(controlProps<ComponentProps<typeof ComboboxTrigger>>(props));
const size = $derived(p.size ?? "default");

const regions = [
	{ value: "ams", label: "Amsterdam" },
	{ value: "blr", label: "Bengaluru" },
	{ value: "fra", label: "Frankfurt" },
	{ value: "iad", label: "Washington DC" },
	{ value: "nrt", label: "Tokyo" },
	{ value: "syd", label: "Sydney" },
];

const selected = $derived(regions.find((r) => r.value === value));
</script>

<Combobox bind:open>
	<ComboboxTrigger {size}>
		{selected?.label ?? "Search regions…"}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5 shrink-0 text-muted-foreground">
			<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</ComboboxTrigger>
	<ComboboxContent {size}>
		<ComboboxInput placeholder="Search regions…" />
		<ComboboxList>
			<ComboboxEmpty>No matches</ComboboxEmpty>
			<ComboboxGroup>
				{#each regions as region (region.value)}
					<ComboboxItem
						value={region.value}
						keywords={region.label}
						onSelect={() => {
							value = region.value === value ? "" : region.value;
							open = false;
						}}
					>
						{region.label}
						{#if region.value === value}
							<svg viewBox="0 0 14 14" fill="none" aria-hidden="true" class="size-3.5 shrink-0">
								<path d="M3 7.4 5.6 10 11 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						{/if}
					</ComboboxItem>
				{/each}
			</ComboboxGroup>
		</ComboboxList>
	</ComboboxContent>
</Combobox>
