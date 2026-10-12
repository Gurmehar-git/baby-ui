<script lang="ts">
import { type TaskStep, TaskSteps } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TaskSteps>>(props));
const variant = $derived(p.variant ?? "timeline");

const steps = [
	{ id: "read", label: "Read the component spec", status: "done" as const },
	{ id: "port", label: "Author the Svelte port", status: "done" as const },
	{ id: "check", label: "Run svelte-check", status: "active" as const },
	{ id: "docs", label: "Write the doc page", status: "pending" as const },
];

const ROW_STEPS: TaskStep[] = [
	{
		id: "verify",
		label: "Verified vendor records",
		meta: "12 suppliers",
		status: "done",
		details: [
			{ label: "Matched tax and contact IDs", meta: "12/12" },
			{ label: "Flagged stale records", meta: "0" },
		],
	},
	{
		id: "index",
		label: "Build reorder task list",
		meta: "7 SKUs",
		status: "active",
		step: 2,
		details: [
			{ label: "Reading POS export", meta: "3 files" },
			{ label: "Scoring stockout risk", meta: "68%" },
		],
	},
	{
		id: "draft",
		label: "Draft supplier emails",
		meta: "2 messages",
		status: "pending",
		step: 3,
		details: [
			{ label: "Cone supplier follow-up", meta: "draft" },
			{ label: "Pistachio reorder note", meta: "draft" },
		],
	},
];

let rows = $state(ROW_STEPS);
// Scripted for the demo: the last row fails, then Retry settles it.
$effect(() => {
	void variant;
	rows = ROW_STEPS;
	const id = setTimeout(() => {
		rows = rows.map((r) => (r.id === "draft" ? { ...r, status: "failed" } : r));
	}, 2600);
	return () => clearTimeout(id);
});

function retry(id: string) {
	rows = rows.map((r) => (r.id === id ? { ...r, status: "done" } : r));
}
</script>

{#if variant !== "timeline"}
	<TaskSteps {variant} steps={rows} onRetry={retry} />
{:else}
	<div class="w-full max-w-80">
		<TaskSteps
			{steps}
			showConnector={props.showConnector !== false}
			compact={p.compact ?? false}
			size={p.size ?? "default"}
		/>
	</div>
{/if}
