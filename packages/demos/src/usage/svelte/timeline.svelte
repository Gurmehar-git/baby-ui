<script lang="ts">
import { Timeline } from "@baby-ui/svelte";

const now = Date.parse("2026-10-12T15:00:00Z");
const events = [
	{
		id: "1",
		at: "2026-10-12T14:52:00Z",
		actor: "Ada Park",
		title: "merged Checkout redesign",
		meta: "#482",
	},
	{
		id: "2",
		at: "2026-10-12T13:10:00Z",
		title: "Production deploy succeeded",
		tone: "success" as const,
	},
];
</script>

<Timeline label="Project activity" {events} {now} />
