<script lang="ts">
import Select from "../select/select.svelte";
import SelectContent from "../select/select-content.svelte";
import SelectItem from "../select/select-item.svelte";
import SelectTrigger from "../select/select-trigger.svelte";
import SelectValue from "../select/select-value.svelte";
import type { FlowchartOption } from "./types";

let {
	value,
	options,
	onChange,
	width,
	dot,
}: {
	value: string;
	options: FlowchartOption[];
	onChange: (value: string) => void;
	width: string;
	dot?: boolean;
} = $props();

const current = $derived(options.find((o) => o.value === value));
</script>

<span data-ui class="relative inline-flex min-w-0">
	<Select bind:value={() => value, onChange}>
		<SelectTrigger
			class="h-6 min-w-0 gap-1 rounded-md border-none bg-muted px-1.5 font-medium text-xs text-foreground [&>svg]:size-3"
		>
			{#if dot}<span class="size-1.5 shrink-0 rounded-full bg-current"></span>{/if}
			<SelectValue>{current?.label ?? value}</SelectValue>
		</SelectTrigger>
		<SelectContent class={width}>
			{#each options as option (option.value)}
				<SelectItem value={option.value}>
					<span class="flex min-w-0 flex-1 items-center justify-between gap-2">
						<span class="truncate">{option.label}</span>
						{#if option.tag}<span class="shrink-0 text-xs text-muted-foreground">{option.tag}</span>{/if}
					</span>
				</SelectItem>
			{/each}
		</SelectContent>
	</Select>
</span>
