<script lang="ts">
import { NotificationCenter, type NotificationItem } from "@baby-ui/svelte";

let items = $state<NotificationItem[]>([
	{ id: "1", title: "Deploy finished", time: "2m", tone: "success" },
]);
</script>

<NotificationCenter bind:notifications={items} />
