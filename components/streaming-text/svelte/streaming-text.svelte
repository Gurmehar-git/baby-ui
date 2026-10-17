<script lang="ts">
import { cn } from "../../lib/cn";
import Markdown from "../../markdown/svelte/markdown.svelte";
import {
	type StreamingTextLayout,
	type StreamingTextSize,
	streamingText,
} from "../variants";
import type { StreamingSource, StreamingToken } from "./types";

const WORD_DELAY = 55;

let {
	layout = "inline",
	size = "default",
	content: contentProp,
	markdown = false,
	streaming,
	caret = true,
	actions = true,
	sources = [],
	followUps = [],
	sourcesLabel,
	followUpsLabel = "Follow-ups",
	wordDelay = WORD_DELAY,
	onDone,
	onFollowUp,
	onRetry,
	onFeedback,
	class: classProp,
}: {
	layout?: StreamingTextLayout;
	size?: StreamingTextSize;
	/** Tokens with optional citations, or plain text revealed word by word. */
	content: StreamingToken[] | string;
	/** Render `content` as Markdown; the reveal follows `streaming` instead of the word timer. */
	markdown?: boolean;
	/** Markdown mode: `true` while chunks arrive, `false` once done. Unset renders it static. */
	streaming?: boolean;
	/** Blinking caret while the text reveals. */
	caret?: boolean;
	/** Copy, retry and feedback row once done. */
	actions?: boolean;
	sources?: StreamingSource[];
	followUps?: string[];
	sourcesLabel?: string;
	followUpsLabel?: string;
	wordDelay?: number;
	onDone?: () => void;
	onFollowUp?: (text: string, index: number) => void;
	onRetry?: () => void;
	onFeedback?: (positive: boolean) => void;
	class?: string;
} = $props();

const content: StreamingToken[] = $derived(
	typeof contentProp === "string"
		? contentProp
				.split(/\s+/)
				.filter(Boolean)
				.map((word) => ({ text: word }))
		: contentProp,
);
const source = $derived(
	typeof contentProp === "string"
		? contentProp
		: contentProp.map((token) => token.text).join(" "),
);
let count = $state(0);
let sourcesOpen = $state(false);
let copied = $state(false);
const done = $derived(markdown ? !streaming : count >= content.length);
const slots = $derived(streamingText({ layout, size }));

$effect(() => {
	if (markdown || count >= content.length) return;
	const t = setTimeout(() => {
		count = Math.min(content.length, count + 1);
	}, wordDelay);
	return () => clearTimeout(t);
});

let settled = false;
$effect(() => {
	if (!done || settled) return;
	settled = true;
	onDone?.();
});

async function copyText() {
	try {
		await navigator.clipboard.writeText(source);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1500);
	} catch {
		// Clipboard access can be denied outside a secure context; nothing to fall back to here.
	}
}
</script>

