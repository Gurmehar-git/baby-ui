"use client";

import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import {
	BRAND_MARK,
	type ExpiryState,
	expiryLabel,
	expiryState,
	isCard,
	PAYMENT_METHOD_LABELS,
	type PaymentMethod,
	type PaymentMethodLabels,
	type PaymentMethodStatus,
} from "../payment-method-core";
import { type PaymentMethodCardVariant, paymentMethodCard } from "../variants";

type PaymentCtx = {
	method: PaymentMethod | null;
	expiry: ExpiryState;
	status: PaymentMethodStatus;
	locale?: string;
	labels: PaymentMethodLabels;
	styles: ReturnType<typeof paymentMethodCard>;
};

const PaymentContext = createContext<PaymentCtx | null>(null);

function usePayment(part: string): PaymentCtx {
	const ctx = useContext(PaymentContext);
	if (!ctx) throw new Error(`${part} must be used inside <PaymentMethodCard>`);
	return ctx;
}

export interface PaymentMethodCardProps extends ComponentProps<"section"> {
	/** The method on file, or null for the empty state. */
	method: PaymentMethod | null;
	/** Measures expiry against this; pass your own clock, the card keeps none. */
	now: string | number | Date;
	/** "redirecting" spins the action; "error" folds open PaymentMethodCardError. */
	status?: PaymentMethodStatus;
	variant?: PaymentMethodCardVariant;
	locale?: string;
	labels?: Partial<PaymentMethodLabels>;
}

/** The root: the method on file and the portal status. Compose the title, content and error inside. */
export function PaymentMethodCard({
	method,
	now,
	status = "idle",
	variant = "card",
	locale,
	labels: labelOverrides,
	className,
	children,
	...rest
}: PaymentMethodCardProps) {
	const labels = { ...PAYMENT_METHOD_LABELS, ...labelOverrides };
	const styles = paymentMethodCard({ variant });
	const ctx: PaymentCtx = {
		method,
		expiry: expiryState(method, now),
		status,
		locale,
		labels,
		styles,
	};

	return (
		<PaymentContext.Provider value={ctx}>
			<section
				data-slot="payment-method-card"
				aria-label={labels.title}
				aria-busy={status === "redirecting" || undefined}
				className={cn(styles.root(), className)}
				{...rest}
			>
				{children}
			</section>
		</PaymentContext.Provider>
	);
}

/** The heading; children replace "Payment method". */
export function PaymentMethodCardTitle({
	headingLevel = 3,
	className,
	children,
}: {
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	className?: string;
	children?: ReactNode;
}) {
	const { labels, styles } = usePayment("PaymentMethodCardTitle");
	const Heading = `h${headingLevel}` as const;
	return (
		<Heading className={cn(styles.title(), className)}>
			{children ?? labels.title}
		</Heading>
	);
}

/** The row holding the mark, the details and the action. */
export function PaymentMethodCardContent({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePayment("PaymentMethodCardContent");
	return (
		<div
			data-slot="payment-method-card-content"
			className={cn(styles.content(), className)}
			{...props}
		/>
	);
}

/** The brand chip; renders nothing when no method is on file. */
export function PaymentMethodCardMark({ className }: { className?: string }) {
	const { method, styles } = usePayment("PaymentMethodCardMark");
	if (!method) return null;
	return (
		<span aria-hidden="true" className={cn(styles.mark(), className)}>
			{BRAND_MARK[isCard(method) ? method.brand : method.type]}
		</span>
	);
}

/** Card number and expiry, the wallet account, or the empty-state copy. */
export function PaymentMethodCardDetails({ className }: { className?: string }) {
	const { method, expiry, locale, labels, styles } = usePayment(
		"PaymentMethodCardDetails",
	);
	return (
		<div
			data-slot="payment-method-card-details"
			className={cn(styles.details(), className)}
		>
			{!method ? (
				<>
					<p className={styles.primary()}>{labels.empty}</p>
					<p className={styles.secondary()}>{labels.emptyHint}</p>
				</>
			) : isCard(method) ? (
				<>
					<p className={styles.primary()}>
						{labels.cardLine(labels.brand[method.brand], method.last4)}
						{expiry === "soon" ? (
							<Badge variant="warning" size="sm">
								{labels.soonBadge}
							</Badge>
						) : expiry === "expired" ? (
							<Badge variant="destructive" size="sm">
								{labels.expiredBadge}
							</Badge>
						) : null}
					</p>
					<p className={styles.secondary()}>
						{expiry === "expired"
							? labels.expired(expiryLabel(method, locale))
							: labels.expires(expiryLabel(method, locale))}
					</p>
				</>
			) : (
				<>
					<p className={styles.primary()}>{labels.brand[method.type]}</p>
					<p className={styles.secondary()}>{method.email}</p>
				</>
			)}
		</div>
	);
}

/** Add or update through the provider's portal; filled when the card needs attention. */
export function PaymentMethodCardAction({
	onClick,
	className,
	children,
}: {
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}) {
	const { method, expiry, status, labels, styles } = usePayment(
		"PaymentMethodCardAction",
	);
	return (
		<Button
			size="sm"
			variant={method && expiry === "ok" ? "outline" : "default"}
			className={cn(styles.action(), className)}
			loading={status === "redirecting"}
			loadingLabel={labels.redirecting}
			onClick={onClick}
		>
			{children ?? (method ? labels.update : labels.add)}
		</Button>
	);
}

/** Folds open while `status` is "error"; children replace the default message. */
export function PaymentMethodCardError({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { status, labels, styles } = usePayment("PaymentMethodCardError");
	const open = status === "error";
	return (
		<div
			data-slot="payment-method-card-error"
			data-open={open}
			className={styles.errorFold()}
		>
			<p
				role={open ? "alert" : undefined}
				aria-hidden={!open}
				className={styles.errorClip()}
			>
				<span className={cn(styles.error(), className)}>{children ?? labels.error}</span>
			</p>
		</div>
	);
}
