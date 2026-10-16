"use client";

import {
	type CSSProperties,
	type KeyboardEvent,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/react/cn";
import {
	type CardDecision,
	createCardDeck,
	type DeckCard,
	type DeckExit,
	type DeckPoint,
	type DeckReturn,
	VISIBLE,
} from "./deck";
import { type CardStackSize, type CardStackVariant, cardStack } from "./variants";

export type { CardDecision, CardStackSize, CardStackVariant };

export interface CardStackProps<T> {
	items: T[];
	getKey: (item: T) => string;
	/** A short name used in the card's accessible label and announcements, e.g. "Lisbon". */
	getLabel: (item: T) => string;
	renderCard: (item: T) => ReactNode;
	onDecide?: (item: T, decision: CardDecision) => void;
	onUndo?: (item: T, decision: CardDecision) => void;
	onReset?: () => void;
	/** Action names for each side, on the buttons and the stamps shown while dragging. */
	labels?: { left: string; right: string };
	/** Past tense of each action for announcements, e.g. "skipped" and "shortlisted". */
	outcomes?: { left: string; right: string };
	/** Accessible name of the stack. */
	label?: string;
	/** Shown once every card is decided; receives a function that brings all cards back. */
	renderEmpty?: (reset: () => void) => ReactNode;
	/** Cards behind peek below (`stack`), splay to the side (`fan`) or hide under the top card (`flat`). */
	variant?: CardStackVariant;
	size?: CardStackSize;
	/** Show the decision and undo buttons; drag and keys work either way. */
	buttons?: boolean;
	/** Position of the top card in `items`. Controlled with onIndexChange. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	className?: string;
}

/** A release faster than this (px/s) throws the card even when it has moved only a little. */
const FLICK = 500;

const Icon = {
	x: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d="m4 4 8 8M12 4l-8 8"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
			/>
		</svg>
	),
	check: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d="M3.5 8.4 6.4 11 12.5 4.5"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	undo: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d="M3 8a5 5 0 1 0 1.5-3.5M3 2.5v2.5h2.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
};

/**
 * A deck reviewed one card at a time: drag or flick the top card left or right, or use the buttons
 * and arrow keys. Undo brings the last card back from where it left the screen.
 */
export function CardStack<T>({
	items,
	getKey,
	getLabel,
	renderCard,
	onDecide,
	onUndo,
	onReset,
	labels = { left: "Pass", right: "Keep" },
	outcomes,
	label = "Cards",
	renderEmpty,
	variant = "stack",
	size = "default",
	buttons = true,
	index,
	defaultIndex = 0,
	onIndexChange,
	className,
}: CardStackProps<T>) {
	const hintId = useId();
	const [ownIndex, setOwnIndex] = useState(defaultIndex);
	const position = Math.min(items.length, Math.max(0, index ?? ownIndex));
	const setPosition = (next: number) => {
		if (index === undefined) setOwnIndex(next);
		onIndexChange?.(next);
	};
	const [history, setHistory] = useState<{ key: string; decision: CardDecision }[]>([]);
	const [flying, setFlying] = useState<string[]>([]);
	const [returning, setReturning] = useState<Record<string, DeckReturn>>({});
	const [message, setMessage] = useState("");
	const stageRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createCardDeck> | null>(null);
	// Where each thrown card left the screen; only undo and start over read it, so it is a ref.
	const exits = useRef<Record<string, DeckExit>>({});
	const top = items[position];
	const remaining = Math.max(0, items.length - position);

	function decide(decision: CardDecision) {
		if (!top) return;
		const key = getKey(top);
		setPosition(position + 1);
		setHistory([...history, { key, decision }]);
		setFlying((current) => [...current, key]);
		setReturning({});
		const left = remaining - 1;
		const verdict = outcomes ? ` ${outcomes[decision]}` : `: ${labels[decision]}`;
		setMessage(
			`${getLabel(top)}${verdict}. ${left ? `${left} left.` : "All cards reviewed."}`,
		);
		onDecide?.(top, decision);
	}

	function undo() {
		const last = history[history.length - 1];
		const item = last && items.find((entry) => getKey(entry) === last.key);
		if (!last || !item) return;
		const exit = exits.current[last.key];
		setPosition(position - 1);
		setHistory(history.slice(0, -1));
		setFlying((current) => current.filter((key) => key !== last.key));
		setReturning(exit ? { [last.key]: { ...exit, delay: 0 } } : {});
		setMessage(`${getLabel(item)} restored.`);
		onUndo?.(item, last.decision);
	}

	function reset() {
		if (!history.length) return;
		// The deck deals itself back: the card that will sit deepest returns first, the top card last.
		const count = Math.min(VISIBLE, items.length);
		const back: Record<string, DeckReturn> = {};
		items.slice(0, count).forEach((item, index) => {
			const key = getKey(item);
			const exit = exits.current[key];
			if (exit && index < position)
				back[key] = { ...exit, delay: (count - 1 - index) * 0.06 };
		});
		setPosition(0);
		setHistory([]);
		setFlying([]);
		setReturning(back);
		setMessage("All cards are back in the stack.");
		onReset?.();
	}

	const release = (
		key: string,
		offset: DeckPoint,
		velocity: DeckPoint,
		width: number,
	) => {
		const direction = Math.sign(offset.x);
		if (!direction || !top || getKey(top) !== key) return false;
		const flick =
			Math.abs(velocity.x) > FLICK &&
			Math.sign(velocity.x) === direction &&
			Math.abs(offset.x) > 12;
		const far =
			Math.abs(offset.x) > Math.min(width * 0.35, 140) &&
			!(Math.sign(velocity.x) === -direction && Math.abs(velocity.x) > 300);
		if (!flick && !far) return false;
		decide(direction > 0 ? "right" : "left");
		return true;
	};
	const options = {
		onRelease: release,
		onThrown: (key: string, exit: DeckExit) => {
			exits.current[key] = exit;
		},
		onGone: (key: string) =>
			setFlying((current) => current.filter((entry) => entry !== key)),
		layout: variant,
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	// Created in a layout effect ahead of the sync below, so the first render is reconciled too.
	useLayoutEffect(() => {
		if (!stageRef.current) return;
		engine.current = createCardDeck(stageRef.current, optionsRef.current);
		return () => {
			engine.current?.destroy();
			engine.current = null;
		};
	}, []);

	const decided = new Map(history.map((entry) => [entry.key, entry.decision]));
	const windowKeys = new Set(items.slice(position, position + VISIBLE).map(getKey));
	const rendered = items.filter(
		(item) => windowKeys.has(getKey(item)) || flying.includes(getKey(item)),
	);
	const empty = position >= items.length && flying.length === 0;
	const entries = rendered.map((item) => {
		const key = getKey(item);
		const decision = decided.get(key) ?? null;
		const card: DeckCard = {
			key,
			depth: decision ? 0 : items.indexOf(item) - position,
			decision,
			returnFrom: returning[key],
		};
		return { item, card };
	});
	const deck = entries.map((entry) => entry.card);

	useLayoutEffect(() => {
		engine.current?.update(options);
		engine.current?.sync(deck);
	});

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.target !== event.currentTarget) return;
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			event.preventDefault();
			decide(event.key === "ArrowRight" ? "right" : "left");
		} else if (
			event.key === "Backspace" ||
			((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z")
		) {
			event.preventDefault();
			undo();
		}
	}

	const s = cardStack({ variant, size });
	return (
		<div data-slot="card-stack" className={cn(s.root(), className)}>
			{/* biome-ignore lint/a11y/useSemanticElements: a fieldset would imply form controls; this groups cards. */}
			<div
				ref={stageRef}
				className={s.stage()}
				role="group"
				aria-roledescription="card stack"
				aria-label={label}
				aria-describedby={hintId}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: the stack takes focus so arrow keys decide the top card.
				tabIndex={0}
				onKeyDown={onKeyDown}
			>
				{entries.map(({ item, card }) => {
					const index = items.indexOf(item);
					const interactive = !card.decision && card.depth === 0;
					return (
						<div
							key={card.key}
							data-stack-slot={card.key}
							className={s.slot()}
							style={
								{
									"--d": card.depth,
									zIndex: card.decision
										? 20 + flying.indexOf(card.key)
										: VISIBLE - card.depth,
								} as CSSProperties
							}
							aria-hidden={interactive ? undefined : true}
							inert={!interactive}
						>
							{/* biome-ignore lint/a11y/useSemanticElements: a card, not a set of form controls. */}
							<div
								data-stack-card=""
								data-top={interactive ? "" : undefined}
								className={s.card()}
								role="group"
								aria-label={
									interactive
										? `${getLabel(item)}, ${index + 1} of ${items.length}`
										: undefined
								}
							>
								<div className={s.face()}>
									{renderCard(item)}
									<span data-stack-shade="" className={s.shade()} aria-hidden />
								</div>
								<span
									data-stack-stamp="right"
									data-side="right"
									className={s.stamp()}
									aria-hidden
								>
									{Icon.check}
									{labels.right}
								</span>
								<span
									data-stack-stamp="left"
									data-side="left"
									className={s.stamp()}
									aria-hidden
								>
									{Icon.x}
									{labels.left}
								</span>
							</div>
						</div>
					);
				})}
				{empty ? (
					<div className={s.empty()}>
						{renderEmpty ? (
							renderEmpty(reset)
						) : (
							<>
								<p className={s.emptyTitle()}>All cards reviewed</p>
								<Button variant="outline" onClick={reset}>
									{Icon.undo}
									Start over
								</Button>
							</>
						)}
					</div>
				) : null}
			</div>
			{buttons ? (
				<div className={s.controls()}>
					<Button
						variant="outline"
						aria-disabled={!top || undefined}
						onClick={() => top && decide("left")}
					>
						{Icon.x}
						{labels.left}
					</Button>
					<Button
						variant="ghost"
						aria-disabled={!history.length || undefined}
						onClick={undo}
					>
						{Icon.undo}
						<span className={s.undoLabel()}>Undo</span>
					</Button>
					<Button
						aria-disabled={!top || undefined}
						onClick={() => top && decide("right")}
					>
						{Icon.check}
						{labels.right}
					</Button>
				</div>
			) : null}
			<p id={hintId} className="sr-only">
				Drag the top card, or use the left and right arrow keys to{" "}
				{labels.left.toLowerCase()} or {labels.right.toLowerCase()} it. Backspace undoes
				the last decision.
			</p>
			<p className="sr-only" role="status" aria-live="polite">
				{message}
			</p>
		</div>
	);
}
