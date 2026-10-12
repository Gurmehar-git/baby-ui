<script lang="ts">
import { AnnouncementBar, Button } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { announcementsAt } from "../data/announcements";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof AnnouncementBar>>(props));
const messages = announcementsAt(Date.now());
let open = $state(true);
</script>

<div class="grid w-full max-w-3xl gap-4">
	<div class="overflow-hidden rounded-xl border">
		<AnnouncementBar {messages} bind:open controls={p.controls} autoPlay={p.autoPlay} variant={p.variant} />
		<div class="grid h-28 place-items-center text-muted-foreground text-sm">Page content</div>
	</div>
	{#if !open}
		<Button variant="outline" size="sm" class="justify-self-start" onclick={() => (open = true)}>Show again</Button>
	{/if}
</div>
