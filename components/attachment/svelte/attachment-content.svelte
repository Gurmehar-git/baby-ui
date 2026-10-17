<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { attachment } from "../variants";
import { attachmentState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();

const ctx = attachmentState("AttachmentContent");
</script>

<!-- Holds the name and meta lines; `tile` keeps it for screen readers only. -->
<span
	data-slot="attachment-content"
	class={cn(attachment({ variant: ctx.variant }).text(), "flex flex-col", classProp)}
	{...rest}
>
	{@render children?.()}
</span>
