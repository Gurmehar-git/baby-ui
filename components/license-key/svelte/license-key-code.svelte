<script lang="ts">
import CopyButton from "../../copy-button/svelte/copy-button.svelte";
import { cn } from "../../lib/cn";
import { LICENSE_KEY_LABELS } from "../license-core";
import { getLicenseKey } from "./context";

let {
	text,
	copyText,
	copyLabel = LICENSE_KEY_LABELS.copySnippet,
	copiedLabel = LICENSE_KEY_LABELS.copied,
	class: classProp,
}: {
	text: string;
	/** Copies something other than what is shown, like the real key. */
	copyText?: string;
	copyLabel?: string;
	copiedLabel?: string;
	class?: string;
} = $props();
const ctx = getLicenseKey();
</script>

<div class={cn(ctx.styles.code(), classProp)}>
	<!-- Focusable so keyboard users can scroll a long command sideways. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre class={ctx.styles.pre()} tabindex="0"><code>{text}</code></pre>
	<CopyButton
		text={copyText ?? text}
		label={copyLabel}
		{copiedLabel}
		iconOnly
		class={ctx.styles.codeCopy()}
	/>
</div>
