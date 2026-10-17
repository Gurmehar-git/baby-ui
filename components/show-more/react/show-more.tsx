"use client";

import {
	type ComponentProps,
	createContext,
	type RefObject,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { showMore } from "../variants";

const styles = showMore();

type Metrics = { lineHeight: number; fullHeight: number };

type ShowMoreState = {
	lines: number;
	label: string;
	regionId: string;
	region: RefObject<HTMLDivElement | null>;
	open: boolean;
	expandable: boolean;
	scrollable: boolean;
	height?: number;
	setMetrics: (metrics: Metrics) => void;
	toggle: () => void;
};

const ShowMoreContext = createContext<ShowMoreState | null>(null);

function useShowMore() {
	const state = useContext(ShowMoreContext);
	if (!state) throw new Error("ShowMore parts must be rendered inside a ShowMore.");
	return state;
}

export interface ShowMoreProps extends ComponentProps<"div"> {
	/** Lines visible when collapsed. */
	lines?: number;
	/** Cap on the expanded height in pixels; past it the region scrolls. */
	maxHeight?: number;
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** The region's accessible name once it scrolls. */
	label?: string;
}

/** Clamps ShowMoreContent to `lines`; ShowMoreTrigger appears only when the content overflows. */
export function ShowMore({
	lines = 3,
	maxHeight = 320,
	expanded: expandedProp,
	defaultExpanded = false,
	onExpandedChange,
	label = "Details",
	className,
	...props
}: ShowMoreProps) {
	const regionId = useId();
	const region = useRef<HTMLDivElement>(null);
	const [internal, setInternal] = useState(defaultExpanded);
	const [metrics, setMetrics] = useState<Metrics>();
	const expanded = expandedProp ?? internal;

	const expandable = metrics
		? metrics.fullHeight - metrics.lineHeight * lines > 1
		: false;
	const open = expanded && expandable;
	const scrollable = open && metrics !== undefined && metrics.fullHeight > maxHeight;
	const height = metrics
		? open
			? Math.min(metrics.fullHeight, maxHeight)
			: Math.min(metrics.lineHeight * lines, metrics.fullHeight)
		: undefined;

	const state: ShowMoreState = {
		lines,
		label,
		regionId,
		region,
		open,
		expandable,
		scrollable,
		height,
		setMetrics,
		toggle: () => {
			if (open) region.current?.scrollTo({ top: 0 });
			const next = !expanded;
			if (expandedProp === undefined) setInternal(next);
			onExpandedChange?.(next);
		},
	};

	return (
		<ShowMoreContext.Provider value={state}>
			<div
				data-slot="show-more"
				data-state={open ? "open" : "closed"}
				className={cn(styles.root(), className)}
				{...props}
			/>
		</ShowMoreContext.Provider>
	);
}

/** The clamped region, with a veil at the bottom while there is more to read. */
export function ShowMoreContent({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	const {
		lines,
		label,
		regionId,
		region,
		open,
		expandable,
		scrollable,
		height,
		setMetrics,
	} = useShowMore();
	const content = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = content.current;
		if (!el) return;
		const measure = () => {
			const computed = getComputedStyle(el);
			const parsed = Number.parseFloat(computed.lineHeight);
			setMetrics({
				lineHeight: Number.isFinite(parsed)
					? parsed
					: Number.parseFloat(computed.fontSize) * 1.5,
				fullHeight: el.scrollHeight,
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, [setMetrics]);

	// role and aria-label have to arrive together, or neither is valid on the div.
	const regionRole = scrollable
		? { role: "region" as const, "aria-label": label, tabIndex: 0 }
		: {};

	return (
		<div className={cn(styles.content(), className)} {...props}>
			<div
				data-slot="show-more-content"
				ref={region}
				id={regionId}
				{...regionRole}
				style={{
					height: height === undefined ? undefined : `${height}px`,
					maxHeight: height === undefined ? `${lines}lh` : undefined,
					overflowY: scrollable ? "auto" : "hidden",
					scrollbarGutter: scrollable ? "stable" : undefined,
				}}
				className={styles.region()}
			>
				<div ref={content}>{children}</div>
			</div>
			<div
				data-slot="show-more-fade"
				aria-hidden
				data-on={expandable && (!open || scrollable)}
				className={styles.fade()}
			/>
		</div>
	);
}

export interface ShowMoreTriggerProps
	extends Omit<ComponentProps<"button">, "children" | "onClick"> {
	moreLabel?: string;
	lessLabel?: string;
}

/** The expander; renders nothing while the content fits. */
export function ShowMoreTrigger({
	moreLabel = "Show more",
	lessLabel = "Show less",
	className,
	...props
}: ShowMoreTriggerProps) {
	const { regionId, open, expandable, toggle } = useShowMore();
	if (!expandable) return null;
	return (
		<button
			data-slot="show-more-trigger"
			type="button"
			{...props}
			onClick={toggle}
			aria-expanded={open}
			aria-controls={regionId}
			className={cn(styles.trigger(), className)}
		>
			{open ? lessLabel : moreLabel}
			<svg
				viewBox="0 0 12 12"
				fill="none"
				aria-hidden
				data-on={open}
				className={styles.chevron()}
			>
				<path
					d="m2.5 4.25 3.5 3.5 3.5-3.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}
