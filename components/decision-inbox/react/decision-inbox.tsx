"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useLayoutEffect,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { type DecisionInboxVariant, decisionInbox } from "../variants";

export type { DecisionInboxVariant };

type Ctx = {
	answers: Record<string, string>;
	collapsed: string[];
	items: string[];
	answer: (item: string, value: string) => void;
	expand: (item: string) => void;
	register: (item: string) => () => void;
	styles: ReturnType<typeof decisionInbox>;
};
const DecisionInboxContext = createContext<Ctx | null>(null);

function useDecisionInbox(part: string): Ctx {
	const ctx = useContext(DecisionInboxContext);
	if (!ctx) throw new Error(`${part} must be used inside <DecisionInbox>`);
	return ctx;
}

type ItemCtx = { value: string; answer?: string; collapsed: boolean };
const ItemContext = createContext<ItemCtx | null>(null);

function useItem(part: string): ItemCtx {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new Error(`${part} must be used inside <DecisionInboxItem>`);
	return ctx;
}

export interface DecisionInboxProps
	extends Omit<ComponentProps<"section">, "defaultValue"> {
	/** Answers so far, by decision. Controlled with onValueChange. */
	value?: Record<string, string>;
	defaultValue?: Record<string, string>;
	onValueChange?: (value: Record<string, string>) => void;
	/** Decisions folded to one line. Controlled with onCollapsedChange. */
	collapsed?: string[];
	defaultCollapsed?: string[];
	onCollapsedChange?: (collapsed: string[]) => void;
	variant?: DecisionInboxVariant;
}

/** The root: answers and folded rows, and the count of decisions placed inside it. */
export function DecisionInbox({
	value: valueProp,
	defaultValue = {},
	onValueChange,
	collapsed: collapsedProp,
	defaultCollapsed = [],
	onCollapsedChange,
	variant = "tray",
	className,
	...props
}: DecisionInboxProps) {
	const [internalAnswers, setAnswers] = useState(defaultValue);
	const [internalCollapsed, setCollapsed] = useState(defaultCollapsed);
	const [items, setItems] = useState<string[]>([]);
	const answers = valueProp ?? internalAnswers;
	const collapsed = collapsedProp ?? internalCollapsed;
	const answer = (item: string, value: string) => {
		const next = { ...answers, [item]: value };
		if (valueProp === undefined) setAnswers(next);
		onValueChange?.(next);
	};
	const expand = (item: string) => {
		const next = collapsed.filter((c) => c !== item);
		if (collapsedProp === undefined) setCollapsed(next);
		onCollapsedChange?.(next);
	};
	const register = useCallback((item: string) => {
		setItems((list) => (list.includes(item) ? list : [...list, item]));
		return () => setItems((list) => list.filter((i) => i !== item));
	}, []);
	const styles = decisionInbox({ variant });
	return (
		<DecisionInboxContext.Provider
			value={{ answers, collapsed, items, answer, expand, register, styles }}
		>
			<section
				data-slot="decision-inbox"
				data-variant={variant}
				className={cn(styles.root(), className)}
				{...props}
			/>
		</DecisionInboxContext.Provider>
	);
}

/** How many decisions wait, announced politely; it turns green at zero. */
export function DecisionInboxHeader({
	label = (open) =>
		open === 0 ? "All caught up" : `${open} ${open === 1 ? "needs" : "need"} your input`,
	className,
	...props
}: Omit<ComponentProps<"header">, "children"> & { label?: (open: number) => string }) {
	const { answers, items, styles } = useDecisionInbox("DecisionInboxHeader");
	const open = items.filter((i) => answers[i] === undefined).length;
	return (
		<header
			data-slot="decision-inbox-header"
			data-clear={open === 0 || undefined}
			tabIndex={-1}
			className={cn(styles.header(), "outline-none", className)}
			{...props}
		>
			{open === 0 ? <DoneIcon /> : <AlertIcon />}
			<span aria-live="polite">{label(open)}</span>
		</header>
	);
}

