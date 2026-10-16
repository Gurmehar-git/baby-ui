<script lang="ts">
import { tick, untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import Spinner from "../../spinner/svelte/spinner.svelte";
import { caretAt, cleanDraft, type InlineEditPhase, runSave } from "./edit";
import { type InlineEditSize, type InlineEditVariant, inlineEdit } from "./variants";

let {
	value,
	onSave,
	label,
	validate,
	placeholder = "",
	multiline = false,
	variant = "title",
	size = "default",
	as = "span",
	class: classProp,
}: {
	/** The saved value; a new one from outside replaces the text while it is not being edited. */
	value: string;
	/** Persists the new value. Return a promise to show saving; reject it to roll back. */
	onSave: (next: string) => unknown;
	/** Accessible name, e.g. "Project name". */
	label: string;
	/** Returns a message when the draft cannot be saved. */
	validate?: (next: string) => string | null | undefined;
	placeholder?: string;
	/** Wraps and grows in height. Enter saves; Shift+Enter adds a line break. */
	multiline?: boolean;
	/** `title` for names and headings, `body` for descriptions. */
	variant?: InlineEditVariant;
	size?: InlineEditSize;
	/** The element that holds the text, so a title can stay a heading. */
	as?: "span" | "p" | "h1" | "h2" | "h3";
	class?: string;
} = $props();

const uid = $props.id();
const messageId = `${uid}-message`;
let shown = $state(untrack(() => value));
let committed = $state(untrack(() => value));
let editing = $state(false);
let draft = $state("");
let phase = $state<InlineEditPhase>("idle");
let error = $state<string | null>(null);
let failed = $state<string | null>(null);
let textEl = $state<HTMLSpanElement>();
let displayEl = $state<HTMLButtonElement>();
let control = $state<HTMLInputElement | HTMLTextAreaElement>();
let run = 0;
let timer = 0;

// A new outside value replaces the text unless someone is typing or a save is in flight.
$effect(() => {
	const next = value;
	untrack(() => {
		committed = next;
		if (!editing && phase !== "saving") shown = next;
	});
});
$effect(() => () => clearTimeout(timer));

async function start(at: number | "all", text = shown) {
	if (editing || phase === "saving") return;
	draft = text;
	error = null;
	failed = null;
	phase = "idle";
	editing = true;
	await tick();
	control?.focus({ preventScroll: true });
	if (at === "all") control?.select();
	else control?.setSelectionRange(at, at);
}
async function save(next: string) {
	const previous = committed;
	const token = ++run;
	shown = next;
	phase = "saving";
	const ok = await runSave(onSave, next);
	if (token !== run) return;
	if (ok) {
		committed = next;
		phase = "saved";
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			if (phase === "saved") phase = "idle";
		}, 1800);
		return;
	}
	shown = previous;
	failed = next;
	phase = "failed";
}
async function submit(source: "key" | "blur") {
	if (!editing) return;
	const next = cleanDraft(draft, multiline);
	const problem = validate?.(next) || null;
	if (problem) {
		error = problem;
		if (source === "key") control?.focus();
		return;
	}
	editing = false;
	error = null;
	if (next !== shown) void save(next);
	if (source === "key") {
		await tick();
		displayEl?.focus({ preventScroll: true });
	}
}
async function cancel() {
	editing = false;
	error = null;
	await tick();
	displayEl?.focus({ preventScroll: true });
}
function onkeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		event.preventDefault();
		cancel();
	} else if (event.key === "Enter" && !(multiline && event.shiftKey)) {
		event.preventDefault();
		submit("key");
	}
}

const s = $derived(inlineEdit({ variant, size }));
const message = $derived(
	error
		? { tone: "error", text: error }
		: phase === "failed"
			? { tone: "failed", text: "Couldn't save." }
			: null,
);
</script>

<span data-slot="inline-edit" class={cn(s.root(), classProp)}>
	<span class={s.row()}>
		{#if editing}
			<span class={s.field()}>
				<span aria-hidden="true" class={s.sizer()}>{`${draft || placeholder} `}</span>
				{#if multiline}
					<textarea
						bind:this={control}
						bind:value={draft}
						rows="1"
						aria-label={label}
						aria-invalid={!!error || undefined}
						aria-describedby={message ? messageId : undefined}
						{placeholder}
						class={s.control()}
						oninput={() => (error = null)}
						onblur={() => submit("blur")}
						{onkeydown}
					></textarea>
				{:else}
					<input
						bind:this={control}
						bind:value={draft}
						aria-label={label}
						aria-invalid={!!error || undefined}
						aria-describedby={message ? messageId : undefined}
						{placeholder}
						class={s.control()}
						oninput={() => (error = null)}
						onblur={() => submit("blur")}
						{onkeydown}
					/>
				{/if}
			</span>
		{:else}
			<svelte:element this={as} class="m-0 min-w-0 font-[inherit] text-[length:inherit]">
				<button
					bind:this={displayEl}
					type="button"
					data-phase={phase}
					aria-label="{label}: {shown || placeholder}. Edit"
					class={s.display()}
					onclick={(event) => {
						if (phase === "saving") return;
						// A keyboard press selects all, ready to retype; a click puts the caret where it landed.
						start(event.detail === 0 ? "all" : caretAt(textEl?.firstChild, event.clientX, event.clientY, shown.length));
					}}
				>
					{#key shown}
						<span bind:this={textEl} class={cn(s.text(), !shown && s.placeholder())}>{shown || placeholder}</span>
					{/key}
				</button>
			</svelte:element>
		{/if}
		<span aria-hidden="true" class={s.status()}>
			{#if phase === "saving"}<Spinner size="sm" label="Saving" />{/if}
			<svg viewBox="0 0 14 14" fill="none" data-on={phase === "saved"} class={s.tick()}>
				<path d="M3 7.4 5.6 10 11 4.2" pathLength="1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</span>
	</span>
	{#if message}
		<span id={messageId} role={message.tone === "error" ? "alert" : "status"} data-tone={message.tone} class={s.message()}>
			{message.text}
			{#if failed !== null && message.tone === "failed"}
				{@const retryText = failed}
				<button type="button" class={s.retry()} onclick={() => start(retryText.length, retryText)}>Edit again</button>
			{/if}
		</span>
	{/if}
	<span class="sr-only" role="status">
		{phase === "saving" ? `Saving ${label.toLowerCase()}` : phase === "saved" ? `${label} saved` : ""}
	</span>
</span>
