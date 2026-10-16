"use client";

import type { ComponentProps, ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import { ScrollArea } from "../../scroll-area/react/scroll-area";

type ConversationCtx = {
	follow: boolean;
	setFollow: (value: boolean) => void;
	atBottom: boolean;
	setAtBottom: (value: boolean) => void;
	threshold: number;
	viewportRef: React.MutableRefObject<HTMLDivElement | null>;
	scrollingToBottomRef: React.MutableRefObject<boolean>;
	scrollToBottom: (behavior?: ScrollBehavior) => void;
};

const ConversationContext = createContext<ConversationCtx | null>(null);

function useConversation() {
	const ctx = useContext(ConversationContext);
	if (!ctx) throw new Error("Conversation parts must be used inside <Conversation>");
	return ctx;
}

export interface ConversationProps extends Omit<ComponentProps<"div">, "children"> {
	children?: ReactNode;
	/** Auto-follow stays engaged while the reader is within this many px of the bottom. */
	threshold?: number;
}

/** Follows new turns while the reader is already at the bottom, and stops the moment
 * they scroll up: yanking someone back down mid-read is a common transcript bug. */
export function Conversation({
	children,
	threshold = 80,
	className,
	...props
}: ConversationProps) {
	const [follow, setFollow] = useState(true);
	const [atBottom, setAtBottom] = useState(true);
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const scrollingToBottomRef = useRef(false);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
		setFollow(true);
		scrollingToBottomRef.current = behavior === "smooth";
		const el = viewportRef.current;
		if (!el) {
			scrollingToBottomRef.current = false;
			return;
		}
		el.scrollTo({ top: el.scrollHeight, behavior });
	}, []);

	const ctx = useMemo<ConversationCtx>(
		() => ({
			follow,
			setFollow,
			atBottom,
			setAtBottom,
			threshold,
			viewportRef,
			scrollingToBottomRef,
			scrollToBottom,
		}),
		[follow, atBottom, threshold, scrollToBottom],
	);

	return (
		<ConversationContext.Provider value={ctx}>
			<div
				data-slot="conversation"
				data-state={follow ? "following" : "paused"}
				className={cn("relative min-h-0 overflow-hidden", className)}
				{...props}
			>
				{children}
			</div>
		</ConversationContext.Provider>
	);
}

export interface ConversationContentProps {
	children?: ReactNode;
	className?: string;
	transcriptClassName?: string;
	"aria-label"?: string;
}

/** The scrollable region itself: a `role="log"` live region so screen readers announce
 * new turns, wrapping children in a centred transcript column. */
export function ConversationContent({
	children,
	className,
	transcriptClassName,
	"aria-label": ariaLabel = "Conversation",
}: ConversationContentProps) {
	const { follow, setFollow, setAtBottom, threshold, viewportRef, scrollingToBottomRef } =
		useConversation();
	const [scrollable, setScrollable] = useState(false);
	const previousScrollTop = useRef(0);
	const userScrollIntent = useRef(false);
	const transcriptRef = useRef<HTMLDivElement | null>(null);

	const isNearBottom = useCallback(
		(el: HTMLDivElement) => {
			const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
			return remaining <= Math.max(0, threshold);
		},
		[threshold],
	);

	const measure = useCallback(
		(el: HTMLDivElement) => {
			setScrollable(el.scrollHeight - el.clientHeight > 1);
			const nearBottom = isNearBottom(el);
			setAtBottom(nearBottom);
			if (nearBottom) {
				setFollow(true);
				scrollingToBottomRef.current = false;
			}
			return nearBottom;
		},
		[isNearBottom, setAtBottom, setFollow, scrollingToBottomRef],
	);

	const handleScroll = useCallback(
		(el: HTMLDivElement) => {
			const nextScrollTop = el.scrollTop;
			const nearBottom = measure(el);
			if (
				!nearBottom &&
				(userScrollIntent.current ||
					(!scrollingToBottomRef.current &&
						nextScrollTop < previousScrollTop.current - 1))
			) {
				setFollow(false);
				scrollingToBottomRef.current = false;
			}
			previousScrollTop.current = nextScrollTop;
			userScrollIntent.current = false;
		},
		[measure, setFollow, scrollingToBottomRef],
	);

	useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		previousScrollTop.current = el.scrollTop;
		measure(el);

		const observer = new ResizeObserver(() => {
			if (follow) {
				scrollingToBottomRef.current = false;
				el.scrollTop = el.scrollHeight;
			} else {
				measure(el);
			}
		});
		observer.observe(el);
		if (transcriptRef.current) observer.observe(transcriptRef.current);
		return () => observer.disconnect();
	}, [measure, follow, viewportRef, scrollingToBottomRef]);

	// Keep pinned to the bottom while following, without waiting for the next resize tick.
	useEffect(() => {
		const el = viewportRef.current;
		if (!el || !follow || scrollingToBottomRef.current) return;
		el.scrollTop = el.scrollHeight;
	});

	return (
		<ScrollArea
			data-slot="conversation-content"
			data-state={follow ? "following" : "paused"}
			maxHeight="none"
			className={cn("h-full min-h-0", className)}
			viewportRef={(el) => {
				viewportRef.current = el;
			}}
			viewportProps={{
				role: "log",
				"aria-label": ariaLabel,
				"aria-live": "polite",
				"aria-relevant": "additions text",
				tabIndex: scrollable ? 0 : undefined,
				className:
					"[scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring/50",
				onScroll: (event) => handleScroll(event.currentTarget),
				onWheel: () => {
					userScrollIntent.current = true;
				},
				onTouchStart: () => {
					userScrollIntent.current = true;
				},
				onPointerDown: () => {
					userScrollIntent.current = true;
				},
			}}
		>
			<div
				ref={transcriptRef}
				data-slot="conversation-transcript"
				className={cn(
					"mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6",
					transcriptClassName,
				)}
			>
				{children}
			</div>
		</ScrollArea>
	);
}

