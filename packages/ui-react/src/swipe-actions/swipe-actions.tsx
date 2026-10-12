"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { cn } from "../lib/cn";
import {
	createSwipeGroup,
	createSwipeRow,
	type SwipeGroup,
	type SwipeSide,
} from "./swipe";
import {
	type SwipeActionsSize,
	type SwipeActionsVariant,
	swipeActions,
} from "./variants";

export type { SwipeActionsSize, SwipeActionsVariant };

export type SwipeAction = {
	label: string;
	icon: ReactNode;
	/** Fill of the revealed action; pair `destructive` with a label that names the result. */
	tone?: "default" | "primary" | "destructive";
	/** Runs on a full swipe, a tap on the revealed action, or the menu. Remove the item here unless `keepRow`. */
	onSelect: () => void;
	/** The row springs home after the action instead of sliding away, e.g. Mark as unread. */
	keepRow?: boolean;
};

type ListContext = { group: SwipeGroup | null; size: SwipeActionsSize };
const SwipeContext = createContext<ListContext>({ group: null, size: "default" });

export interface SwipeActionsProps {
	/** Accessible name of the list, e.g. "Inbox". */
	label: string;
	variant?: SwipeActionsVariant;
	size?: SwipeActionsSize;
	children: ReactNode;
	className?: string;
}

/**
 * A list whose rows reveal actions on a horizontal swipe, like a mail inbox. One row stays open
 * at a time; every row also has a More actions menu with the same actions.
 */
export function SwipeActions({
	label,
	variant = "default",
	size = "default",
	children,
	className,
}: SwipeActionsProps) {
	const [group, setGroup] = useState<SwipeGroup | null>(null);
	useEffect(() => {
		const created = createSwipeGroup();
		setGroup(created);
		return () => created.destroy();
	}, []);
	const s = swipeActions({ variant, size });
	return (
		<SwipeContext.Provider value={{ group, size }}>
			<div data-slot="swipe-actions" className={cn(s.root(), className)}>
				<ul aria-label={label} className={s.list()}>
					{children}
				</ul>
			</div>
		</SwipeContext.Provider>
	);
}

export interface SwipeActionsRowProps {
	/** Names the row in its menu button, e.g. the message subject. */
	label: string;
	/** Actions under the left edge; the first commits on a full swipe right. */
	leading?: SwipeAction[];
	/** Actions under the right edge; the last commits on a full swipe left. */
	trailing?: SwipeAction[];
	/** Lets a long swipe commit the outermost action without a tap. */
	fullSwipe?: boolean;
	children: ReactNode;
	className?: string;
}

export function SwipeActionsRow({
	label,
	leading = [],
	trailing = [],
	fullSwipe = true,
	children,
	className,
}: SwipeActionsRowProps) {
	const { group, size } = useContext(SwipeContext);
	const rowRef = useRef<HTMLLIElement>(null);
	const engine = useRef<ReturnType<typeof createSwipeRow> | null>(null);
	const actionOf = (side: SwipeSide, index: number) =>
		(side === "leading" ? leading : trailing)[index];
	const options = {
		leading: leading.length,
		trailing: trailing.length,
		fullSwipe,
		keepRow: (side: SwipeSide, index: number) => !!actionOf(side, index)?.keepRow,
		onCommit: (side: SwipeSide, index: number) => actionOf(side, index)?.onSelect(),
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useLayoutEffect(() => {
		if (!rowRef.current) return;
		const created = createSwipeRow(rowRef.current, group, optionsRef.current);
		engine.current = created;
		return () => created.destroy();
	}, [group]);
	useEffect(() => {
		engine.current?.update(options);
	});

	const s = swipeActions({ size });
	const layers = (side: SwipeSide, actions: SwipeAction[]) =>
		actions.map((action, index) => (
			// The menu is the accessible path, so the revealed copy stays out of the tab order.
			<button
				key={`${side}-${action.label}`}
				type="button"
				tabIndex={-1}
				aria-hidden
				data-swipe-layer=""
				data-side={side}
				data-index={index}
				data-tone={action.tone ?? "default"}
				className={s.layer()}
				style={{ zIndex: (side === "leading" ? actions.length - 1 - index : index) + 1 }}
			>
				<span data-swipe-glyph="" className={s.glyph()}>
					<span className={s.face()}>
						<span data-swipe-icon="" className={s.icon()}>
							{action.icon}
						</span>
						<span data-swipe-label="" className={s.label()}>
							{action.label}
						</span>
					</span>
				</span>
			</button>
		));
	const menu = [
		...leading.map((action, index) => ({ action, side: "leading" as const, index })),
		...trailing.map((action, index) => ({ action, side: "trailing" as const, index })),
	];

	return (
		<li ref={rowRef} className={cn(s.row(), className)}>
			<div className={s.clip()}>
				{layers("leading", leading)}
				{layers("trailing", trailing)}
				<div data-swipe-content="" className={s.content()}>
					<div className={s.body()}>{children}</div>
					{menu.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger
								data-swipe-more=""
								aria-label={`More actions for ${label}`}
								className={s.more()}
							>
								<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
									<circle cx="5" cy="12" r="1.6" />
									<circle cx="12" cy="12" r="1.6" />
									<circle cx="19" cy="12" r="1.6" />
								</svg>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" sideOffset={6}>
								{menu.map(({ action, side, index }) => (
									<DropdownMenuItem
										key={`${side}-${action.label}`}
										destructive={action.tone === "destructive"}
										className={s.item()}
										onClick={() => engine.current?.commit(side, index)}
									>
										<span aria-hidden className="inline-flex">
											{action.icon}
										</span>
										{action.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</li>
	);
}
