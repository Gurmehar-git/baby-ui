<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../lib/cn";
import {
	clampStep,
	moveStepFocus,
	ringDelay,
	STATUS_TEXT,
	type StepperStep,
	stepDelay,
	stepStatus,
} from "./steps";
import { type StepperOrientation, stepper } from "./variants";

let {
	steps,
	current,
	orientation = "horizontal",
	onStepSelect,
	details = "all",
	compact = false,
	label = "Progress",
	completeLabel = "All steps complete",
	class: classProp,
}: {
	steps: StepperStep[];
	/** Index of the step in progress; `steps.length` marks the whole flow complete. */
	current: number;
	orientation?: StepperOrientation;
	/** Called with a completed step's index when it is chosen; without it the stepper is read-only. */
	onStepSelect?: (index: number) => void;
	/** `current` shows only the active step's description; errors always show. */
	details?: "all" | "current";
	/** Markers only, with the current label underneath; horizontal steppers do this below 30rem on their own. */
	compact?: boolean;
	/** Accessible name. */
	label?: string;
	/** Announced and captioned once every step is complete. */
	completeLabel?: string;
	class?: string;
} = $props();

const count = $derived(steps.length);
const active = $derived(clampStep(current, count));
let from = $state(untrack(() => clampStep(current, steps.length)));
let to = untrack(() => clampStep(current, steps.length));
$effect.pre(() => {
	const next = active;
	if (next === to) return;
	from = to;
	to = next;
});
let ready = $state(false);
$effect(() => {
	ready = true;
});
const interactive = $derived(Boolean(onStepSelect));
const vertical = $derived(orientation === "vertical");
const now = $derived(active >= count ? undefined : steps[active]);
const s = $derived(stepper({ orientation }));
const cols = $derived(count > 1 ? `repeat(${count - 1}, minmax(0, 1fr)) auto` : "auto");
</script>

{#snippet content(step: StepperStep, index: number)}
	{@const status = stepStatus(step, index, active)}
	{@const detail = step.error ?? (details === "all" || index === active ? step.description : undefined)}
	<span aria-hidden="true" class={s.marker()}>
		<span class={s.ring()}></span>
		<span class={s.disc()}>
			<span class={s.number()}>{index + 1}</span>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class={s.check()}><path pathLength="1" d="M5.5 12.5l4.25 4.25L18.5 8" class={s.draw()} /></svg
			>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				class={s.alert()}
				><path pathLength="1" d="M12 6.75v6.5" class={s.draw()} /><circle
					cx="12"
					cy="17.4"
					r="1.4"
					fill="currentColor"
					stroke="none"
				/></svg
			>
		</span>
	</span>
	<span class={s.text()}>
		<span class={s.label()}>{step.label}</span>
		{#if STATUS_TEXT[status]}<span class="sr-only">, {STATUS_TEXT[status]}</span>{/if}
		{#if detail}
			{#key detail}<span class={step.error ? s.error() : s.description()}>{detail}</span>{/key}
		{/if}
	</span>
{/snippet}

<svelte:element
	this={interactive ? "nav" : "div"}
	aria-label={label}
	role={interactive ? undefined : "group"}
	data-slot="stepper"
	data-compact={compact || undefined}
	data-ready={ready || undefined}
	class={cn(s.root(), classProp)}
	style:--st-cols={cols}
	style:--st-ring="{ringDelay(from, active)}s"
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ol
		class={s.list()}
		onkeydown={interactive ? (event) => moveStepFocus(event.currentTarget, event, vertical) : undefined}
	>
		{#each steps as step, index (step.id)}
			{@const clickable = interactive && index < active}
			<li
				data-status={stepStatus(step, index, active)}
				data-current={index === active || undefined}
				data-filled={index < active || undefined}
				class={s.item()}
				style:--st-delay="{stepDelay(index, from, active)}s"
			>
				{#if index < count - 1}
					<span aria-hidden="true" class={s.connector()}><span class={s.fill()}></span></span>
				{/if}
				{#if interactive}
					<button
						type="button"
						class={s.head()}
						data-clickable={clickable || undefined}
						data-reachable={index <= active || undefined}
						aria-current={index === active ? "step" : undefined}
						aria-disabled={clickable ? undefined : true}
						tabindex={clickable ? undefined : -1}
						onclick={clickable ? () => onStepSelect?.(index) : undefined}>{@render content(step, index)}</button
					>
				{:else}
					<span class={s.head()} aria-current={index === active ? "step" : undefined}
						>{@render content(step, index)}</span
					>
				{/if}
			</li>
		{/each}
	</ol>
	{#if !vertical}
		<span aria-hidden="true" class={s.caption()}>
			{#key now?.label ?? completeLabel}<span class={s.captionLabel()}>{now?.label ?? completeLabel}</span>{/key}
			{#if now?.error ?? now?.description}
				{#key now?.error ?? now?.description}
					<span class={now?.error ? s.error() : s.description()}>{now?.error ?? now?.description}</span>
				{/key}
			{/if}
		</span>
	{/if}
	<span class="sr-only" aria-live="polite">{now ? `Step ${active + 1} of ${count}: ${now.label}` : completeLabel}</span>
</svelte:element>
