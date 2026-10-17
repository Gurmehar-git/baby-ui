"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
} from "../../card/react/card";
import { cn } from "../../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import type { Pricing01Period } from "../types";
import { type Pricing01Variant, pricing01 } from "../variants";

export type { Pricing01Period, Pricing01Variant };

type Pricing01State = {
	variant: Pricing01Variant;
	periods: Pricing01Period[];
	current?: Pricing01Period;
	setPeriod: (next: string | string[]) => void;
	styles: ReturnType<typeof pricing01>;
};

const Pricing01Context = createContext<Pricing01State | null>(null);
const Pricing01PlanContext = createContext(false);

function usePricing01() {
	const state = useContext(Pricing01Context);
	if (!state) throw new Error("Pricing01 parts must be rendered inside a Pricing01.");
	return state;
}

export interface Pricing01Props extends ComponentProps<"section"> {
	/** Billing periods; Pricing01Periods shows a toggle when there are two or more. */
	periods: Pricing01Period[];
	period?: string;
	defaultPeriod?: string;
	onPeriodChange?: (period: string) => void;
	variant?: Pricing01Variant;
}

/**
 * Pricing from parts: Pricing01Header (heading, aside with Pricing01Periods), then Pricing01Plans
 * of Pricing01Plan cards whose Pricing01PlanPrice follows the chosen period.
 */
export function Pricing01({
	periods,
	period: periodProp,
	defaultPeriod,
	onPeriodChange,
	variant = "default",
	className,
	children,
	...props
}: Pricing01Props) {
	const [internal, setInternal] = useState(defaultPeriod ?? periods[0]?.value ?? "");
	const period = periodProp ?? internal;
	const styles = pricing01({ variant });
	const state: Pricing01State = {
		variant,
		periods,
		current: periods.find((p) => p.value === period) ?? periods[0],
		setPeriod: (next) => {
			if (typeof next !== "string" || !next) return;
			if (periodProp === undefined) setInternal(next);
			onPeriodChange?.(next);
		},
		styles,
	};
	return (
		<Pricing01Context.Provider value={state}>
			<section data-slot="pricing-01" className={cn(styles.root(), className)} {...props}>
				<div className={styles.inner()}>{children}</div>
			</section>
		</Pricing01Context.Provider>
	);
}

