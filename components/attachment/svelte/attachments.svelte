<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type AttachmentsVariant, attachments } from "../variants";
import { markAttachmentList } from "./context";

let {
	variant = "scroll",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** `scroll`: one line that scrolls, for a composer; `wrap`: wraps, for a sent message. */
	variant?: AttachmentsVariant;
	children?: Snippet;
} = $props();

markAttachmentList();
</script>

<div
	role="list"
	data-slot="attachments"
	data-variant={variant}
	class={cn(attachments({ variant }), classProp)}
	{...rest}
>
	{@render children?.()}
</div>
