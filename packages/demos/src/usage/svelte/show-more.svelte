<script lang="ts">
import { ShowMore, ShowMoreContent, ShowMoreTrigger } from "@baby-ui/svelte";
</script>

<ShowMore lines={3}>
	<ShowMoreContent>
		<p>
			Components here are copied into your project rather than installed, which means you own
			the source and can change anything. The registry only decides what the first version
			looks like.
		</p>
	</ShowMoreContent>
	<ShowMoreTrigger />
</ShowMore>
