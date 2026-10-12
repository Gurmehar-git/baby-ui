<script lang="ts">
import { AnnouncementBar } from "@baby-ui/svelte";

const messages = [
	{
		id: "launch",
		message: "Version 2.0 is out.",
		action: { label: "See what's new", href: "/changelog" },
	},
];
</script>

<AnnouncementBar id="launch-2-0" {messages} />
