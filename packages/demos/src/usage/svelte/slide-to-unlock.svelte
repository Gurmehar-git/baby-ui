<script lang="ts">
import {
	SlideToUnlock,
	SlideToUnlockHandle,
	SlideToUnlockText,
	SlideToUnlockTrack,
} from "@baby-ui/svelte";

let value = $state(0);
</script>

<SlideToUnlock label="Confirm publish" bind:value onComplete={() => console.log("Publish confirmed")}>
	<SlideToUnlockTrack>
		<SlideToUnlockText>{#snippet children()}Slide to publish{/snippet}</SlideToUnlockText>
		<SlideToUnlockHandle />
	</SlideToUnlockTrack>
</SlideToUnlock>
