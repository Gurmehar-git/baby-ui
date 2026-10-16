<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { attachmentState } from "./context";
import { ATTACHMENT_ICON, attachment, fileType } from "./variants";

let {
	src,
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
	/** Image URL, e.g. an object URL. Without it the preview shows the file type. */
	src?: string;
} = $props();

const ctx = attachmentState("AttachmentPreview");
const s = $derived(attachment({ variant: ctx.variant, status: ctx.status }));
const type = $derived(fileType(ctx.name));
const ring = $derived(ctx.variant !== "card" && ctx.status === "uploading");
const circumference = 2 * Math.PI * 9;
</script>

<span aria-hidden="true" data-slot="attachment-preview" class={cn(s.preview(), classProp)} {...rest}>
	{#if src && ctx.status !== "error"}
		<img {src} alt="" class={s.image()} />
	{:else if ctx.status === "error" || !type}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d={ATTACHMENT_ICON[ctx.status === "error" ? "error" : "file"]}
				stroke="currentColor"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<span class={s.type()}>{type}</span>
	{/if}
	{#if ring}
		<span class={s.ring()}>
			<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-6 -rotate-90">
				<circle cx="12" cy="12" r="9" stroke-width="2.5" class={s.ringTrack()} />
				<circle
					cx="12"
					cy="12"
					r="9"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke="currentColor"
					stroke-dasharray={circumference}
					stroke-dashoffset={circumference * (1 - ctx.progress / 100)}
					class={s.ringFill()}
				/>
			</svg>
		</span>
	{/if}
</span>
