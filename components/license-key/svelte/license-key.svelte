<script lang="ts">
import { untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { LICENSE_KEY_LABELS, type LicenseKeyStatus } from "../license-core";
import { type LicenseKeyVariant, licenseKey as licenseKeyStyles } from "../variants";
import { setLicenseKey } from "./context";

let {
	licenseKey,
	status = $bindable(),
	onRotate,
	revealed = $bindable(false),
	variant = "card",
	rotatingLabel = LICENSE_KEY_LABELS.rotating,
	rotatedLabel = LICENSE_KEY_LABELS.rotated,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	licenseKey: string;
	/** Bindable. Regenerate sets "confirming"; Cancel and Escape set "idle". */
	status: LicenseKeyStatus;
	/** Fires from the confirm step. Set "rotating", then "idle" with the new key. */
	onRotate: () => void;
	/** Bindable. */
	revealed?: boolean;
	variant?: LicenseKeyVariant;
	/** Announced politely while rotating and once a new key lands. */
	rotatingLabel?: string;
	rotatedLabel?: string;
} = $props();

const id = $props.id();
const styles = $derived(licenseKeyStyles({ variant }));
const open = $derived(status !== "idle");

setLicenseKey({
	get licenseKey() {
		return licenseKey;
	},
	get status() {
		return status;
	},
	setStatus: (next) => {
		status = next;
	},
	onRotate: () => onRotate(),
	get revealed() {
		return revealed;
	},
	setRevealed: (next) => {
		revealed = next;
	},
	get styles() {
		return styles;
	},
	confirmId: `${id}-confirm`,
	triggerId: `${id}-rotate`,
	cancelId: `${id}-cancel`,
});

let root = $state<HTMLDivElement>();
let wasOpen = untrack(() => open);
$effect(() => {
	const now = open;
	if (wasOpen === now) return;
	wasOpen = now;
	// Only move focus the user already has here; a parent flipping status must not steal it.
	if (!root?.contains(document.activeElement)) return;
	document.getElementById(now ? `${id}-cancel` : `${id}-rotate`)?.focus();
});

let announced = $state("");
let lastKey = untrack(() => licenseKey);
$effect(() => {
	const key = licenseKey;
	if (lastKey === key) return;
	lastKey = key;
	announced = untrack(() => rotatedLabel);
});
</script>

<!-- Holds the key, its reveal and the regenerate flow; the parts inside read them from here. -->
<div
	{...rest}
	bind:this={root}
	data-slot="license-key"
	data-variant={variant}
	data-status={status}
	class={cn(styles.root(), classProp)}
>
	{@render children?.()}
	<p class="sr-only" aria-live="polite">{status === "rotating" ? rotatingLabel : announced}</p>
</div>
