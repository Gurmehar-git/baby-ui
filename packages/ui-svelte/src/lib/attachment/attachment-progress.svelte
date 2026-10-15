<script lang="ts">
import { cn } from "../lib/cn";
import { attachmentState } from "./context";
import { attachment } from "./variants";

let { class: classProp }: { class?: string } = $props();

const ctx = attachmentState("AttachmentProgress");
const s = $derived(attachment({ variant: ctx.variant, status: ctx.status }));
</script>

<!-- Card only: a bar under the name that folds away once the upload settles. -->
<span data-slot="attachment-progress" class={cn(s.progress(), classProp)} inert={ctx.status !== "uploading"}>
	<span class="min-h-0 overflow-hidden">
		<span
			role="progressbar"
			aria-label={ctx.name}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(ctx.progress)}
			class={cn(s.track(), "block")}
		>
			<span class={cn(s.fill(), "block")} style:scale="{ctx.progress / 100} 1"></span>
		</span>
	</span>
</span>
