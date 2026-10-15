<script lang="ts">
import {
	Attachment,
	AttachmentContent,
	AttachmentMeta,
	AttachmentName,
	AttachmentPreview,
	AttachmentProgress,
	AttachmentRemove,
	AttachmentRetry,
	Attachments,
	Button,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CHAT_ATTACHMENTS } from "../data/attachment";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Attachment>>(props));

const variant = $derived(p.variant ?? "chip");
let shown = $state(CHAT_ATTACHMENTS.map((a) => a.id));
let retried = $state<string[]>([]);
const list = $derived(CHAT_ATTACHMENTS.filter((a) => shown.includes(a.id)));
</script>

<div class="flex w-full max-w-md flex-col gap-2 rounded-2xl border border-border bg-background p-2">
	<!-- Cards are full width, so `wrap` stacks them; chips and tiles scroll in one line. -->
	<Attachments variant={variant === "card" ? "wrap" : "scroll"}>
		{#each list as file, i (file.id)}
			{@const status =
				i === 0 && file.id === "shot"
					? (p.status ?? "ready")
					: "failed" in file && !retried.includes(file.id)
						? "error"
						: "ready"}
			<Attachment name={file.name} {variant} {status} progress={Number(props.progress ?? 40)}>
				<AttachmentPreview src={"src" in file ? file.src : undefined} />
				<AttachmentContent>
					<AttachmentName />
					<AttachmentMeta>{file.meta}</AttachmentMeta>
					{#if variant === "card"}<AttachmentProgress />{/if}
				</AttachmentContent>
				<AttachmentRetry onclick={() => (retried = [...retried, file.id])} />
				<AttachmentRemove onclick={() => (shown = shown.filter((id) => id !== file.id))} />
			</Attachment>
		{/each}
	</Attachments>
	<div class="flex items-center justify-between gap-2 px-2 pb-1">
		<span class="text-muted-foreground text-sm">Ask about these files</span>
		{#if shown.length < CHAT_ATTACHMENTS.length}
			<Button
				size="xs"
				variant="ghost"
				onclick={() => {
					shown = CHAT_ATTACHMENTS.map((a) => a.id);
					retried = [];
				}}
			>
				Reset
			</Button>
		{/if}
	</div>
</div>
