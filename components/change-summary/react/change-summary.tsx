import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
} from "react";
import { cn } from "../../lib/cn";
import {
	type ChangeSummaryDirection,
	type ChangeSummaryTone,
	type ChangeSummaryVariant,
	changeSummary,
	changeSummaryTrend,
} from "../variants";

export type { ChangeSummaryDirection, ChangeSummaryTone, ChangeSummaryVariant };

type Ctx = { titleId: string; styles: ReturnType<typeof changeSummary> };
const ChangeSummaryContext = createContext<Ctx | null>(null);

function useChangeSummary(part: string): Ctx {
	const ctx = useContext(ChangeSummaryContext);
	if (!ctx) throw new Error(`${part} must be used inside <ChangeSummary>`);
	return ctx;
}

type Trend = { tone: ChangeSummaryTone; direction: ChangeSummaryDirection };
const ItemContext = createContext<Trend>({ tone: "neutral", direction: "up" });

/** The root: a labelled section holding the header and the list of changes. */
export function ChangeSummary({
	variant = "tray",
	className,
	...props
}: ComponentProps<"section"> & { variant?: ChangeSummaryVariant }) {
	const titleId = useId();
	const styles = changeSummary({ variant });
	return (
		<ChangeSummaryContext.Provider value={{ titleId, styles }}>
			<section
				data-slot="change-summary"
				data-variant={variant}
				aria-labelledby={titleId}
				className={cn(styles.root(), className)}
				{...props}
			/>
		</ChangeSummaryContext.Provider>
	);
}

export function ChangeSummaryHeader({ className, ...props }: ComponentProps<"header">) {
	const { styles } = useChangeSummary("ChangeSummaryHeader");
	return (
		<header
			data-slot="change-summary-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

/** The section's name; `icon` replaces the default lines mark, `null` removes it. */
export function ChangeSummaryTitle({
	icon,
	className,
	children,
	...props
}: ComponentProps<"h2"> & { icon?: ReactNode }) {
	const { titleId, styles } = useChangeSummary("ChangeSummaryTitle");
	return (
		<h2
			data-slot="change-summary-title"
			id={titleId}
			className={cn(styles.title(), className)}
			{...props}
		>
			{icon === undefined ? <LinesIcon /> : icon}
			{children}
		</h2>
	);
}

export function ChangeSummaryPeriod({ className, ...props }: ComponentProps<"span">) {
	const { styles } = useChangeSummary("ChangeSummaryPeriod");
	return (
		<span
			data-slot="change-summary-period"
			className={cn(styles.period(), className)}
			{...props}
		/>
	);
}

export function ChangeSummaryList({ className, ...props }: ComponentProps<"dl">) {
	const { styles } = useChangeSummary("ChangeSummaryList");
	return (
		<dl
			data-slot="change-summary-list"
			className={cn(styles.list(), className)}
			{...props}
		/>
	);
}

/** One metric. `direction` defaults to up for positive and down for negative; neutral shows a dash. */
export function ChangeSummaryItem({
	tone = "neutral",
	direction,
	className,
	...props
}: ComponentProps<"div"> & {
	tone?: ChangeSummaryTone;
	direction?: ChangeSummaryDirection;
}) {
	const { styles } = useChangeSummary("ChangeSummaryItem");
	const trend: Trend = {
		tone,
		direction: direction ?? (tone === "negative" ? "down" : "up"),
	};
	return (
		<ItemContext.Provider value={trend}>
			<div
				data-slot="change-summary-item"
				data-tone={tone}
				className={cn(styles.item(), className)}
				{...props}
			/>
		</ItemContext.Provider>
	);
}

export function ChangeSummaryLabel({ className, ...props }: ComponentProps<"dt">) {
	const { styles } = useChangeSummary("ChangeSummaryLabel");
	return (
		<dt
			data-slot="change-summary-label"
			className={cn(styles.label(), className)}
			{...props}
		/>
	);
}

/** What happened, in words; the trend mark is decorative, so the words carry the direction. */
export function ChangeSummaryChange({
	className,
	children,
	...props
}: ComponentProps<"dd">) {
	const { styles } = useChangeSummary("ChangeSummaryChange");
	const { tone, direction } = useContext(ItemContext);
	return (
		<dd
			data-slot="change-summary-change"
			className={cn(styles.change(), className)}
			{...props}
		>
			<span aria-hidden="true" className={changeSummaryTrend({ tone })}>
				{tone === "neutral" ? <DashIcon /> : <ArrowIcon down={direction === "down"} />}
			</span>
			<span className={styles.changeText()}>{children}</span>
		</dd>
	);
}

function LinesIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<path d="M2.5 4h4M2.5 8h8M6.5 12h7M9.5 4h1" />
		</svg>
	);
}

function ArrowIcon({ down }: { down: boolean }) {
	return (
		<svg
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d={down ? "M6 2.5v7M3 6.5l3 3 3-3" : "M6 9.5v-7M3 5.5l3-3 3 3"} />
		</svg>
	);
}

function DashIcon() {
	return (
		<svg
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<path d="M3 6h6" />
		</svg>
	);
}
