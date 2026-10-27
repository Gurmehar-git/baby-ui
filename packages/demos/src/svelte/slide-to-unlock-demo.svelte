<script lang="ts">
import {
	Button,
	SlideToUnlock,
	SlideToUnlockHandle,
	SlideToUnlockText,
	SlideToUnlockTrack,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SlideToUnlock>>(props));
let value = $state(0);
let complete = $state(false);
</script>

<div class="grid place-items-center gap-3">
	<SlideToUnlock
		label={p.label ?? "Confirm publish"}
		bind:value
		onComplete={() => (complete = true)}
		threshold={p.threshold ?? 90}
		variant={p.variant ?? "default"}
		size={p.size ?? "xl"}
		disabled={p.disabled}
		loading={p.loading}
	>
		<SlideToUnlockTrack>
			<SlideToUnlockText>{#snippet children()}{complete ? "Published" : "Slide to publish"}{/snippet}</SlideToUnlockText>
			<SlideToUnlockHandle />
		</SlideToUnlockTrack>
	</SlideToUnlock>
	<p role="status" class="text-muted-foreground text-sm">
		{complete ? "Post published" : `${Math.round(value)}% confirmed`}
	</p>
	<Button
		variant="ghost"
		size="sm"
		disabled={!complete && value === 0}
		onclick={() => {
			value = 0;
			complete = false;
		}}
	>
		Reset
	</Button>
</div>
