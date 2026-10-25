<script lang="ts">
import {
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
} from "@baby-ui/svelte";

let pressed = $state<string[]>([]);
</script>

<ReactionBar bind:value={pressed}>
	<ReactionBarItem value="like" label="Like" count={127} tone="destructive">
		<ReactionBarIcon icon="like" />
		<ReactionBarCount />
	</ReactionBarItem>
	<ReactionBarItem value="comment" label="Comment" count={18} tone="primary">
		<ReactionBarIcon icon="comment" />
		<ReactionBarCount />
	</ReactionBarItem>
	<ReactionBarItem value="share" label="Share">
		<ReactionBarIcon icon="share" />
	</ReactionBarItem>
</ReactionBar>
