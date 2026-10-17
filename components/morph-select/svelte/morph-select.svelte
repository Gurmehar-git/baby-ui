<script lang="ts">
import { Select as SelectPrimitive } from "bits-ui";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { glideHighlight } from "../../lib/glide";
import { trackActiveWidth } from "../../lib/morph";
import { flatOptions, type MorphSelectItem, sections } from "../options";
import { type MorphSelectSize, type MorphSelectVariant, morphSelect } from "../variants";

let {
	label,
	hideLabel = false,
	items,
	value = $bindable(),
	defaultValue = null,
	onValueChange,
	placeholder = "Select",
	panelWidth = 272,
	maxListHeight = 296,
	variant = "default",
	size = "default",
	name,
	disabled = false,
	class: classProp,
}: {
	/** Visible label, also the accessible name of the trigger and the list. */
	label: string;
	/** Keeps the label for assistive tech only. */
	hideLabel?: boolean;
	items: MorphSelectItem[];
	/** Bindable. Leave unset to let the select own it. */
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	/** Width of the open surface in px; never narrower than the trigger. */
	panelWidth?: number;
	/** Tallest the list gets before it scrolls, in px. */
	maxListHeight?: number;
	variant?: MorphSelectVariant;
	size?: MorphSelectSize;
	/** Adds a hidden input for native form submission. */
	name?: string;
	disabled?: boolean;
	class?: string;
} = $props();

const labelId = $props.id();
let inner = $state(untrack(() => defaultValue));
const selected = $derived(value !== undefined ? value : inner);
let open = $state(false);
let trigger = $state<HTMLElement | null>(null);
let triggerHeight = $state(0);
const all = $derived(flatOptions(items));
const groups = $derived(sections(items));
const current = $derived(all.find((option) => option.value === selected));
const s = $derived(morphSelect({ size, variant }));

function pick(next: string) {
	if (!next) return;
	if (value === undefined) inner = next;
	else value = next;
	onValueChange?.(next);
}

$effect(() => {
	if (!trigger) return;
	const el = trigger;
	const resize = new ResizeObserver(() => (triggerHeight = el.offsetHeight));
	resize.observe(el);
	return () => resize.disconnect();
});

function widthOf(frame: HTMLElement) {
	return trackActiveWidth(frame);
}
function glide(list: HTMLElement) {
	const pill = list.querySelector<HTMLElement>("[data-ms-pill]");
	if (pill) return glideHighlight(list, pill);
}
</script>

{#snippet shown()}
	{#if current}{current.label}{:else}<span class={s.placeholder()}>{placeholder}</span>{/if}
{/snippet}

{#snippet chevron(turned: boolean)}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={cn(s.chevron(), turned && "rotate-180")}>
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

<div
	data-slot="morph-select"
	class={cn(s.root(), classProp)}
>
	<span id={labelId} class={hideLabel ? "sr-only" : s.label()}>{label}</span>
	<SelectPrimitive.Root
		type="single"
		value={selected ?? ""}
		onValueChange={pick}
		bind:open
		items={all}
		{name}
		{disabled}
	>
		<SelectPrimitive.Trigger bind:ref={trigger} aria-labelledby={labelId} class={s.trigger()}>
			<span {@attach widthOf} class={s.frame()}>
				{#key selected}
					<span data-on="true" class={s.value()}>{@render shown()}</span>
				{/key}
			</span>
			{@render chevron(false)}
		</SelectPrimitive.Trigger>
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				side="bottom"
				align="start"
				sideOffset={-triggerHeight}
				avoidCollisions={false}
				class={s.popup()}
				style="--ms-panel: {panelWidth}px; --ms-list: {maxListHeight}px"
			>
				<!-- The lid repeats the trigger, so the surface reads as the trigger growing. -->
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div aria-hidden="true" class={s.lid()} onclick={() => (open = false)}>
					<span class="truncate">{@render shown()}</span>
					{@render chevron(true)}
				</div>
				<SelectPrimitive.Viewport class={s.list()} {@attach glide}>
					<span data-ms-pill="" aria-hidden="true" class={s.pill()}></span>
					{#each groups as section (section.key)}
						{#snippet rows()}
							{#each section.options as option (option.value)}
								<SelectPrimitive.Item
									value={option.value}
									label={option.label}
									disabled={option.disabled}
									class={s.item()}
								>
									{option.label}
									{#if option.meta}<span class={s.meta()}>{option.meta}</span>{/if}
									<svg
										viewBox="0 0 14 14"
										fill="none"
										aria-hidden="true"
										data-on={option.value === selected}
										class={cn(s.check(), !option.meta && "ml-auto")}
									>
										<path
											d="M3 7.4 5.6 10 11 4.2"
											pathLength="1"
											stroke="currentColor"
											stroke-width="1.6"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</SelectPrimitive.Item>
							{/each}
						{/snippet}
						{#if section.label}
							<SelectPrimitive.Group>
								<SelectPrimitive.GroupHeading class={s.groupLabel()}>{section.label}</SelectPrimitive.GroupHeading>
								{@render rows()}
							</SelectPrimitive.Group>
						{:else}
							<div role="presentation">{@render rows()}</div>
						{/if}
					{/each}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	</SelectPrimitive.Root>
</div>
