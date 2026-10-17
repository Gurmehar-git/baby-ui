<script lang="ts">
import { untrack } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { isApplePlatform, parseShortcut } from "../../lib/shortcut-keys";
import { shortcutCap } from "../../shortcut/variants";
import {
	comboFromEvent,
	comboKey,
	hasModifier,
	heldCaps,
	heldModifiers,
	RESERVED_SHORTCUTS,
	type ShortcutBinding,
} from "../recorder";
import { type ShortcutRecorderSize, shortcutRecorder } from "../variants";

let {
	label,
	value = $bindable(),
	defaultValue = null,
	onValueChange,
	resetValue,
	bindings = [],
	warnReserved = true,
	requireModifier = true,
	placeholder = "Record shortcut",
	disabled = false,
	size = "default",
	class: classProp,
}: {
	/** Accessible name, e.g. "Open search". */
	label: string;
	/** The shortcut as tokens, e.g. `"mod+shift+k"`; null is unset. Bindable. */
	value?: string | null;
	defaultValue?: string | null;
	/** `replaced` is the binding it was taken from after "Use anyway", so you can unbind it. */
	onValueChange?: (value: string | null, details: { replaced?: ShortcutBinding }) => void;
	/** What the reset button restores; defaults to `defaultValue`. */
	resetValue?: string | null;
	/** Shortcuts already in use; recording one asks before taking it. */
	bindings?: ShortcutBinding[];
	/** Also warn about combinations the browser or system keeps, such as Command W. */
	warnReserved?: boolean;
	/** Require Command, Ctrl or Alt, so the shortcut cannot clash with typing. */
	requireModifier?: boolean;
	placeholder?: string;
	disabled?: boolean;
	size?: ShortcutRecorderSize;
	class?: string;
} = $props();

type Pending = { combo: string; reason: string; replaced?: ShortcutBinding };

const uid = $props.id();
const statusId = `${uid}-status`;
let own = $state(untrack(() => defaultValue));
const current = $derived(value !== undefined ? value : own);
const reset = $derived(resetValue === undefined ? defaultValue : resetValue);
let recording = $state(false);
let held = $state<string[]>([]);
let pending = $state<Pending | null>(null);
let message = $state("");
let apple = $state(true);
$effect(() => {
	apple = isApplePlatform();
});

function commit(next: string | null, replaced?: ShortcutBinding) {
	if (value === undefined) own = next;
	else value = next;
	onValueChange?.(next, { replaced });
	pending = null;
	recording = false;
	held = [];
	message = next
		? `Shortcut set to ${parseShortcut(next, apple)?.spoken ?? next}`
		: "Shortcut cleared";
}

function onkeydown(event: KeyboardEvent) {
	if (!recording) return;
	event.preventDefault();
	event.stopPropagation();
	const mods = heldModifiers(event, apple);
	if (event.key === "Escape" && !mods.length) {
		recording = false;
		held = [];
		message = "Recording cancelled";
		return;
	}
	if ((event.key === "Backspace" || event.key === "Delete") && !mods.length) {
		commit(null);
		return;
	}
	const combo = comboFromEvent(event, apple);
	if (!combo) {
		held = mods;
		return;
	}
	if (!parseShortcut(combo, apple)) return;
	if (requireModifier && !hasModifier(combo)) {
		message = "Add Command, Ctrl or Option to the keys.";
		return;
	}
	const taken = bindings.find(
		(binding) => comboKey(binding.shortcut) === comboKey(combo),
	);
	if (taken) {
		recording = false;
		pending = { combo, reason: `Already used by "${taken.label}".`, replaced: taken };
		return;
	}
	if (
		warnReserved &&
		RESERVED_SHORTCUTS.some((reserved) => comboKey(reserved) === comboKey(combo))
	) {
		recording = false;
		pending = { combo, reason: "Your browser or system may keep this shortcut." };
		return;
	}
	commit(combo);
}

const s = $derived(shortcutRecorder({ size }));
const shown = $derived(pending?.combo ?? current);
</script>

{#snippet kbds(list: string[])}
	{#each list as cap, i (`${cap}-${i}`)}
		<kbd aria-hidden="true" class={shortcutCap({ size: "default" })}>{cap}</kbd>
	{/each}
{/snippet}

<div data-slot="shortcut-recorder" class={cn(s.root(), classProp)}>
	<div class={s.row()}>
		<button
			type="button"
			{disabled}
			data-recording={recording}
			aria-label="{label}: {shown ? (parseShortcut(shown, apple)?.spoken ?? shown) : 'not set'}. {recording ? 'Recording, press keys' : 'Press to record'}"
			aria-describedby={statusId}
			class={s.field()}
			onclick={() => {
				pending = null;
				message = recording ? "" : "Recording. Press the keys, Escape to cancel.";
				recording = !recording;
			}}
			{onkeydown}
			onkeyup={(event) => recording && (held = heldModifiers(event, apple))}
			onblur={() => {
				recording = false;
				held = [];
			}}
		>
			{#if recording}
				{#if held.length}{@render kbds(heldCaps(held, apple))}{:else}<span class={s.placeholder()}>Press keys…</span>{/if}
				<span aria-hidden="true" class={s.hint()}>Recording</span>
			{:else if shown}
				{@render kbds(parseShortcut(shown, apple)?.caps ?? shown.split("+"))}
			{:else}
				<span class={s.placeholder()}>{placeholder}</span>
			{/if}
		</button>
		{#if current && !recording}
			<Button type="button" variant="ghost" size="sm" {disabled} onclick={() => commit(null)}>Clear</Button>
		{/if}
		{#if reset && reset !== current && !recording}
			<Button type="button" variant="ghost" size="sm" {disabled} onclick={() => commit(reset)}>Reset</Button>
		{/if}
	</div>
	{#if pending}
		{@const take = pending}
		<div role="alert" class={s.warning()}>
			{take.reason}
			<button type="button" class={s.action()} onclick={() => commit(take.combo, take.replaced)}>Use anyway</button>
			<button type="button" class={s.action()} onclick={() => (pending = null)}>Cancel</button>
		</div>
	{/if}
	<span id={statusId} class="sr-only" role="status">{message}</span>
</div>
