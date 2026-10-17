<script lang="ts">
import { cn } from "../../lib/cn";
import { TOOL_LABELS, type ToolLabels, type ToolState, tool } from "../variants";

let {
	name,
	status = "running",
	input,
	output,
	defaultOpen = false,
	open = $bindable(defaultOpen),
	onOpenChange,
	labels,
	class: classProp,
}: {
	name: string;
	status?: ToolState;
	input?: string;
	output?: string;
	defaultOpen?: boolean;
	/** Whether the input/output panel is expanded; bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Overrides for the status and section labels. */
	labels?: Partial<ToolLabels>;
	class?: string;
} = $props();

const id = $props.id();
const text = $derived({ ...TOOL_LABELS, ...labels });
const styles = $derived(tool({ status, open }));

function toggle() {
	open = !open;
	onOpenChange?.(open);
}
</script>

<div data-slot="tool" data-status={status} class={cn(styles.root(), classProp)}>
	<button
		type="button"
		aria-expanded={open}
		aria-controls={id}
		onclick={toggle}
		class={styles.trigger()}
	>
		<span aria-hidden="true" class={styles.icon()}>
			{#if status === "running"}
				<svg viewBox="0 0 12 12" fill="none" class="spinner size-3">
					<circle cx="6" cy="6" r="4.4" stroke="currentColor" stroke-width="1.5" opacity="0.25" />
					<path d="M10.4 6A4.4 4.4 0 0 0 6 1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			{:else if status === "done"}
				<svg viewBox="0 0 12 12" fill="none" class="size-3">
					<path d="M2.5 6.2 4.8 8.5 9.5 3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{:else if status === "error"}
				<svg viewBox="0 0 12 12" fill="none" class="size-3">
					<path d="M3.5 3.5 8.5 8.5M8.5 3.5 3.5 8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
				</svg>
			{:else}
				<span class="size-1.5 rounded-full bg-current"></span>
			{/if}
		</span>

		<span class={styles.name()}>{name}</span>
		<span class={styles.label()}>{text[status]}</span>
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={styles.chevron()}>
			<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</button>

	<div {id} inert={!open} class={styles.panel()}>
		<div class="overflow-hidden">
			<div class={styles.body()}>
				{#if input}
					<div>
						<p class={styles.heading()}>{text.input}</p>
						<pre class={cn(styles.code(), "text-muted-foreground")}><code>{input}</code></pre>
					</div>
				{/if}
				{#if output}
					<div>
						<p class={styles.heading()}>{text.output}</p>
						<pre class={cn(styles.code(), "text-foreground")}><code>{output}</code></pre>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
