<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { type TaskStatus, type TaskStep, taskStepRows } from "../variants";

let {
	steps,
	variant,
	labels,
	onToggle,
	onRetry,
	class: classProp,
}: {
	steps: TaskStep[];
	variant: "capsules" | "list";
	labels: Record<TaskStatus, string>;
	onToggle?: (id: string, open: boolean) => void;
	onRetry?: (id: string) => void;
	class?: string;
} = $props();

let openRows = $state<Record<string, boolean>>({});
const s = $derived(taskStepRows({ variant }));
const ringLength = 2 * Math.PI * 11;

function toggle(id: string) {
	const next = !(openRows[id] ?? false);
	openRows = { ...openRows, [id]: next };
	onToggle?.(id, next);
}
</script>

{#snippet glyph(d: string, width = 3.5)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={width}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="size-3"
	>
		<path {d} />
	</svg>
{/snippet}

<!-- TaskSteps' capsules and list layouts: expandable rows whose status comes from `steps`. -->
<ol aria-live="polite" data-slot="task-steps" class={cn(s.root(), classProp)}>
	{#each steps as step, i (step.id)}
		{@const open = openRows[step.id] ?? false}
		<li class={taskStepRows({ variant, open }).item()} style="animation-delay: {i * 80}ms">
			<div class="flex items-center pr-1">
				<button type="button" aria-expanded={open} onclick={() => toggle(step.id)} class={s.trigger()}>
					<span class={s.badge()}>
						{#if step.status === "done"}
							<span class={taskStepRows({ tone: "success" }).statusDot()}>
								{@render glyph("M20 6L9 17l-5-5")}
							</span>
						{:else if step.status === "failed"}
							<span class={taskStepRows({ tone: "destructive" }).statusDot()}>
								{@render glyph("M18 6L6 18M6 6l12 12")}
							</span>
						{:else}
							<span class="relative inline-flex size-6 shrink-0 items-center justify-center">
								<svg
									viewBox="0 0 24 24"
									aria-hidden="true"
									class={cn("absolute inset-0", step.status === "active" && "spinner")}
								>
									<circle cx={12} cy={12} r={11} fill="none" stroke="var(--border)" stroke-width={2} />
									{#if step.status === "active"}
										<circle
											cx={12}
											cy={12}
											r={11}
											fill="none"
											stroke="var(--muted-foreground)"
											stroke-width={2}
											stroke-linecap="round"
											stroke-dasharray="{ringLength * 0.28} {ringLength * 0.72}"
										/>
									{/if}
								</svg>
								<span class="relative font-semibold text-foreground text-xs tabular-nums">{step.step}</span>
							</span>
						{/if}
					</span>
					<span class={s.label()}>{step.label}</span>
					<span class="sr-only">{labels[step.status]}</span>
					{#if step.meta}<span class={s.meta()}>{step.meta}</span>{/if}
					{#if step.status === "done"}
						<Badge variant="success" size="sm">{labels.done}</Badge>
					{:else if step.status === "failed"}
						<Badge variant="destructive" size="sm">{labels.failed}</Badge>
					{/if}
					<span aria-hidden="true" class={s.chevron()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							style:transform={open ? "rotate(180deg)" : undefined}
							class="size-3.5 transition-transform duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
						>
							<path d="M6 9l6 6 6-6" />
						</svg>
					</span>
				</button>
				{#if step.status === "failed" && onRetry}
					<button type="button" aria-label="Retry {step.label}" onclick={() => onRetry(step.id)} class={s.retry()}>
						{@render glyph("M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6", 3)}
					</button>
				{/if}
			</div>
			<div
				class="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
				style:grid-template-rows={open ? "1fr" : "0fr"}
				style:opacity={open ? 1 : 0}
			>
				<div class="overflow-hidden">
					<div class={s.details()}>
						<span aria-hidden="true" class="mx-auto h-full w-px bg-border"></span>
						<div class="flex flex-col gap-1.5">
							{#each step.details ?? [] as d (d.label)}
								<div class={s.detail()}>
									<span>{d.label}</span>
									<span class="font-mono tabular-nums">{d.meta}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ol>
