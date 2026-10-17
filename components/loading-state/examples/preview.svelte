<script lang="ts">
import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
	LoadingStatePreview,
} from "@baby-ui/components/svelte/loading-state";
</script>

<LoadingState>
	<LoadingStateIndicator />
	<LoadingStateLabel>Subway surfing</LoadingStateLabel>
	<LoadingStateElapsed />
	<LoadingStatePreview src="https://95dnc2a95qgwt9ff.public.blob.vercel-storage.com/subway-surfers.mp4" />
</LoadingState>
