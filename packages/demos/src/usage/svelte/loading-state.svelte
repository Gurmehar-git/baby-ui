<script lang="ts">
import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
} from "@baby-ui/svelte";
</script>

<LoadingState>
	<LoadingStateIndicator />
	<LoadingStateLabel>Churning</LoadingStateLabel>
	<LoadingStateElapsed />
</LoadingState>
