<script lang="ts">
import { NotificationCenter } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { NOTIFICATIONS } from "../data/notifications";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NotificationCenter>>(props));
let notifications = $state(NOTIFICATIONS);
</script>

<div class="grid min-h-24 place-items-center">
	<NotificationCenter bind:notifications size={p.size} />
</div>
