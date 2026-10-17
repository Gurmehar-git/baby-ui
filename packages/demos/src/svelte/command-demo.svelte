<script lang="ts">
import {
	Button,
	Command,
	CommandBar,
	CommandDialog,
	CommandEmpty,
	CommandFilter,
	CommandFilters,
	CommandFooter,
	CommandGroup,
	CommandHeader,
	CommandHint,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
	type CommandVariant,
} from "@baby-ui/svelte";
import { COMMAND_ALL, COMMAND_GROUPS } from "../data/command";

let { props = {} }: { props?: Record<string, unknown> } = $props();

const VARIANTS: CommandVariant[] = ["default", "framed", "launcher", "spotlight"];
const variant = $derived(VARIANTS.find((v) => v === props.variant) ?? "default");
const placeholder = $derived(
	typeof props.placeholder === "string" && props.placeholder
		? props.placeholder
		: variant === "spotlight"
			? "What are you searching for?"
			: "Type a command or search…",
);

let open = $state(false);
let last = $state("");
let filter = $state("all");
const groups = $derived(
	filter === "all" ? COMMAND_GROUPS : COMMAND_GROUPS.filter((g) => g.id === filter),
);

function run(id: string) {
	last = id;
	open = false;
}
</script>

{#snippet icon(d: string)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path {d} stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

<div class="flex flex-col items-center gap-3">
	<Button variant="outline" onclick={() => (open = true)}>Open palette</Button>
	{#if last}<p class="text-muted-foreground text-xs">Ran: {last}</p>{/if}
</div>

<CommandDialog bind:open {variant}>
	<Command>
		{#if variant === "framed"}<CommandHeader>Command</CommandHeader>{/if}
		{#if variant === "launcher"}
			<CommandBar>
				<CommandInput {placeholder} hint="⌘K" />
				<CommandFilters bind:value={filter} label="Show">
					{#each [COMMAND_ALL, ...COMMAND_GROUPS] as group (group.id)}
						<CommandFilter value={group.id} label={group.heading}>{@render icon(group.icon)}</CommandFilter>
					{/each}
				</CommandFilters>
			</CommandBar>
		{:else if variant === "spotlight"}
			<CommandFilters bind:value={filter} label="Scope">
				{#each [COMMAND_ALL, ...COMMAND_GROUPS] as group (group.id)}
					<CommandFilter value={group.id} label={group.heading}>{group.heading}</CommandFilter>
				{/each}
			</CommandFilters>
			<CommandInput {placeholder} hint="Esc" />
		{:else}
			<CommandInput {placeholder} />
		{/if}
		<CommandList>
			<CommandEmpty>{typeof props.emptyLabel === "string" ? props.emptyLabel : "No results"}</CommandEmpty>
			{#each groups as group (group.id)}
				<CommandGroup heading={group.heading}>
					{#each group.items as item (item.value)}
						<CommandItem value={item.value} keywords={item.keywords} onclick={() => run(item.value)}>
							{@render icon(group.icon)}
							<span class="min-w-0 flex-1 truncate">{item.value}</span>
							{#if "shortcut" in item && item.shortcut}<CommandShortcut>{item.shortcut}</CommandShortcut>{/if}
						</CommandItem>
					{/each}
				</CommandGroup>
			{/each}
		</CommandList>
		{#if variant === "launcher"}
			<CommandFooter>
				<span class="flex items-center gap-4">
					<CommandHint keys={["↑", "↓"]}>Move</CommandHint>
					<CommandHint keys={["↵"]}>Open</CommandHint>
				</span>
				<CommandHint keys={["Esc"]}>Close</CommandHint>
			</CommandFooter>
		{/if}
	</Command>
</CommandDialog>