<div data-slot="streaming-text" class={cn(slots.root(), classProp)}>
	{#if markdown}
		<Markdown content={source} {streaming} {size} {caret} />
	{:else}
	<p aria-busy={!done || undefined} class={slots.text()}>
		{#each content.slice(0, count) as token, i (i)}
			{#if token.cite !== undefined}
				{@const source = sources[token.cite]}
				{#if source}
					<a
						href={source.href}
						target="_blank"
						rel="noreferrer"
						class="pop-in mr-1 inline-flex h-4.5 translate-y-[-1px] items-center gap-1 rounded-[5px] bg-muted px-[3px] align-middle font-mono text-xs text-muted-foreground shadow-xs transition-colors duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground"
					>
						<img src={source.image} alt="" class="size-3 rounded-[3px]" />
						<span>{source.domain}</span>
					</a>
				{/if}
			{:else}
				<span>{token.text + " "}</span>
			{/if}
		{/each}
		{#if caret && !done}
			<span aria-hidden="true" class="stream-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current"></span>
		{/if}
	</p>
	{/if}

	<div
		class="mt-2 flex items-center gap-0.5 transition-opacity duration-400"
		style="opacity: {done ? 1 : 0}; pointer-events: {done ? 'auto' : 'none'}"
	>
		{#if actions}
		<button
			type="button"
			onclick={copyText}
			aria-label={copied ? "Copied" : "Copy"}
			class="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground"
		>
			{#if copied}
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path d="M3.5 8.4 6.4 11 12.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{:else}
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" stroke-width="1.3" />
					<path d="M10.5 2.5H3.6A1.6 1.6 0 0 0 2 4.1V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
				</svg>
			{/if}
		</button>
		{#if onRetry}
			<button
				type="button"
				onclick={onRetry}
				aria-label="Retry"
				class="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground"
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path d="M13 8a5 5 0 1 1-1.6-3.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
					<path d="M13 2.5V5h-2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		{/if}
		{#if onFeedback}
			<button
				type="button"
				onclick={() => onFeedback?.(true)}
				aria-label="Good response"
				class="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground"
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path d="M6 14V6.5l3-4.5 1 .8-1 3.2h4.3a1 1 0 0 1 1 1.2l-1 5a1 1 0 0 1-1 .8H6Zm0 0H3.5A1.5 1.5 0 0 1 2 12.5v-4A1.5 1.5 0 0 1 3.5 7H6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
			<button
				type="button"
				onclick={() => onFeedback?.(false)}
				aria-label="Bad response"
				class="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground"
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5 rotate-180">
					<path d="M6 14V6.5l3-4.5 1 .8-1 3.2h4.3a1 1 0 0 1 1 1.2l-1 5a1 1 0 0 1-1 .8H6Zm0 0H3.5A1.5 1.5 0 0 1 2 12.5v-4A1.5 1.5 0 0 1 3.5 7H6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		{/if}
		{/if}
		{#if sources.length}
			<button
				type="button"
				aria-expanded={sourcesOpen}
				onclick={() => (sourcesOpen = !sourcesOpen)}
				class="ml-1.5 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors duration-(--duration-fast) hover:bg-accent"
			>
				<span class="flex -space-x-1">
					{#each sources as source (source.domain)}
						<img src={source.image} alt="" class="size-3.5 rounded-full bg-card shadow-[0_0_0_1.5px_var(--background)]" />
					{/each}
				</span>
				<span class="text-xs text-muted-foreground">
					{sourcesLabel ?? `${sources.length} source${sources.length === 1 ? "" : "s"}`}
				</span>
			</button>
		{/if}
	</div>

	{#if sources.length}
		<div
			class="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
			style="grid-template-rows: {done && sourcesOpen ? '1fr' : '0fr'}; opacity: {done && sourcesOpen ? 1 : 0}"
		>
			<div class="overflow-hidden">
				<div class="mt-1.5 flex flex-col rounded-[10px] bg-muted p-1 shadow-xs">
					{#each sources as source (source.domain)}
						<a
							href={source.href}
							target="_blank"
							rel="noreferrer"
							class="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground"
						>
							<img src={source.image} alt="" class="size-4 rounded-[4px]" />
							<span>{source.name}</span>
							<span class="ml-auto font-mono text-xs text-muted-foreground/70">{source.domain}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	{#if followUps.length}
		<div class="mt-2.5 transition-opacity duration-400" style="opacity: {done ? 1 : 0}; pointer-events: {done ? 'auto' : 'none'}">
			<p class="font-medium text-xs text-muted-foreground">{followUpsLabel}</p>
			<div class="mt-0.5 flex flex-col">
				{#each followUps as label, i (label)}
					<button
						type="button"
						onclick={() => onFollowUp?.(label, i)}
						class="-mx-1.5 flex items-center gap-2 rounded-md border-border border-b px-1.5 py-1.5 text-left text-xs text-foreground transition-colors duration-(--duration-instant) last:border-0 hover:bg-accent"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3 shrink-0 text-muted-foreground">
							<path d="M9 10l-5 5 5 5" />
							<path d="M20 4v7a4 4 0 0 1-4 4H4" />
						</svg>
						{label}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