export interface ConversationEmptyProps {
	icon?: ReactNode;
	title?: string;
	description?: string;
	action?: ReactNode;
	children?: ReactNode;
	className?: string;
}

/** Placeholder shown before the first turn. */
export function ConversationEmpty({
	icon,
	title = "Start a conversation",
	description = "Ask a question or share what you're working on.",
	action,
	children,
	className,
}: ConversationEmptyProps) {
	return (
		<div
			data-slot="conversation-empty"
			className={cn(
				"grid min-h-48 w-full place-items-center px-6 py-10 text-center",
				className,
			)}
		>
			{children ?? (
				<div className="flex max-w-sm flex-col items-center">
					<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
						{icon ?? (
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								aria-hidden
								className="size-[18px]"
							>
								<path
									d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.95L3 20l1.05-3.55A8.4 8.4 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5a8.5 8.5 0 0 1 9 8Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</div>
					{title ? <p className="font-medium text-foreground">{title}</p> : null}
					{description ? (
						<p className="mt-1 max-w-xs text-muted-foreground text-sm leading-relaxed">
							{description}
						</p>
					) : null}
					{action ? <div className="mt-4">{action}</div> : null}
				</div>
			)}
		</div>
	);
}

export interface ConversationScrollButtonProps
	extends Omit<ComponentProps<"button">, "children" | "type" | "onClick"> {
	label?: string;
	onClick?: () => void;
}

/** Appears once the reader has scrolled away from the bottom; scrolling back down
 * re-engages auto-follow. */
export function ConversationScrollButton({
	label = "Scroll to latest message",
	className,
	onClick,
	...props
}: ConversationScrollButtonProps) {
	const { follow, atBottom, scrollToBottom } = useConversation();
	const visible = !follow && !atBottom;
	const labelId = useId();

	return (
		<div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-4">
			<button
				type="button"
				data-slot="conversation-scroll-button"
				data-state={visible ? "visible" : "hidden"}
				aria-labelledby={labelId}
				aria-hidden={!visible}
				disabled={!visible}
				tabIndex={visible ? undefined : -1}
				onClick={() => {
					const reducedMotion = window.matchMedia(
						"(prefers-reduced-motion: reduce)",
					).matches;
					scrollToBottom(reducedMotion ? "auto" : "smooth");
					onClick?.();
				}}
				className={cn(
					"pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-border bg-popover text-foreground shadow-lg transition-[opacity,translate] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] hover:bg-accent motion-reduce:transition-none",
					visible
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-1.5 opacity-0",
					className,
				)}
				{...props}
			>
				<span id={labelId} className="sr-only">
					{label}
				</span>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
					<path
						d="M8 3.5V13M4 9l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</div>
	);
}
