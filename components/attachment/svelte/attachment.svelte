<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { transitionMs } from "../../lib/svelte/motion";
import { inAttachmentList, setAttachment } from "./context";
import { ATTACHMENT_LABELS, type AttachmentLabels } from "./labels";
import { type AttachmentStatus, type AttachmentVariant, attachment } from "./variants";

let {
	name,
	status = "ready",
	progress = 0,
	variant = "chip",
	labels: labelsProp,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** The file name: it names the remove and retry buttons and the announcements. */
	name: string;
	status?: AttachmentStatus;
	/** Upload percentage, 0 to 100, while uploading. */
	progress?: number;
	/** `chip` for a composer, `card` for a full row, `tile` for an image square. */
	variant?: AttachmentVariant;
	labels?: Partial<AttachmentLabels>;
	children?: Snippet;
} = $props();

const s = $derived(attachment({ variant, status }));
const labels = $derived({ ...ATTACHMENT_LABELS, ...labelsProp });
const inList = inAttachmentList();
let root = $state<HTMLDivElement>();
let leaving = $state(false);
let after: (() => void) | undefined;

// The fold runs first, then the action; reduced motion skips straight to it.
$effect(() => {
	if (!leaving) return;
	const ms = root ? transitionMs(root) : 0;
	const timer = setTimeout(() => after?.(), ms);
	return () => clearTimeout(timer);
});

setAttachment({
	get name() {
		return name;
	},
	get status() {
		return status;
	},
	get progress() {
		return Math.min(100, Math.max(0, progress));
	},
	get variant() {
		return variant;
	},
	get labels() {
		return labels;
	},
	get leaving() {
		return leaving;
	},
	leave: (then) => {
		after = then;
		leaving = true;
	},
});
</script>

<div
	bind:this={root}
	role={inList ? "listitem" : undefined}
	data-slot="attachment"
	data-variant={variant}
	data-status={status}
	data-leaving={leaving}
	class={cn(s.root(), classProp)}
	{...rest}
>
	<div class={s.clip()}>
		<div class={s.surface()}>{@render children?.()}</div>
	</div>
	<!-- Announces state changes only; every percent would be noise. -->
	<span class="sr-only" aria-live="polite">{status === "uploading" ? "" : `${name}: ${labels[status]}`}</span>
</div>
