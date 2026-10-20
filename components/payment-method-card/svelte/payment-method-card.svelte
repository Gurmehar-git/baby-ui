<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	expiryState,
	PAYMENT_METHOD_LABELS,
	type PaymentMethod,
	type PaymentMethodLabels,
	type PaymentMethodStatus,
} from "../payment-method-core";
import { type PaymentMethodCardVariant, paymentMethodCard } from "../variants";
import { setPaymentMethodCard } from "./context";

type Props = Omit<HTMLAttributes<HTMLElement>, "children"> & {
	/** The method on file, or null for the empty state. */
	method: PaymentMethod | null;
	/** Measures expiry against this; pass your own clock, the card keeps none. */
	now: string | number | Date;
	/** "redirecting" spins the action; "error" folds open PaymentMethodCardError. */
	status?: PaymentMethodStatus;
	variant?: PaymentMethodCardVariant;
	locale?: string;
	labels?: Partial<PaymentMethodLabels>;
	children?: Snippet;
};

let {
	method,
	now,
	status = "idle",
	variant = "card",
	locale,
	labels: labelOverrides,
	class: classProp,
	children,
	...rest
}: Props = $props();

const labels = $derived({ ...PAYMENT_METHOD_LABELS, ...labelOverrides });
const styles = $derived(paymentMethodCard({ variant }));

setPaymentMethodCard({
	get method() {
		return method;
	},
	get expiry() {
		return expiryState(method, now);
	},
	get status() {
		return status;
	},
	get locale() {
		return locale;
	},
	get labels() {
		return labels;
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: the method on file and the portal status. Compose the title, content and error inside. -->
<section
	data-slot="payment-method-card"
	aria-label={labels.title}
	aria-busy={status === "redirecting" || undefined}
	class={cn(styles.root(), classProp)}
	{...rest}
>
	{@render children?.()}
</section>
