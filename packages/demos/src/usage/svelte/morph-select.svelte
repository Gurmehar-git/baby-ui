<script lang="ts">
import { MorphSelect } from "@baby-ui/svelte";

const STATUSES = [
	{ value: "backlog", label: "Backlog" },
	{ value: "in-progress", label: "In progress" },
	{ value: "done", label: "Done" },
];

let status = $state<string | null>("backlog");
</script>

<MorphSelect label="Status" items={STATUSES} bind:value={status} />
