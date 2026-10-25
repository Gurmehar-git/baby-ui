"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { NOTIFICATION_PATTERNS, type StackPlace, stackLayout } from "../patterns";
import {
	type NotificationPatternName,
	type NotificationStackVariant,
	notificationStack,
} from "../variants";

export type { NotificationPatternName, NotificationStackVariant };

type Layout = { places: Record<string, StackPlace>; height: number };
type Ctx = {
	dismissed: string[];
	layout: Layout | null;
	dismiss: (item: string, from: HTMLElement) => void;
	styles: ReturnType<typeof notificationStack>;
};
const NotificationStackContext = createContext<Ctx | null>(null);

function useStack(part: string): Ctx {
	const ctx = useContext(NotificationStackContext);
	if (!ctx) throw new Error(`${part} must be used inside <NotificationStack>`);
	return ctx;
}

type ItemCtx = { value: string; titleId: string };
const ItemContext = createContext<ItemCtx | null>(null);

function useItem(part: string): ItemCtx {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new Error(`${part} must be used inside <NotificationStackItem>`);
	return ctx;
}

const ITEMS = ":scope > [data-slot=notification-stack-item]";

export interface NotificationStackProps
	extends Omit<ComponentProps<"section">, "defaultValue"> {
	/** Dismissed notices, by value. Controlled with onValueChange. */
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: NotificationStackVariant;
}