/** The row above the plans: Pricing01Heading beside Pricing01Aside. */
export function Pricing01Header({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing01();
	return (
		<div
			data-slot="pricing-01-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function Pricing01Heading({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing01();
	return (
		<div
			data-slot="pricing-01-heading"
			className={cn(styles.heading(), className)}
			{...props}
		/>
	);
}

export function Pricing01Eyebrow({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing01();
	return (
		<p
			data-slot="pricing-01-eyebrow"
			className={cn(styles.eyebrow(), className)}
			{...props}
		/>
	);
}

export function Pricing01Title({ className, ...props }: ComponentProps<"h2">) {
	const { styles } = usePricing01();
	return (
		<h2
			data-slot="pricing-01-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

/** The right-hand column: Pricing01Description and Pricing01Periods. */
export function Pricing01Aside({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing01();
	return (
		<div
			data-slot="pricing-01-aside"
			className={cn(styles.aside(), className)}
			{...props}
		/>
	);
}

export function Pricing01Description({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing01();
	return (
		<p
			data-slot="pricing-01-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** The billing period toggle; renders nothing with fewer than two periods. */
export function Pricing01Periods({
	label = "Billing period",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { periods, current, setPeriod } = usePricing01();
	if (periods.length < 2) return null;
	return (
		<ToggleGroup
			data-slot="pricing-01-periods"
			type="single"
			size="sm"
			value={current?.value ?? ""}
			onValueChange={setPeriod}
			label={label}
			className={className}
		>
			{periods.map((p) => (
				<ToggleGroupItem key={p.value} value={p.value}>
					{p.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export function Pricing01Plans({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing01();
	return (
		<div
			data-slot="pricing-01-plans"
			className={cn(styles.plans(), className)}
			{...props}
		/>
	);
}

export interface Pricing01PlanProps {
	/** Outlines the card and fills its badge and button. */
	featured?: boolean;
	/** Rises above the card on hover and focus. */
	note?: ReactNode;
	className?: string;
	children?: ReactNode;
}

/** One plan card: Pricing01PlanHeader, Pricing01PlanContent and Pricing01PlanFooter. */
export function Pricing01Plan({
	featured = false,
	note,
	className,
	children,
}: Pricing01PlanProps) {
	const { variant, styles } = usePricing01();
	return (
		<Pricing01PlanContext.Provider value={featured}>
			<div
				data-slot="pricing-01-plan"
				data-featured={featured || undefined}
				className={styles.item()}
			>
				{note ? (
					<p aria-hidden className={styles.note()}>
						{note}
					</p>
				) : null}
				<Card
					variant={variant}
					className={cn(pricing01({ variant, featured }).card(), className)}
				>
					{children}
				</Card>
			</div>
		</Pricing01PlanContext.Provider>
	);
}

export function Pricing01PlanHeader(props: ComponentProps<typeof CardHeader>) {
	return <CardHeader {...props} />;
}

export function Pricing01PlanName({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing01();
	return (
		<p
			data-slot="pricing-01-plan-name"
			className={cn(styles.name(), className)}
			{...props}
		/>
	);
}

/** A pill beside the name, e.g. "Popular"; filled on a featured plan. */
export function Pricing01PlanBadge({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const featured = useContext(Pricing01PlanContext);
	return (
		<CardAction>
			<Badge variant={featured ? "default" : "outline"} size="sm" className={className}>
				{children}
			</Badge>
		</CardAction>
	);
}

/** The price for the chosen period, then its cadence. */
export function Pricing01PlanPrice({
	prices,
	className,
}: {
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	className?: string;
}) {
	const { current, styles } = usePricing01();
	return (
		<div data-slot="pricing-01-plan-price" className={cn(styles.price(), className)}>
			<span className={styles.amount()}>{current ? prices[current.value] : null}</span>
			{current ? <span className={styles.cadence()}>{current.cadence}</span> : null}
		</div>
	);
}

export function Pricing01PlanContent({
	className,
	...props
}: ComponentProps<typeof CardContent>) {
	const { styles } = usePricing01();
	return <CardContent className={cn(styles.body(), className)} {...props} />;
}

export function Pricing01PlanDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing01();
	return (
		<p
			data-slot="pricing-01-plan-description"
			className={cn(styles.blurb(), className)}
			{...props}
		/>
	);
}

export function Pricing01PlanFeatures({ className, ...props }: ComponentProps<"ul">) {
	const { styles } = usePricing01();
	return (
		<ul
			data-slot="pricing-01-plan-features"
			className={cn(styles.features(), className)}
			{...props}
		/>
	);
}

export function Pricing01PlanFeature({
	className,
	children,
	...props
}: ComponentProps<"li">) {
	const { styles } = usePricing01();
	return (
		<li
			data-slot="pricing-01-plan-feature"
			className={cn(styles.feature(), className)}
			{...props}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden
				className={styles.check()}
			>
				<path d="M5 12l5 5l10 -10" />
			</svg>
			<span>{children}</span>
		</li>
	);
}

export function Pricing01PlanFooter(props: ComponentProps<typeof CardFooter>) {
	return <CardFooter {...props} />;
}

export interface Pricing01PlanActionProps {
	/** Renders a link; otherwise a button calling `onClick`. */
	href?: string;
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}

/** The plan's full-width button; filled on a featured plan. */
export function Pricing01PlanAction({
	href,
	onClick,
	className,
	children,
}: Pricing01PlanActionProps) {
	const { styles } = usePricing01();
	const featured = useContext(Pricing01PlanContext);
	return (
		<Button
			data-slot="pricing-01-plan-action"
			href={href}
			onClick={onClick}
			variant={featured ? "default" : "dark"}
			className={cn(styles.cta(), className)}
		>
			{children}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden
				className={styles.arrow()}
			>
				<path d="M17 7l-10 10" />
				<path d="M8 7l9 0l0 9" />
			</svg>
		</Button>
	);
}
