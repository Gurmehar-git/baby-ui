"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../../alert-dialog/react/alert-dialog";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { Progress } from "../../progress/react/progress";
import {
	availableActions,
	formatDate,
	formatMoney,
	intervalLabel,
	STATUS_TONE,
	SUBSCRIPTION_LABELS,
	type SubscriptionLabels,
	type SubscriptionPending,
	type SubscriptionPlan,
	scheduleLine,
} from "../subscription-core";
import { type SubscriptionCardVariant, subscriptionCard } from "../variants";

type DateInput = string | number | Date;

type SubscriptionCtx = {
	id: string;
	plan: SubscriptionPlan;
	renewsAt?: DateInput;
	actions: ReturnType<typeof availableActions>;
	schedule: string | null;
	pending: SubscriptionPending | null;
	locale?: string;
	labels: SubscriptionLabels;
	styles: ReturnType<typeof subscriptionCard>;
};

const SubscriptionContext = createContext<SubscriptionCtx | null>(null);

function useSubscription(part: string): SubscriptionCtx {
	const ctx = useContext(SubscriptionContext);
	if (!ctx) throw new Error(`${part} must be used inside <SubscriptionCard>`);
	return ctx;
}

export interface SubscriptionCardProps extends Omit<ComponentProps<"section">, "title"> {
	plan: SubscriptionPlan;
	/** Next charge, for active recurring plans. */
	renewsAt?: DateInput;
	/** Access end, for canceled plans. */
	endsAt?: DateInput;
	trialEndsAt?: DateInput;
	/** The time relative dates are measured from; pass your own clock, the card keeps none. */
	now: DateInput;
	/** The action waiting on you; its button shows a loading state until you clear it. */
	pending?: SubscriptionPending | null;
	variant?: SubscriptionCardVariant;
	locale?: string;
	labels?: Partial<SubscriptionLabels>;
}

/** The root: the plan, its dates and the pending action. Compose the header, schedule and actions inside. */
export function SubscriptionCard({
	plan,
	renewsAt,
	endsAt,
	trialEndsAt,
	now,
	pending = null,
	variant = "card",
	locale,
	labels: labelOverrides,
	className,
	children,
	...rest
}: SubscriptionCardProps) {
	const id = useId();
	const labels = { ...SUBSCRIPTION_LABELS, ...labelOverrides };
	const styles = subscriptionCard({ variant });
	const ctx: SubscriptionCtx = {
		id,
		plan,
		renewsAt,
		actions: availableActions({ plan, endsAt, now }),
		schedule: scheduleLine({ plan, renewsAt, endsAt, trialEndsAt, now, locale, labels }),
		pending,
		locale,
		labels,
		styles,
	};

	return (
		<SubscriptionContext.Provider value={ctx}>
			<section
				data-slot="subscription-card"
				aria-labelledby={`${id}-name`}
				aria-busy={pending !== null || undefined}
				className={cn(styles.root(), className)}
				{...rest}
			>
				{children}
			</section>
		</SubscriptionContext.Provider>
	);
}