/** The root: which notices are dismissed, and where each card sits in the stack. */
export function NotificationStack({
	value: valueProp,
	defaultValue = [],
	onValueChange,
	variant = "elevated",
	className,
	style,
	"aria-label": ariaLabel = "Notifications",
	...props
}: NotificationStackProps) {
	const root = useRef<HTMLElement>(null);
	const [internal, setInternal] = useState(defaultValue);
	const [layout, setLayout] = useState<Layout | null>(null);
	const dismissed = valueProp ?? internal;
	const latest = useRef(dismissed);
	latest.current = dismissed;

	const measure = useCallback(() => {
		const el = root.current;
		if (!el) return;
		const cards = [...el.querySelectorAll<HTMLElement>(ITEMS)];
		const order = cards.map((card) => card.dataset.value ?? "");
		const heights = Object.fromEntries(
			cards.map((card) => [card.dataset.value, card.offsetHeight]),
		);
		const next = stackLayout(order, latest.current, heights);
		setLayout((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
	}, []);

	useLayoutEffect(() => {
		void dismissed;
		measure();
	}, [dismissed, measure]);

	useLayoutEffect(() => {
		const el = root.current;
		if (!el) return;
		const resize = new ResizeObserver(measure);
		const watch = () => {
			resize.disconnect();
			for (const card of el.querySelectorAll(ITEMS)) resize.observe(card);
			measure();
		};
		const children = new MutationObserver(watch);
		children.observe(el, { childList: true });
		watch();
		return () => {
			resize.disconnect();
			children.disconnect();
		};
	}, [measure]);

	const dismiss = (item: string, from: HTMLElement) => {
		const next = dismissed.includes(item) ? dismissed : [...dismissed, item];
		const hadFocus = from === document.activeElement;
		if (valueProp === undefined) setInternal(next);
		onValueChange?.(next);
		if (!hadFocus) return;
		// The next card comes to the front; its dismiss button takes focus, or the stack does.
		requestAnimationFrame(() => {
			const front = root.current?.querySelector<HTMLElement>(
				"[data-slot=notification-stack-item]:not([data-behind]):not([data-leaving]) [data-slot=notification-stack-dismiss]",
			);
			(front ?? root.current)?.focus();
		});
	};

	const styles = notificationStack({ variant });
	const anyShown = layout ? Object.values(layout.places).some((p) => p.depth >= 0) : true;
	return (
		<NotificationStackContext.Provider value={{ dismissed, layout, dismiss, styles }}>
			<section
				ref={root}
				data-slot="notification-stack"
				data-variant={variant}
				aria-label={ariaLabel}
				tabIndex={-1}
				className={cn(styles.root(), className)}
				style={layout && anyShown ? { height: layout.height, ...style } : style}
				{...props}
			/>
		</NotificationStackContext.Provider>
	);
}

/** One notice, identified by `value`. Behind the front card only its edge shows. */
export function NotificationStackItem({
	value,
	className,
	children,
	...props
}: Omit<ComponentProps<"article">, "value"> & { value: string }) {
	const { dismissed, layout, styles } = useStack("NotificationStackItem");
	const titleId = useId();
	const leaving = dismissed.includes(value);
	const place = layout?.places[value];
	const behind = !leaving && (place?.depth ?? 0) > 0;
	const placed =
		place && !leaving && place.depth >= 0
			? {
					translate: `0 ${place.y}px`,
					scale: `${place.scale}`,
					zIndex: 10 - place.depth,
					opacity: place.depth > 2 ? 0 : undefined,
				}
			: { zIndex: leaving ? 11 : undefined };
	return (
		<ItemContext.Provider value={{ value, titleId }}>
			<article
				data-slot="notification-stack-item"
				data-value={value}
				data-behind={behind || undefined}
				data-leaving={leaving || undefined}
				aria-labelledby={titleId}
				aria-hidden={behind || leaving || undefined}
				inert={behind || leaving}
				className={cn(styles.item(), className)}
				style={placed}
				{...props}
			>
				{children}
			</article>
		</ItemContext.Provider>
	);
}

/** Quiet line art in the card's top-right corner, fading out towards the text. */
export function NotificationStackPattern({
	pattern = "orbit",
	className,
}: {
	pattern?: NotificationPatternName;
	className?: string;
}) {
	const { styles } = useStack("NotificationStackPattern");
	const art = NOTIFICATION_PATTERNS[pattern];
	return (
		<svg
			viewBox="0 0 220 160"
			aria-hidden="true"
			className={cn(styles.pattern(), className)}
		>
			{art.lines.map((d) => (
				<path key={d} d={d} />
			))}
			{art.rects.map((r) => (
				<rect key={`${r.x}-${r.y}`} {...r} className={styles.patternFill()} />
			))}
			{art.circles.map((c) => (
				<circle
					key={`${c.cx}-${c.cy}-${c.r}`}
					cx={c.cx}
					cy={c.cy}
					r={c.r}
					className={c.dot ? styles.patternDot() : undefined}
				/>
			))}
		</svg>
	);
}

export function NotificationStackBody({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useStack("NotificationStackBody");
	return (
		<div
			data-slot="notification-stack-body"
			className={cn(styles.body(), className)}
			{...props}
		/>
	);
}

export function NotificationStackHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useStack("NotificationStackHeader");
	return (
		<div
			data-slot="notification-stack-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

/** The small label in the corner, e.g. "Notice". */
export function NotificationStackBadge({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { styles } = useStack("NotificationStackBadge");
	return (
		<Badge variant="outline" size="sm" className={cn(styles.badge(), className)}>
			{children}
		</Badge>
	);
}

/** Dismisses its notice; the next one moves to the front. */
export function NotificationStackDismiss({
	label = "Dismiss",
	className,
}: {
	/** Prefixed to the notice's title for screen readers. */
	label?: string;
	className?: string;
}) {
	const { dismiss, styles } = useStack("NotificationStackDismiss");
	const { value, titleId } = useItem("NotificationStackDismiss");
	return (
		<button
			type="button"
			data-slot="notification-stack-dismiss"
			aria-label={label}
			aria-describedby={titleId}
			className={cn(styles.dismiss(), className)}
			onClick={(event) => dismiss(value, event.currentTarget)}
		>
			<svg
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<path d="m4 4 8 8M12 4l-8 8" />
			</svg>
		</button>
	);
}

export function NotificationStackTitle({ className, ...props }: ComponentProps<"h3">) {
	const { styles } = useStack("NotificationStackTitle");
	const { titleId } = useItem("NotificationStackTitle");
	return (
		<h3
			data-slot="notification-stack-title"
			id={titleId}
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function NotificationStackDescription({
	className,
	...props
}: ComponentProps<"p">) {
	const { styles } = useStack("NotificationStackDescription");
	return (
		<p
			data-slot="notification-stack-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

export function NotificationStackActions({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useStack("NotificationStackActions");
	return (
		<div
			data-slot="notification-stack-actions"
			className={cn(styles.actions(), className)}
			{...props}
		/>
	);
}

/** Shown once every notice is dismissed. */
export function NotificationStackEmpty({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { layout, styles } = useStack("NotificationStackEmpty");
	const shown = layout ? Object.values(layout.places).every((p) => p.depth < 0) : false;
	return (
		<p
			data-slot="notification-stack-empty"
			data-shown={shown || undefined}
			aria-hidden={!shown}
			className={cn(styles.empty(), className)}
		>
			<span className={styles.emptyClip()}>
				<span className={styles.emptyText()}>{children}</span>
			</span>
		</p>
	);
}

/** A link or button for the notice; `external` opens a link in a new tab with an arrow. */
export function NotificationStackAction({
	href,
	external = false,
	onClick,
	className,
	children,
}: {
	href?: string;
	external?: boolean;
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}) {
	if (href)
		return (
			<Button
				href={href}
				variant="outline"
				size="sm"
				className={className}
				onClick={onClick}
				{...(external ? { target: "_blank", rel: "noreferrer" } : {})}
			>
				{children}
				{external ? (
					<svg
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M5 11 11 5M6 5h5v5" />
					</svg>
				) : null}
			</Button>
		);
	return (
		<Button variant="outline" size="sm" className={className} onClick={onClick}>
			{children}
		</Button>
	);
}
