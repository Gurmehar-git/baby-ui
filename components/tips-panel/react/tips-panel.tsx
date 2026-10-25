"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { type TipsPanelVariant, tipsPanel } from "../variants";

export type { TipsPanelVariant };

type Ctx = {
	titleId: string;
	done: string[];
	tips: string[];
	markDone: (tip: string) => void;
	register: (tip: string) => () => void;
	styles: ReturnType<typeof tipsPanel>;
};
const TipsPanelContext = createContext<Ctx | null>(null);

function useTipsPanel(part: string): Ctx {
	const ctx = useContext(TipsPanelContext);
	if (!ctx) throw new Error(`${part} must be used inside <TipsPanel>`);
	return ctx;
}

const TipContext = createContext<string | null>(null);

function useTip(part: string): string {
	const tip = useContext(TipContext);
	if (tip === null) throw new Error(`${part} must be used inside <TipsPanelTip>`);
	return tip;
}

export interface TipsPanelProps extends Omit<ComponentProps<"section">, "defaultValue"> {
	/** Ids of the tips already taken. Controlled with onValueChange. */
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: TipsPanelVariant;
}

/** The root: which tips are done, and the count of tips placed inside it. */
export function TipsPanel({
	value: valueProp,
	defaultValue = [],
	onValueChange,
	variant = "tray",
	className,
	...props
}: TipsPanelProps) {
	const titleId = useId();
	const [internal, setInternal] = useState(defaultValue);
	const [tips, setTips] = useState<string[]>([]);
	const done = valueProp ?? internal;
	const markDone = (tip: string) => {
		if (done.includes(tip)) return;
		const next = [...done, tip];
		if (valueProp === undefined) setInternal(next);
		onValueChange?.(next);
	};
	const register = useCallback((tip: string) => {
		setTips((list) => (list.includes(tip) ? list : [...list, tip]));
		return () => setTips((list) => list.filter((t) => t !== tip));
	}, []);
	const styles = tipsPanel({ variant });
	return (
		<TipsPanelContext.Provider
			value={{ titleId, done, tips, markDone, register, styles }}
		>
			<section
				data-slot="tips-panel"
				data-variant={variant}
				aria-labelledby={titleId}
				className={cn(styles.root(), className)}
				{...props}
			/>
		</TipsPanelContext.Provider>
	);
}

export function TipsPanelHeader({ className, ...props }: ComponentProps<"header">) {
	const { styles } = useTipsPanel("TipsPanelHeader");
	return (
		<header
			data-slot="tips-panel-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function TipsPanelTitle({ className, ...props }: ComponentProps<"h2">) {
	const { titleId, styles } = useTipsPanel("TipsPanelTitle");
	return (
		<h2
			data-slot="tips-panel-title"
			id={titleId}
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

/** How many tips are done, announced politely as it changes. */
export function TipsPanelProgress({
	label = (done, total) => `${done}/${total} done`,
	className,
	...props
}: Omit<ComponentProps<"span">, "children"> & {
	label?: (done: number, total: number) => string;
}) {
	const { done, tips, styles } = useTipsPanel("TipsPanelProgress");
	const count = tips.filter((t) => done.includes(t)).length;
	return (
		<span
			data-slot="tips-panel-progress"
			aria-live="polite"
			className={cn(styles.progress(), className)}
			{...props}
		>
			{label(count, tips.length)}
		</span>
	);
}

/** The scrolling card that holds the grid; `--tips-panel-max-height` sets where it scrolls. */
export function TipsPanelContent({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useTipsPanel("TipsPanelContent");
	return (
		<div
			data-slot="tips-panel-content"
			className={cn(styles.body(), className)}
			{...props}
		/>
	);
}

export function TipsPanelGrid({ className, ...props }: ComponentProps<"ul">) {
	const { styles } = useTipsPanel("TipsPanelGrid");
	return (
		<ul data-slot="tips-panel-grid" className={cn(styles.grid(), className)} {...props} />
	);
}

/** One tip, identified by `value`; it counts toward the progress while mounted. */
export function TipsPanelTip({
	value,
	className,
	...props
}: ComponentProps<"li"> & { value: string }) {
	const { done, register, styles } = useTipsPanel("TipsPanelTip");
	useLayoutEffect(() => register(value), [register, value]);
	return (
		<TipContext.Provider value={value}>
			<li
				data-slot="tips-panel-tip"
				data-done={done.includes(value) || undefined}
				className={cn(styles.tip(), className)}
				{...props}
			/>
		</TipContext.Provider>
	);
}

export function TipsPanelTipTitle({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useTipsPanel("TipsPanelTipTitle");
	return (
		<p
			data-slot="tips-panel-tip-title"
			className={cn(styles.tipTitle(), className)}
			{...props}
		/>
	);
}

export function TipsPanelTipDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useTipsPanel("TipsPanelTipDescription");
	return (
		<p
			data-slot="tips-panel-tip-description"
			className={cn(styles.tipDescription(), className)}
			{...props}
		/>
	);
}

/** The tip's one action: marks it done, then runs `onClick`. Once done it reads `doneLabel`. */
export function TipsPanelAction({
	primary = false,
	doneLabel = "Done",
	loading,
	disabled,
	onClick,
	className,
	children,
}: {
	/** The dark button; use it on the one tip that matters most. */
	primary?: boolean;
	doneLabel?: string;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}) {
	const { done, markDone, styles } = useTipsPanel("TipsPanelAction");
	const tip = useTip("TipsPanelAction");
	const status = useRef<HTMLSpanElement>(null);
	const hadFocus = useRef(false);
	const isDone = done.includes(tip);

	// The button leaves the DOM when taken; focus follows to the status so keyboard users stay put.
	useEffect(() => {
		if (isDone && hadFocus.current) status.current?.focus();
	}, [isDone]);

	if (isDone)
		return (
			<span
				ref={status}
				role="status"
				tabIndex={-1}
				data-slot="tips-panel-done"
				className={styles.done()}
			>
				<CheckIcon />
				{doneLabel}
			</span>
		);
	return (
		<Button
			data-slot="tips-panel-action"
			variant={primary ? "default" : "outline"}
			size="sm"
			className={className}
			loading={loading}
			disabled={disabled}
			onClick={(event) => {
				hadFocus.current = event.currentTarget === document.activeElement;
				markDone(tip);
				onClick?.();
			}}
		>
			{children}
		</Button>
	);
}

export function TipsPanelFooter({ className, ...props }: ComponentProps<"footer">) {
	const { styles } = useTipsPanel("TipsPanelFooter");
	return (
		<footer
			data-slot="tips-panel-footer"
			className={cn(styles.footer(), className)}
			{...props}
		/>
	);
}

function CheckIcon() {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<circle cx="8" cy="8" r="7" fill="currentColor" />
			<path
				d="m5 8.2 2 2 4-4.2"
				fill="none"
				stroke="var(--background)"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
