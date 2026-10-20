<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { LICENSE_KEY_LABELS } from "../license-core";
import { licenseDisclosure } from "../variants";
import { getLicenseKey } from "./context";

let {
	title = LICENSE_KEY_LABELS.confirmTitle,
	description,
	error,
	cancelLabel = LICENSE_KEY_LABELS.cancel,
	confirmLabel = LICENSE_KEY_LABELS.confirmRotate,
	rotatingLabel = LICENSE_KEY_LABELS.rotating,
	class: classProp,
}: {
	title?: string;
	description?: string;
	/** Shown while status is "error". */
	error?: string;
	cancelLabel?: string;
	confirmLabel?: string;
	rotatingLabel?: string;
	class?: string;
} = $props();
const ctx = getLicenseKey();
const open = $derived(ctx.status !== "idle");

function closeOnEscape(event: KeyboardEvent) {
	if (event.key !== "Escape" || ctx.status === "rotating") return;
	event.stopPropagation();
	ctx.setStatus("idle");
}
</script>

<div id={ctx.confirmId} class={cn(licenseDisclosure({ open }), classProp)} inert={!open}>
	<div class="min-h-0 overflow-hidden">
		<div class={cn("mt-3", ctx.styles.confirm())}>
			<p class={ctx.styles.confirmTitle()}>{title}</p>
			{#if description}<p class={ctx.styles.confirmBody()}>{description}</p>{/if}
			{#if ctx.status === "error" && error}
				<p role="alert" class={ctx.styles.error()}>{error}</p>
			{/if}
			<div class={ctx.styles.confirmActions()}>
				<Button
					id={ctx.cancelId}
					onkeydown={closeOnEscape}
					variant="ghost"
					size="sm"
					disabled={ctx.status === "rotating"}
					onclick={() => ctx.setStatus("idle")}
				>
					{cancelLabel}
				</Button>
				<Button
					variant="destructive"
					onkeydown={closeOnEscape}
					size="sm"
					loading={ctx.status === "rotating"}
					loadingLabel={rotatingLabel}
					onclick={() => ctx.onRotate()}
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	</div>
</div>
