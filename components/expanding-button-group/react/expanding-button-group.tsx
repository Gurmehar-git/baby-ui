"use client";

import { Toolbar } from "@base-ui/react/toolbar";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import {
	createExpandingGroup,
	type ExpandingGroupItem,
	type ExpandingGroupState,
} from "../group";
import {
	type ExpandingButtonGroupSize,
	type ExpandingButtonGroupVariant,
	expandingButtonGroup,
} from "../variants";

export type { ExpandingButtonGroupSize, ExpandingButtonGroupVariant };

export interface ExpandingButtonGroupItem extends ExpandingGroupItem {
	icon: ReactNode;
	/** `destructive` tints the expanded state, for actions such as Delete. */
	variant?: "default" | "destructive";
}

export interface ExpandingButtonGroupProps {
	items: readonly ExpandingButtonGroupItem[];
	/** Accessible name of the toolbar, e.g. "Message actions". */
	label: string;
	variant?: ExpandingButtonGroupVariant;
	size?: ExpandingButtonGroupSize;
	/** The action whose label shows at rest; defaults to the first enabled one. */
	defaultExpanded?: string | null;
	/** Called with the item id whenever an action runs, before its own `onSelect`. */
	onAction?: (id: string) => void;
	/** How long the confirmation stays, in ms. */
	confirmDuration?: number;
	className?: string;
}

/**
 * A pill of icon buttons where one action always shows its label: pointing at or focusing another
 * slides the label over, and an action can confirm in place with a drawn check and a past-tense word.
 */
export function ExpandingButtonGroup({
	items,
	label,
	variant = "default",
	size = "default",
	defaultExpanded = null,
	onAction,
	confirmDuration = 1400,
	className,
}: ExpandingButtonGroupProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createExpandingGroup> | null>(null);
	const [state, setState] = useState<ExpandingGroupState>({
		intent: null,
		done: null,
		busy: null,
		announcement: "",
	});
	const options = { items, confirmDuration, onAction, onState: setState };
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useLayoutEffect(() => {
		if (!rootRef.current) return;
		engine.current = createExpandingGroup(rootRef.current, optionsRef.current);
		return () => engine.current?.destroy();
	}, []);
	useEffect(() => {
		engine.current?.update(options);
	});

	const has = (id: string | null) => !!id && items.some((item) => item.id === id);
	const restId = has(defaultExpanded)
		? defaultExpanded
		: (items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? null);
	const expandedId = has(state.intent) ? state.intent : restId;
	const s = expandingButtonGroup({ variant, size });

	return (
		<Toolbar.Root
			ref={rootRef}
			aria-label={label}
			data-slot="expanding-button-group"
			className={cn(s.root(), className)}
		>
			{items.map((item) => {
				const done = state.done === item.id && !!item.doneLabel;
				return (
					<Toolbar.Button
						key={item.id}
						data-ebg-item=""
						data-id={item.id}
						data-variant={item.variant ?? "default"}
						data-state={done ? "done" : "idle"}
						data-expanded={expandedId === item.id || undefined}
						aria-label={item.label}
						aria-disabled={item.disabled || undefined}
						aria-busy={state.busy === item.id || undefined}
						className={s.item()}
					>
						<span aria-hidden className={s.icon()}>
							<span data-on={!done} className={s.glyph()}>
								{item.icon}
							</span>
							<span data-on={done} className={s.glyph()}>
								<svg
									aria-hidden
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M4 12.5l5 5L20 6.5" pathLength={1} className={s.tick()} />
								</svg>
							</span>
						</span>
						<span aria-hidden className={s.columns()}>
							<span className={s.label()}>
								<span data-on={!done} className={s.word()}>
									{item.label}
								</span>
								{item.doneLabel && (
									<span data-on={done} className={s.word()}>
										{item.doneLabel}
									</span>
								)}
							</span>
						</span>
					</Toolbar.Button>
				);
			})}
			<span className="sr-only" role="status">
				{state.announcement}
			</span>
		</Toolbar.Root>
	);
}
