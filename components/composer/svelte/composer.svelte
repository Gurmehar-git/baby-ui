<script lang="ts">
import type { Snippet } from "svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/cn";
import Select from "../../select/svelte/select.svelte";
import SelectContent from "../../select/svelte/select-content.svelte";
import SelectItem from "../../select/svelte/select-item.svelte";
import SelectTrigger from "../../select/svelte/select-trigger.svelte";
import { COMPOSER_LINE_HEIGHT, type ComposerSize, composer } from "../variants";
import type { ComposerAction, ComposerModel } from "./types";

const ACTIONS_TRIGGER =
	"flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground [&>svg]:transition-transform [&>svg]:duration-(--duration-fast) [&>svg]:ease-[var(--ease-ui-out)] data-[state=open]:[&>svg]:rotate-45";

let {
	value = $bindable(""),
	onValueChange,
	placeholder = "Send a message…",
	disabled = false,
	loading = false,
	onStop,
	minRows = 1,
	maxRows = 8,
	size = "default",
	models = [],
	model = $bindable(undefined),
	onModelChange,
	actions = [],
	onAction,
	leadingAction,
	onSubmit,
	class: classProp,
}: {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	loading?: boolean;
	onStop?: () => void;
	minRows?: number;
	maxRows?: number;
	size?: ComposerSize;
	models?: ComposerModel[];
	model?: string;
	onModelChange?: (model: string) => void;
	actions?: ComposerAction[];
	onAction?: (value: string) => void;
	leadingAction?: Snippet;
	onSubmit?: (value: string, model?: string) => void;
	class?: string;
} = $props();

let textareaEl = $state<HTMLTextAreaElement>();
let mirrorEl = $state<HTMLDivElement>();
let actionsOpen = $state(false);
// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let selectValue = $state(model ?? models[0]?.value ?? "");

// Keep the two in sync either way: a pick in the Select writes selectValue (via
// bind:value), an external change to the bindable `model` prop writes selectValue back.
$effect(() => {
	if (selectValue && selectValue !== model) setModel(selectValue);
});
$effect(() => {
	if (model !== undefined && model !== selectValue) selectValue = model;
});

const currentModel = $derived(model ?? models[0]?.value);
const currentModelOption = $derived(models.find((m) => m.value === currentModel));
const canSubmit = $derived(value.trim() !== "" && !disabled && !loading);
const lineHeight = $derived(COMPOSER_LINE_HEIGHT[size]);
const slots = $derived(composer({ size }));

function resize() {
	if (!textareaEl || !mirrorEl) return;
	const next = Math.min(
		Math.max(mirrorEl.scrollHeight, minRows * lineHeight),
		maxRows * lineHeight,
	);
	textareaEl.style.height = `${next}px`;
}

$effect(() => {
	value;
	resize();
});

function setValue(next: string) {
	value = next;
	onValueChange?.(next);
}

function setModel(next: string) {
	model = next;
	onModelChange?.(next);
}

function submit() {
	const text = value.trim();
	if (!text || disabled || loading) return;
	onSubmit?.(text, currentModel);
	value = "";
	textareaEl?.focus();
}

// Enter sends, Shift+Enter breaks the line; a composing Enter (finishing an IME
// conversion) commits text, not the message, and must not submit.
function onKeyDown(event: KeyboardEvent) {
	if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
	event.preventDefault();
	submit();
}
</script>

<div
	data-slot="composer"
	class={cn(slots.root(), disabled && "pointer-events-none opacity-50", classProp)}
>
	<div
		bind:this={mirrorEl}
		aria-hidden="true"
		class={cn(
			slots.textarea(),
			"pointer-events-none invisible absolute inset-x-2 top-0 whitespace-pre-wrap [overflow-wrap:break-word]",
		)}
	>
		{value}&#8203;
	</div>
	<textarea
		bind:this={textareaEl}
		rows={minRows}
		{value}
		{placeholder}
		{disabled}
		oninput={(e) => setValue(e.currentTarget.value)}
		onkeydown={onKeyDown}
		class={slots.textarea()}
	></textarea>

	<div class={slots.toolbar()}>
		{#if actions.length}
			<DropdownMenu bind:open={actionsOpen}>
				<DropdownMenuTrigger aria-label="Add to prompt" class={ACTIONS_TRIGGER}>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
						<path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					</svg>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="top" align="start" class="w-56">
					{#each actions as action (action.value)}
						<DropdownMenuItem
							disabled={action.disabled}
							onclick={() => {
								onAction?.(action.value);
								actionsOpen = false;
							}}
							class="items-start gap-2.5 py-2"
						>
							{#if action.icon}
								<span class="mt-0.5 grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
									{@render action.icon()}
								</span>
							{/if}
							<span class="min-w-0">
								<span class="block text-foreground text-sm">{action.label}</span>
								{#if action.description}
									<span class="mt-0.5 block text-muted-foreground text-xs leading-4">{action.description}</span>
								{/if}
							</span>
						</DropdownMenuItem>
					{/each}
				</DropdownMenuContent>
			</DropdownMenu>
		{/if}

		{#if leadingAction}
			{@render leadingAction()}
		{/if}

		{#if models.length}
			<Select bind:value={selectValue} items={models} disabled={disabled || loading}>
				<SelectTrigger class="h-8 w-auto max-w-52 gap-1.5 rounded-full border-0 bg-transparent px-2 text-xs hover:bg-accent">
					<span class="flex min-w-0 items-center gap-1.5">
						{#if currentModelOption?.icon}
							<span class="grid size-4 shrink-0 place-items-center text-muted-foreground [&_svg]:size-3.5">
								{@render currentModelOption.icon()}
							</span>
						{/if}
						<span class="truncate text-muted-foreground">{currentModelOption?.label ?? "Choose model"}</span>
					</span>
				</SelectTrigger>
				<SelectContent align="start" class="w-52">
					{#each models as m (m.value)}
						<SelectItem value={m.value} disabled={m.disabled} class="py-2">
							<span class="flex min-w-0 items-center gap-2">
								{#if m.icon}
									<span class="grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
										{@render m.icon()}
									</span>
								{/if}
								<span class="min-w-0 truncate text-foreground text-sm">{m.label}</span>
							</span>
						</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/if}

		<button
			type="button"
			onclick={loading ? onStop : submit}
			disabled={loading ? !onStop : !canSubmit}
			aria-label={loading ? "Stop generating" : "Send message"}
			class="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-[transform,scale,translate] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] active:scale-[var(--press-scale)] disabled:pointer-events-none disabled:opacity-40"
		>
			{#if loading}
				<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="size-2.5">
					<rect x="1" y="1" width="14" height="14" rx="3" />
				</svg>
			{:else}
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path d="M8 13V3.5M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/if}
		</button>
	</div>
</div>
