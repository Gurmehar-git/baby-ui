"use client";

import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { Card } from "../../card/react/card";
import { cn } from "../../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import { digitDelay, type Pricing02Period } from "../types";
import { type Pricing02Variant, pricing02 } from "../variants";

export type { Pricing02Period, Pricing02Variant };

type Pricing02State = {
	variant: Pricing02Variant;
	periods: Pricing02Period[];
	current?: Pricing02Period;
	currentIndex: number;
	moved: boolean;
	setPeriod: (next: string | string[]) => void;
	styles: ReturnType<typeof pricing02>;
};

const Pricing02Context = createContext<Pricing02State | null>(null);
const Pricing02PlanContext = createContext(false);

function usePricing02() {
	const state = useContext(Pricing02Context);
	if (!state) throw new Error("Pricing02 parts must be rendered inside a Pricing02.");
	return state;
}

function Icon({ paths, className }: { paths: string[]; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className={className}
		>
			{paths.map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

export interface Pricing02Props extends ComponentProps<"section"> {
	/** Billing periods; Pricing02Periods shows a toggle when there are two or more. */
	periods: Pricing02Period[];
	period?: string;
	defaultPeriod?: string;
	onPeriodChange?: (period: string) => void;
	variant?: Pricing02Variant;
}

/**
 * Pricing from parts: Pricing02Header, Pricing02Plans of Pricing02Plan cards whose price digits
 * roll on a period change, then Pricing02Footnotes.
 */
export function Pricing02({
	periods,
	period: periodProp,
	defaultPeriod,
	onPeriodChange,
	variant = "soft",
	className,
	children,
	...props
}: Pricing02Props) {
	const [internal, setInternal] = useState(defaultPeriod ?? periods[0]?.value ?? "");
	const period = periodProp ?? internal;
	const currentIndex = Math.max(
		0,
		periods.findIndex((p) => p.value === period),
	);
	const current = periods[currentIndex];
	const styles = pricing02({ variant });

	// Digits only roll once the period has changed, never on first paint.
	const [initial] = useState(current?.value);
	const [moved, setMoved] = useState(false);
	if (!moved && current?.value !== initial) setMoved(true);

	const state: Pricing02State = {
		variant,
		periods,
		current,
		currentIndex,
		moved,
		setPeriod: (next) => {
			if (typeof next !== "string" || !next) return;
			if (periodProp === undefined) setInternal(next);
			onPeriodChange?.(next);
		},
		styles,
	};
	return (
		<Pricing02Context.Provider value={state}>
			<section data-slot="pricing-02" className={cn(styles.root(), className)} {...props}>
				<div className={styles.inner()}>{children}</div>
			</section>
		</Pricing02Context.Provider>
	);
}

/** The row above the plans: Pricing02Heading beside Pricing02Aside. */
export function Pricing02Header({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function Pricing02Heading({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-heading"
			className={cn(styles.heading(), className)}
			{...props}
		/>
	);
}

export function Pricing02Eyebrow({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing02();
	return (
		<p
			data-slot="pricing-02-eyebrow"
			className={cn(styles.eyebrow(), className)}
			{...props}
		/>
	);
}

/** Line breaks in the text are kept. */
export function Pricing02Title({ className, ...props }: ComponentProps<"h2">) {
	const { styles } = usePricing02();
	return (
		<h2
			data-slot="pricing-02-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

/** The right-hand column: Pricing02Description and Pricing02Periods. */
export function Pricing02Aside({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-aside"
			className={cn(styles.aside(), className)}
			{...props}
		/>
	);
}

export function Pricing02Description({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing02();
	return (
		<p
			data-slot="pricing-02-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** The billing period toggle; renders nothing with fewer than two periods. */
export function Pricing02Periods({
	label = "Billing period",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { periods, current, setPeriod } = usePricing02();
	if (periods.length < 2) return null;
	return (
		<ToggleGroup
			data-slot="pricing-02-periods"
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

export function Pricing02Plans({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-plans"
			className={cn(styles.plans(), className)}
			{...props}
		/>
	);
}

export interface Pricing02PlanProps {
	/** Tints the panel and fills the button. */
	featured?: boolean;
	className?: string;
	children?: ReactNode;
}

/** One plan card: Pricing02PlanPanel over Pricing02PlanList. */
export function Pricing02Plan({
	featured = false,
	className,
	children,
}: Pricing02PlanProps) {
	const { styles } = usePricing02();
	return (
		<Pricing02PlanContext.Provider value={featured}>
			<Card data-slot="pricing-02-plan" className={cn(styles.plan(), className)}>
				<div aria-hidden className={styles.glow()} />
				{children}
			</Card>
		</Pricing02PlanContext.Provider>
	);
}

/** The top panel: Pricing02PlanName, Pricing02PlanDescription, Pricing02PlanPrice and Pricing02PlanAction. */
export function Pricing02PlanPanel({ className, ...props }: ComponentProps<"div">) {
	const { variant } = usePricing02();
	const featured = useContext(Pricing02PlanContext);
	return (
		<div
			data-slot="pricing-02-plan-panel"
			className={cn(pricing02({ variant, featured }).panel(), className)}
			{...props}
		/>
	);
}

export function Pricing02PlanName({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing02();
	return (
		<p
			data-slot="pricing-02-plan-name"
			className={cn(styles.name(), className)}
			{...props}
		/>
	);
}

export function Pricing02PlanDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing02();
	return (
		<p
			data-slot="pricing-02-plan-description"
			className={cn(styles.blurb(), className)}
			{...props}
		/>
	);
}

/** The price for the chosen period; its digits roll when the period changes. */
export function Pricing02PlanPrice({
	prices,
	className,
}: {
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	className?: string;
}) {
	const { current, currentIndex, moved, styles } = usePricing02();
	const price = current ? (prices[current.value] ?? "") : "";
	const chars = [...price];
	return (
		<div data-slot="pricing-02-plan-price" className={cn(styles.price(), className)}>
			<span className="sr-only">{price}</span>
			<span
				aria-hidden
				className={styles.amount()}
				style={{ "--digit-dir": currentIndex > 0 ? 1 : -1 } as CSSProperties}
			>
				{chars.map((char, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
						key={`${current?.value}-${i}-${char}`}
						data-animate={moved ? "" : undefined}
						className={styles.digit()}
						style={{ "--digit-delay": digitDelay(i, chars.length) } as CSSProperties}
					>
						{char}
					</span>
				))}
			</span>
			{current ? <span className={styles.cadence()}>{current.cadence}</span> : null}
		</div>
	);
}

export interface Pricing02PlanActionProps {
	/** Renders a link; otherwise a button calling `onClick`. */
	href?: string;
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}

/** The plan's button; filled on a featured plan. */
export function Pricing02PlanAction({
	href,
	onClick,
	className,
	children,
}: Pricing02PlanActionProps) {
	const { styles } = usePricing02();
	const featured = useContext(Pricing02PlanContext);
	return (
		<Button
			data-slot="pricing-02-plan-action"
			href={href}
			onClick={onClick}
			variant={featured ? "default" : "outline"}
			className={cn(styles.cta(), className)}
		>
			{children}
			<Icon
				paths={["M5 12l14 0", "M13 18l6 -6", "M13 6l6 6"]}
				className={styles.arrow()}
			/>
		</Button>
	);
}

/** The lower list: an optional Pricing02PlanListLabel, then Pricing02PlanFeatures. */
export function Pricing02PlanList({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-plan-list"
			className={cn(styles.list(), className)}
			{...props}
		/>
	);
}

/** A heading over the features, e.g. "Everything in Starter, plus". */
export function Pricing02PlanListLabel({ className, ...props }: ComponentProps<"p">) {
	const { styles } = usePricing02();
	return (
		<p
			data-slot="pricing-02-plan-list-label"
			className={cn(styles.listLabel(), className)}
			{...props}
		/>
	);
}

export function Pricing02PlanFeatures({ className, ...props }: ComponentProps<"ul">) {
	const { styles } = usePricing02();
	return (
		<ul
			data-slot="pricing-02-plan-features"
			className={cn(styles.features(), className)}
			{...props}
		/>
	);
}

export function Pricing02PlanFeature({
	className,
	children,
	...props
}: ComponentProps<"li">) {
	const { styles } = usePricing02();
	return (
		<li
			data-slot="pricing-02-plan-feature"
			className={cn(styles.feature(), className)}
			{...props}
		>
			<span className={styles.tick()}>
				<Icon paths={["M5 12l5 5l10 -10"]} className="size-3" />
			</span>
			{children}
		</li>
	);
}

/** Small print under the plans; one `<p>` each. */
export function Pricing02Footnotes({ className, ...props }: ComponentProps<"div">) {
	const { styles } = usePricing02();
	return (
		<div
			data-slot="pricing-02-footnotes"
			className={cn(styles.footnotes(), className)}
			{...props}
		/>
	);
}