/** Groups the title and the price. */
export function SubscriptionCardHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useSubscription("SubscriptionCardHeader");
	return (
		<div
			data-slot="subscription-card-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

/** The plan name with its status badge; `headingLevel` matches the page outline. */
export function SubscriptionCardTitle({
	headingLevel = 3,
	className,
}: {
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	className?: string;
}) {
	const { id, plan, labels, styles } = useSubscription("SubscriptionCardTitle");
	const Heading = `h${headingLevel}` as const;
	return (
		<div data-slot="subscription-card-title" className={cn(styles.titleRow(), className)}>
			<Heading id={`${id}-name`} className={styles.title()}>
				{plan.name}
			</Heading>
			<Badge variant={STATUS_TONE[plan.status]} size="sm">
				{labels.status[plan.status]}
			</Badge>
		</div>
	);
}

/** The amount and its interval. */
export function SubscriptionCardPrice({ className }: { className?: string }) {
	const { plan, labels, locale, styles } = useSubscription("SubscriptionCardPrice");
	return (
		<p data-slot="subscription-card-price" className={cn(styles.price(), className)}>
			<span className={styles.amount()}>
				{formatMoney(plan.amount, plan.currency, locale)}
			</span>
			<span className={styles.interval()}>{intervalLabel(plan.interval, labels)}</span>
		</p>
	);
}

/** What happens next: renewal, trial end or access end. Renders nothing when nothing does. */
export function SubscriptionCardSchedule({ className }: { className?: string }) {
	const { schedule, styles } = useSubscription("SubscriptionCardSchedule");
	if (!schedule) return null;
	return (
		<p
			data-slot="subscription-card-schedule"
			className={cn(styles.schedule(), className)}
		>
			{schedule}
		</p>
	);
}

/** The failed-payment notice; folds open while the plan is past due. */
export function SubscriptionCardAlert({
	onUpdatePayment,
	className,
}: {
	onUpdatePayment?: () => void;
	className?: string;
}) {
	const { actions, pending, labels, styles } = useSubscription("SubscriptionCardAlert");
	const open = actions.updatePayment;
	return (
		<div
			data-slot="subscription-card-alert"
			data-open={open}
			className={styles.alertFold()}
		>
			<div className={styles.clip()} inert={!open}>
				<div className={styles.alertSpace()}>
					<div
						role={open ? "alert" : undefined}
						className={cn(styles.alert(), className)}
					>
						<p className={styles.alertText()}>{labels.pastDue}</p>
						{onUpdatePayment ? (
							<Button
								size="sm"
								variant="destructive"
								loading={pending === "payment"}
								disabled={pending !== null && pending !== "payment"}
								onClick={onUpdatePayment}
							>
								{labels.updatePayment}
							</Button>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

/** Seat usage as a bar; the full-house note folds in once every seat is taken. */
export function SubscriptionCardSeats({
	used,
	total,
	className,
}: {
	used: number;
	total: number;
	className?: string;
}) {
	const { labels, styles } = useSubscription("SubscriptionCardSeats");
	const full = used >= total;
	return (
		<div data-slot="subscription-card-seats" className={cn(styles.seats(), className)}>
			<Progress
				value={used}
				max={Math.max(1, total)}
				label={labels.seats}
				showValue
				formatValue={() => labels.seatsValue(used, total)}
			/>
			<div data-open={full} className={styles.seatsHintFold()}>
				<p className={styles.clip()} aria-hidden={!full}>
					<span className={styles.seatsHint()}>{labels.seatsFull}</span>
				</p>
			</div>
		</div>
	);
}

/** The action row; hides itself when none of its actions apply. */
export function SubscriptionCardFooter({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useSubscription("SubscriptionCardFooter");
	return (
		<div
			data-slot="subscription-card-footer"
			className={cn(styles.footer(), className)}
			{...props}
		/>
	);
}

interface ActionProps {
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}

function Action({
	part,
	kind,
	label,
	variant = "outline",
	className,
	onClick,
}: {
	part: string;
	kind: SubscriptionPending;
	label: ReactNode;
	variant?: "outline" | "default" | "ghost";
	className?: string;
	onClick?: () => void;
}) {
	const { pending } = useSubscription(part);
	return (
		<Button
			size="sm"
			variant={variant}
			className={className}
			loading={pending === kind}
			disabled={pending !== null && pending !== kind}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}

/** Opens the provider's billing portal. */
export function SubscriptionCardManage({ onClick, className, children }: ActionProps) {
	const { labels } = useSubscription("SubscriptionCardManage");
	return (
		<Action
			part="SubscriptionCardManage"
			kind="manage"
			label={children ?? labels.manage}
			className={className}
			onClick={onClick}
		/>
	);
}

export function SubscriptionCardChangePlan({
	onClick,
	className,
	children,
}: ActionProps) {
	const { labels } = useSubscription("SubscriptionCardChangePlan");
	return (
		<Action
			part="SubscriptionCardChangePlan"
			kind="change"
			label={children ?? labels.changePlan}
			className={className}
			onClick={onClick}
		/>
	);
}

/** Offered only while a canceled plan still runs. */
export function SubscriptionCardResume({ onClick, className, children }: ActionProps) {
	const { labels, actions, styles } = useSubscription("SubscriptionCardResume");
	if (!actions.resume) return null;
	return (
		<Action
			part="SubscriptionCardResume"
			kind="resume"
			variant="default"
			label={children ?? labels.resume}
			className={cn(styles.resume(), className)}
			onClick={onClick}
		/>
	);
}

/** Asks first, then runs `onClick`; set `plan.status` to "canceled" when it lands. */
export function SubscriptionCardCancel({ onClick, className, children }: ActionProps) {
	const { labels, actions, styles, pending, renewsAt, locale } = useSubscription(
		"SubscriptionCardCancel",
	);
	const [confirming, setConfirming] = useState(false);
	if (!actions.cancel) return null;
	return (
		<>
			<Button
				size="sm"
				variant="ghost"
				className={cn(styles.cancel(), className)}
				loading={pending === "cancel"}
				disabled={pending !== null && pending !== "cancel"}
				onClick={() => setConfirming(true)}
			>
				{children ?? labels.cancel}
			</Button>
			<AlertDialog open={confirming} onOpenChange={setConfirming}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{labels.cancelTitle}</AlertDialogTitle>
						<AlertDialogDescription>
							{labels.cancelBody(renewsAt ? formatDate(renewsAt, locale) : null)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{labels.cancelKeep}</AlertDialogCancel>
						<AlertDialogAction destructive onClick={onClick}>
							{labels.cancelConfirm}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
