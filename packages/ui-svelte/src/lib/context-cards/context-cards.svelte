<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import type { ContextChunk } from "./types";
import { contextChunkBadge } from "./variants";

let {
	class: classProp,
	chunks,
	header = "All chunks",
	count = chunks.length,
	...rest
}: {
	chunks: ContextChunk[];
	header?: string;
	count?: string | number;
} & HTMLAttributes<HTMLDivElement> = $props();

let chipsShown = $state(false);

$effect(() => {
	const id = setTimeout(() => {
		chipsShown = true;
	}, 700);
	return () => clearTimeout(id);
});
</script>

<div
	data-slot="context-cards"
	class={cn("flex w-full max-w-sm flex-col gap-2", classProp)}
	{...rest}
>
	<div class="fade-in flex items-center gap-2 px-0.5">
		<span class="text-sm font-semibold text-foreground">{header}</span>
		<span
			class="inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-xs font-medium text-muted-foreground shadow-xs tabular-nums"
		>
			{count}
		</span>
	</div>

	{#each chunks as chunk, i (chunk.title)}
		<div
			data-slot="context-card"
			class="card-fade-up overflow-hidden rounded-2xl bg-card shadow-sm"
			style={`animation-delay: calc(var(--stagger-step) * ${i})`}
		>
			<div class="flex items-center gap-2.5 border-border border-b px-3 py-2">
				<span class="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M4 6h16M4 12h16M4 18h10" />
					</svg>
					<span class="truncate">{chunk.title}</span>
				</span>
				<span class="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
					{chunk.chars}
				</span>
			</div>
			<p class="px-3 pt-2 pb-1 text-xs text-muted-foreground leading-relaxed">
				{chunk.body}
			</p>
			<div class="px-3 pb-3">
				<span
					class="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-xs text-muted-foreground transition-[opacity,transform,background-color] duration-(--duration-slow) ease-[var(--ease-ui-out)] hover:bg-accent"
					style={`opacity: ${chipsShown ? 1 : 0}; transform: scale(${chipsShown ? 1 : 0.95}); transition-delay: ${i * 80}ms`}
				>
					<span class={contextChunkBadge({ tone: chunk.tone })}>
						{chunk.badge}
					</span>
					{chunk.source}
					<svg
						width="9"
						height="9"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M7 17L17 7M7 7h10v10" />
					</svg>
				</span>
			</div>
		</div>
	{/each}
</div>