export function DecisionInboxList({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useDecisionInbox("DecisionInboxList");
	return (
		<div
			data-slot="decision-inbox-list"
			className={cn(styles.list(), className)}
			{...props}
		/>
	);
}

/** One decision, identified by `value`. Once answered it shows the answer, then folds away. */
export function DecisionInboxItem({
	value,
	className,
	...props
}: ComponentProps<"div"> & { value: string }) {
	const { answers, collapsed, register, styles } = useDecisionInbox("DecisionInboxItem");
	useLayoutEffect(() => register(value), [register, value]);
	const answer = answers[value];
	const isCollapsed = collapsed.includes(value);
	return (
		<ItemContext.Provider value={{ value, answer, collapsed: isCollapsed }}>
			<div
				data-slot="decision-inbox-row"
				data-answered={answer !== undefined || undefined}
				inert={answer !== undefined}
				className={styles.row()}
			>
				<div className={styles.rowClip()}>
					<div
						data-slot="decision-inbox-item"
						data-collapsed={isCollapsed || undefined}
						className={cn(styles.item(), className)}
						{...props}
					/>
				</div>
			</div>
		</ItemContext.Provider>
	);
}

/** The question; while folded it is the button that opens the row. */
export function DecisionInboxTitle({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { expand, styles } = useDecisionInbox("DecisionInboxTitle");
	const item = useItem("DecisionInboxTitle");
	if (item.collapsed)
		return (
			<button
				type="button"
				data-slot="decision-inbox-title"
				aria-expanded={false}
				className={cn(styles.title(), className)}
				onClick={() => expand(item.value)}
			>
				{children}
			</button>
		);
	return (
		<p data-slot="decision-inbox-title" className={cn(styles.title(), className)}>
			{children}
		</p>
	);
}

/** Detail and actions; folds open on grid rows when the row expands. */
export function DecisionInboxBody({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { styles } = useDecisionInbox("DecisionInboxBody");
	const item = useItem("DecisionInboxBody");
	return (
		<div
			data-slot="decision-inbox-body"
			data-open={!item.collapsed || undefined}
			inert={item.collapsed}
			className={cn(styles.body(), className)}
		>
			<div className={styles.bodyClip()}>{children}</div>
		</div>
	);
}

export function DecisionInboxDetail({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useDecisionInbox("DecisionInboxDetail");
	return (
		<p
			data-slot="decision-inbox-detail"
			className={cn(styles.detail(), className)}
			{...props}
		/>
	);
}

/** The answers; once one is chosen they give way to it, with a check. */
export function DecisionInboxActions({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { styles } = useDecisionInbox("DecisionInboxActions");
	const item = useItem("DecisionInboxActions");
	return (
		<div data-slot="decision-inbox-actions" className={cn(styles.actions(), className)}>
			{item.answer === undefined ? (
				children
			) : (
				<span data-slot="decision-inbox-done" className={styles.done()}>
					<DoneIcon />
					{item.answer}
				</span>
			)}
		</div>
	);
}

/** One answer; `value` is what the done state reads. Focus moves on to the next open decision. */
export function DecisionInboxAction({
	value,
	primary = false,
	onClick,
	className,
	children,
}: {
	value: string;
	/** The filled button: the answer most people give. */
	primary?: boolean;
	onClick?: () => void;
	className?: string;
	children?: ReactNode;
}) {
	const { answer } = useDecisionInbox("DecisionInboxAction");
	const item = useItem("DecisionInboxAction");
	return (
		<Button
			data-slot="decision-inbox-action"
			variant={primary ? "default" : "outline"}
			size="sm"
			className={className}
			onClick={(event) => {
				const list = event.currentTarget.closest("[data-slot=decision-inbox]");
				const hadFocus = event.currentTarget === document.activeElement;
				answer(item.value, value);
				onClick?.();
				if (!hadFocus || !list) return;
				// After the answered row turns inert, hand focus to the next decision or the status.
				requestAnimationFrame(() => {
					const next = list.querySelector<HTMLElement>(
						"[data-slot=decision-inbox-row]:not([data-answered]) button",
					);
					(
						next ?? list.querySelector<HTMLElement>("[data-slot=decision-inbox-header]")
					)?.focus();
				});
			}}
		>
			{children ?? value}
		</Button>
	);
}

/** Shown once every decision is answered, after the last one folds away. */
export function DecisionInboxEmpty({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { answers, items, styles } = useDecisionInbox("DecisionInboxEmpty");
	const shown = items.every((i) => answers[i] !== undefined);
	return (
		<p
			data-slot="decision-inbox-empty"
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

function AlertIcon() {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true">
			<path
				d="M6.7 2.3a1.5 1.5 0 0 1 2.6 0l5.4 9.4A1.5 1.5 0 0 1 13.4 14H2.6a1.5 1.5 0 0 1-1.3-2.3Z"
				fill="currentColor"
			/>
			<path
				d="M8 5.6v3.6"
				stroke="var(--background)"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="8" cy="11.4" r="0.85" fill="var(--background)" />
		</svg>
	);
}

function DoneIcon() {
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
