<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	cooldownSeconds,
	MAGIC_LINK_LABELS,
	type MagicLinkLabels,
	type MagicLinkStatus,
	normalizeEmail,
} from "../magic-link-core";
import { type MagicLinkLayout, type MagicLinkVariant, magicLinkLogin } from "../variants";
import { type MagicLinkView, setMagicLinkLogin } from "./context";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "onsubmit" | "title" | "children"> & {
	status: MagicLinkStatus;
	/** Bindable. */
	email?: string;
	/** Server message for the "error" status. */
	error?: string;
	/** Epoch ms when resending unlocks. Needs `now`. */
	resendAvailableAt?: number;
	/** Current epoch ms, ticked by the parent; drives the resend countdown. */
	now?: number;
	labels?: Partial<MagicLinkLabels>;
	variant?: MagicLinkVariant;
	layout?: MagicLinkLayout;
	children?: Snippet;
};

let {
	status,
	email = $bindable(""),
	error,
	resendAvailableAt,
	now,
	labels: labelsProp,
	variant = "card",
	layout = "centered",
	class: classProp,
	children,
	...rest
}: Props = $props();

const labels = $derived({ ...MAGIC_LINK_LABELS, ...labelsProp });
const id = $props.id();
const inputId = `${id}-email`;
const styles = $derived(magicLinkLogin({ variant, layout }));
let invalid = $state(false);

// "sending" and "error" keep whichever view is on screen, so a resend stays in the sent view.
let lastView: MagicLinkView = "form";
const view = $derived.by<MagicLinkView>(() => {
	lastView = status === "sent" ? "sent" : status === "idle" ? "form" : lastView;
	return lastView;
});

let sentHeading = $state<HTMLElement>();
let mounted = false;
$effect(() => {
	const current = view;
	if (!mounted) {
		mounted = true;
		return;
	}
	if (current === "sent") sentHeading?.focus();
	else document.getElementById(inputId)?.focus();
});

const message = $derived(
	invalid ? labels.invalid : status === "error" ? error : undefined,
);
const live = $derived(
	status === "sending"
		? labels.sending
		: status === "sent"
			? labels.announceSent
			: (message ?? ""),
);

setMagicLinkLogin({
	inputId,
	errorId: `${id}-error`,
	get status() {
		return status;
	},
	get view() {
		return view;
	},
	get email() {
		return email;
	},
	setEmail: (next) => {
		invalid = false;
		email = next;
	},
	get address() {
		return normalizeEmail(email);
	},
	setInvalid: (next) => {
		invalid = next;
	},
	get message() {
		return message;
	},
	get cooldown() {
		return now === undefined ? 0 : cooldownSeconds(resendAvailableAt, now);
	},
	setSentHeading: (el) => {
		sentHeading = el;
	},
	get labels() {
		return labels;
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: status, email and the resend clock. Compose the panel, views and their parts inside. -->
<div {...rest} data-slot="magic-link-login" class={cn(styles.root(), classProp)} data-status={status}>
	{@render children?.()}
	<p class="sr-only" aria-live="polite">{live}</p>
</div>
