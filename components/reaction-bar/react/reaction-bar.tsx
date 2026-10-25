"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { compactCount, REACTION_PATHS } from "../icons";
import {
	type ReactionBarTone,
	type ReactionBarVariant,
	type ReactionIcon,
	reactionBar,
} from "../variants";

export type { ReactionBarTone, ReactionBarVariant, ReactionIcon };

type Ctx = {
	pressed: string[];
	toggle: (value: string) => void;
	variant: ReactionBarVariant;
	locale?: string;
};
const ReactionBarContext = createContext<Ctx | null>(null);

function useReactionBar(part: string): Ctx {
	const ctx = useContext(ReactionBarContext);
	if (!ctx) throw new Error(`${part} must be used inside <ReactionBar>`);
	return ctx;
}

type ItemCtx = { pressed: boolean; total: number };
const ItemContext = createContext<ItemCtx | null>(null);

function useItem(part: string): ItemCtx {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new Error(`${part} must be used inside <ReactionBarItem>`);
	return ctx;
}

export interface ReactionBarProps extends Omit<ComponentProps<"div">, "defaultValue"> {
	/** Values of the pressed reactions. Controlled with onValueChange. */
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: ReactionBarVariant;
	/** Formats counts compactly (1.2K) in this locale. */
	locale?: string;
}

/** The root: a labelled group that knows which reactions you have pressed. */
export function ReactionBar({
	value: valueProp,
	defaultValue = [],
	onValueChange,
	variant = "pill",
	locale,
	className,
	"aria-label": ariaLabel = "Reactions",
	...props
}: ReactionBarProps) {
	const [internal, setInternal] = useState(defaultValue);
	const pressed = valueProp ?? internal;
	const toggle = (value: string) => {
		const next = pressed.includes(value)
			? pressed.filter((v) => v !== value)
			: [...pressed, value];
		if (valueProp === undefined) setInternal(next);
		onValueChange?.(next);
	};
	return (
		<ReactionBarContext.Provider value={{ pressed, toggle, variant, locale }}>
			{/* biome-ignore lint/a11y/useSemanticElements: a fieldset implies form controls; this groups toggle buttons. */}
			<div
				role="group"
				aria-label={ariaLabel}
				data-slot="reaction-bar"
				data-variant={variant}
				className={cn(reactionBar({ variant }).root(), className)}
				{...props}
			/>
		</ReactionBarContext.Provider>
	);
}

/** One reaction. `count` is everyone else's; your own press adds one while it is held. */
export function ReactionBarItem({
	value,
	count = 0,
	label,
	tone = "default",
	className,
	onClick,
	...props
}: Omit<ComponentProps<"button">, "value"> & {
	value: string;
	count?: number;
	/** The action's name, e.g. "Like"; the count is appended for screen readers. */
	label: string;
	tone?: ReactionBarTone;
}) {
	const { pressed, toggle, variant } = useReactionBar("ReactionBarItem");
	const isPressed = pressed.includes(value);
	const total = Math.max(0, count + (isPressed ? 1 : 0));
	return (
		<ItemContext.Provider value={{ pressed: isPressed, total }}>
			<button
				type="button"
				data-slot="reaction-bar-item"
				aria-pressed={isPressed}
				aria-label={total > 0 ? `${label}, ${total}` : label}
				className={cn(reactionBar({ variant, tone }).item(), className)}
				onClick={(event) => {
					toggle(value);
					onClick?.(event);
				}}
				{...props}
			/>
		</ItemContext.Provider>
	);
}

/** A built-in `icon`, or your own as children; it squishes while held and springs back. */
export function ReactionBarIcon({
	icon,
	className,
	children,
}: {
	icon?: ReactionIcon;
	className?: string;
	children?: ReactNode;
}) {
	return (
		<span
			aria-hidden="true"
			data-slot="reaction-bar-icon"
			className={cn(reactionBar().icon(), className)}
		>
			{icon ? (
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{REACTION_PATHS[icon].map((p) => (
						<path key={p.d} d={p.d} data-fill={p.fill ? "" : undefined} />
					))}
				</svg>
			) : (
				children
			)}
		</span>
	);
}

/** The total, compact and rolling; its column folds shut at zero. */
export function ReactionBarCount({ className }: { className?: string }) {
	const { locale } = useReactionBar("ReactionBarCount");
	const { total } = useItem("ReactionBarCount");
	const styles = reactionBar();
	return (
		<span
			aria-hidden="true"
			data-slot="reaction-bar-count"
			data-shown={total > 0 || undefined}
			className={cn(styles.count(), className)}
		>
			<span className={styles.countClip()}>
				<RollingDigits
					value={total}
					format={(n) => compactCount(n, locale)}
					startOnView={false}
					className={styles.countText()}
				/>
			</span>
		</span>
	);
}
