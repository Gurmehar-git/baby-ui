<script lang="ts">
import { onDestroy } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { button } from "../../button/variants";
import Card from "../../card/svelte/card.svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuLabel from "../../dropdown-menu/svelte/dropdown-menu-label.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/cn";
import Textarea from "../../textarea/svelte/textarea.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	CHAT_COMPOSER_LABELS,
	type ChatComposerLabels,
	type ChatMessage,
	type ChatStatus,
	type ChatTopic,
	promptHistory,
	resolvingIndex,
} from "../types";
import {
	type ChatComposerSize,
	type ChatComposerVariant,
	chatComposer,
} from "../variants";

let {
	messages,
	topics = [],
	topic = $bindable(),
	onTopicChange,
	value = $bindable(""),
	onValueChange,
	onSend,
	onNew,
	status = "idle",
	variant,
	size,
	labels: labelsProp,
	class: className,
}: {
	/** Every message in the active thread, oldest first. Required: no sample data of its own. */
	messages: ChatMessage[];
	/** Switchable threads; the header toggles are these. Hidden when empty. */
	topics?: ChatTopic[];
	/** Active topic key; bindable. The first topic when omitted. */
	topic?: string;
	onTopicChange?: (key: string) => void;
	/** Draft text; bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	/** Fired with the trimmed prompt and the active topic key; the caller appends messages. */
	onSend?: (text: string, topic: string | undefined) => void;
	/** Shows the "new conversation" action when provided. */
	onNew?: () => void;
	status?: ChatStatus;
	variant?: ChatComposerVariant;
	size?: ChatComposerSize;
	labels?: Partial<ChatComposerLabels>;
	class?: string;
} = $props();

const ICON_TRIGGER = button({ variant: "ghost", size: "icon-sm" });

const labels = $derived({ ...CHAT_COMPOSER_LABELS, ...labelsProp });
const activeTopic = $derived(topic ?? topics[0]?.key);
const s = $derived(chatComposer({ variant, size }));
const history = $derived(promptHistory(messages));
const resolving = $derived(resolvingIndex(messages, status));
const canSend = $derived(value.trim().length > 0 && status !== "streaming");

let thread = $state<HTMLDivElement>();
let copyStatus = $state("");
let copyTimer: ReturnType<typeof setTimeout> | undefined;
onDestroy(() => clearTimeout(copyTimer));

$effect(() => {
	void messages.length;
	if (thread && messages.length) thread.scrollTo({ top: thread.scrollHeight });
});

function setDraft(next: string) {
	value = next;
	onValueChange?.(next);
}

function setTopic(next: string) {
	if (!next) return;
	topic = next;
	onTopicChange?.(next);
}

function send(text: string) {
	const trimmed = text.trim();
	if (!trimmed || status === "streaming") return;
	onSend?.(trimmed, activeTopic);
	setDraft("");
}

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "Enter" && !event.shiftKey) {
		event.preventDefault();
		send(value);
	}
}

async function copyConversation() {
	try {
		await navigator.clipboard.writeText(messages.map((m) => m.body).join("\n"));
		copyStatus = labels.copied;
	} catch {
		copyStatus = labels.copyFailed;
	}
	clearTimeout(copyTimer);
	copyTimer = setTimeout(() => (copyStatus = ""), 1500);
}
</script>

{#snippet glyph(d: string, fill = false)}
	<svg viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path {d} />
	</svg>
{/snippet}

<div data-slot="chat-composer" class={cn(s.frame(), className)}>
	<Card class={s.root()}>
		<div class={s.header()}>
			{#if topics.length > 0}
				<ToggleGroup
					type="single"
					size="sm"
					label={labels.topics}
					bind:value={() => activeTopic ?? "", (v) => setTopic(v as string)}
				>
					{#each topics as t (t.key)}
						<ToggleGroupItem value={t.key}>{t.label}</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			{:else}
				<span></span>
			{/if}
			<div class={s.actions()}>
				{#if onNew}
					<Button variant="ghost" size="icon-sm" aria-label={labels.newConversation} onclick={onNew}>
						{@render glyph("M12 5v14M5 12h14")}
					</Button>
				{/if}
				<DropdownMenu>
					<DropdownMenuTrigger aria-label={labels.history} class={ICON_TRIGGER}>
						{@render glyph("M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z")}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>{labels.recentPrompts}</DropdownMenuLabel>
						{#if history.length === 0}
							<div class="px-2.5 py-1.5 text-muted-foreground text-xs">{labels.noHistory}</div>
						{:else}
							{#each history as entry (entry)}
								<DropdownMenuItem onclick={() => send(entry)}>
									<span class="min-w-0 flex-1 truncate">{entry}</span>
								</DropdownMenuItem>
							{/each}
						{/if}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger aria-label={labels.more} class={ICON_TRIGGER}>
						{@render glyph(
							"M5 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM12 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM19 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z",
							true,
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onclick={copyConversation}>{copyStatus || labels.copy}</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>

		<div
			bind:this={thread}
			role="log"
			aria-live="polite"
			aria-relevant="additions"
			class={s.thread()}
		>
			{#each messages as m, i (m.id)}
				{#if m.role === "user"}
					<p class={s.user()}>{m.body}</p>
				{:else}
					<div class={chatComposer({ size, resolving: i === resolving }).assistant()}>
						{#if m.author || m.meta}
							<div class={s.byline()}>
								{#if m.author}<span class={s.author()}>{m.author}</span>{/if}
								{#if m.meta}<span class={s.meta()}>{m.meta}</span>{/if}
							</div>
						{/if}
						<p class={s.body()}>{m.body}</p>
					</div>
				{/if}
			{/each}
		</div>

		<div class={s.composer()}>
			<Textarea
				rows={1}
				autoGrow
				maxRows={4}
				size="sm"
				bind:value={() => value, setDraft}
				onkeydown={onKeyDown}
				placeholder={labels.placeholder}
				aria-label={labels.prompt}
				class="min-h-8 flex-1"
			/>
			<Button size="icon-sm" aria-label={labels.send} disabled={!canSend} onclick={() => send(value)}>
				{@render glyph("M12 19V5M5 12l7-7 7 7")}
			</Button>
		</div>
	</Card>
	<span role="status" class="sr-only">{copyStatus}</span>
</div>
