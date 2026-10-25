<script lang="ts">
import { cn } from "../../lib/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { compactCount } from "../icons";
import { reactionBar } from "../variants";
import { reactionBarItemState, reactionBarState } from "./context";

let { class: classProp }: { class?: string } = $props();
const ctx = reactionBarState("ReactionBarCount");
const item = reactionBarItemState("ReactionBarCount");
const styles = reactionBar();
</script>

<!-- The total, compact and rolling; its column folds shut at zero. -->
<span aria-hidden="true" data-slot="reaction-bar-count" data-shown={item.total > 0 || undefined} class={cn(styles.count(), classProp)}>
	<span class={styles.countClip()}>
		<RollingDigits
			value={item.total}
			format={(n: number) => compactCount(n, ctx.locale)}
			startOnView={false}
			class={styles.countText()}
		/>
	</span>
</span>
