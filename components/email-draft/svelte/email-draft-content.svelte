<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState, isFolded } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftContent");
const gone = $derived(isFolded(ctx.status));
</script>

<!-- The email itself; folds away once it is sent or discarded, and dims while sending. -->
<div data-slot="email-draft-content" data-folded={gone || undefined} inert={gone} {...rest} class={cn(ctx.styles.content(), classProp)}>
	<div class={ctx.styles.contentClip()}>
		<div data-sending={ctx.status === "sending" || undefined} class={ctx.styles.contentBody()}>
			{@render children?.()}
		</div>
	</div>
</div>
