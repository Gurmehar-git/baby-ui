<script lang="ts">
import { cn } from "../../lib/cn";
import { type DiffLineKind, diffRow } from "../variants";

export type DiffLine = { kind: DiffLineKind; text: string };

let {
	filename,
	lines,
	showLineNumbers = true,
	class: classProp,
}: {
	filename: string;
	lines: DiffLine[];
	showLineNumbers?: boolean;
	class?: string;
} = $props();

const added = $derived(lines.filter((l) => l.kind === "add").length);
const removed = $derived(lines.filter((l) => l.kind === "remove").length);

const MARK = { add: "+", remove: "-", context: " " };
</script>

<div class={cn("overflow-hidden rounded-xl border border-border bg-card", classProp)}>
	<div class="flex items-center justify-between gap-3 border-border border-b bg-background/60 px-4 py-2.5">
		<span class="truncate font-mono text-foreground text-xs">{filename}</span>
		<span class="flex shrink-0 items-center gap-2 font-mono text-xs">
			<span class="text-success-strong">+{added}</span>
			<span class="text-destructive-strong">-{removed}</span>
		</span>
	</div>

	<div class="overflow-x-auto font-mono text-sm leading-relaxed">
		{#each lines as line, i (i)}
			<div class={diffRow({ kind: line.kind })}>
				{#if showLineNumbers}
					<span aria-hidden="true" class="mr-3 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/60">
						{i + 1}
					</span>
				{/if}
				<span aria-hidden="true" class="mr-2 inline-block w-2 shrink-0 select-none">
					{MARK[line.kind]}
				</span>
				<span>
					<span class="sr-only">
						{line.kind === "add" ? "Added: " : line.kind === "remove" ? "Removed: " : ""}
					</span>
					{line.text || " "}
				</span>
			</div>
		{/each}
	</div>
</div>
