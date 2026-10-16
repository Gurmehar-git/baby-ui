"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import {
	mountSwappable,
	type SwappableHandlers,
	type Swapy,
	type SwapyConfig,
} from "./core";
import { type SwappableVariant, swappable } from "./variants";

export type { SwappableVariant };

const Ctx = createContext<{ variant: SwappableVariant; hintId: string }>({
	variant: "card",
	hintId: "",
});

export interface SwappableProps
	extends Omit<ComponentProps<"div">, "children">,
		Partial<SwapyConfig>,
		Omit<SwappableHandlers, "announce"> {
	variant?: SwappableVariant;
	/** The Swapy instance once mounted, for `slotItemMap()` or `update()`. */
	onReady?: (swapy: Swapy) => void;
	/** Read to screen readers on every item, after the item's own content. */
	hint?: string;
	children?: ReactNode;
}

/**
 * Swapy as a primitive: every option and event of `createSwapy`, plus a keyboard path
 * (Alt+arrow). Any markup inside can be a slot, an item or a handle.
 */
export function Swappable({
	variant = "card",
	animation = "dynamic",
	enabled = true,
	swapMode = "hover",
	dragOnHold = false,
	autoScrollOnDrag = true,
	dragAxis = "both",
	manualSwap = false,
	onSwap,
	onSwapStart,
	onSwapEnd,
	onBeforeSwap,
	onReady,
	hint = "Drag to move, or press Alt and an arrow key.",
	className,
	children,
	...props
}: SwappableProps) {
	const container = useRef<HTMLDivElement>(null);
	const mounted = useRef<ReturnType<typeof mountSwappable> | null>(null);
	const hintId = useId();
	const [spoken, setSpoken] = useState("");
	// Swapy keeps the handlers it was given, so it reads the latest through this.
	const handlers = useRef<SwappableHandlers>({});
	handlers.current = {
		onSwap,
		onSwapStart,
		onSwapEnd,
		onBeforeSwap,
		announce: setSpoken,
	};
	const enabledNow = useRef(enabled);
	enabledNow.current = enabled;
	const ready = useRef(onReady);
	ready.current = onReady;

	useEffect(() => {
		if (!container.current) return;
		const instance = mountSwappable(
			container.current,
			{
				animation,
				enabled: enabledNow.current,
				swapMode,
				dragOnHold,
				autoScrollOnDrag,
				dragAxis,
				manualSwap,
			},
			() => handlers.current,
		);
		mounted.current = instance;
		ready.current?.(instance.swapy);
		return () => {
			instance.destroy();
			mounted.current = null;
		};
	}, [animation, swapMode, dragOnHold, autoScrollOnDrag, dragAxis, manualSwap]);

	useEffect(() => mounted.current?.setEnabled(enabled), [enabled]);

	return (
		<Ctx.Provider value={{ variant, hintId }}>
			<div
				ref={container}
				data-slot="swappable"
				data-disabled={enabled ? undefined : ""}
				className={cn(swappable({ variant }).root(), className)}
				{...props}
			>
				{children}
				<span id={hintId} hidden>
					{hint}
				</span>
				<span role="status" className="sr-only">
					{spoken}
				</span>
			</div>
		</Ctx.Provider>
	);
}

/** A place an item can sit; ids must be unique within the Swappable. */
export function SwappableSlot({
	id,
	className,
	...props
}: ComponentProps<"div"> & { id: string }) {
	return (
		<div
			data-swapy-slot={id}
			data-slot="swappable-slot"
			className={cn(swappable().slot(), className)}
			{...props}
		/>
	);
}

/** What moves between slots; focusable for the keyboard path. Mark inner controls `data-swapy-no-drag`. */
export function SwappableItem({
	id,
	className,
	...props
}: ComponentProps<"div"> & { id: string }) {
	const { variant, hintId } = useContext(Ctx);
	return (
		<div
			data-swapy-item={id}
			data-slot="swappable-item"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the item is the keyboard target for Alt+arrow moves; it holds controls, so no button role
			tabIndex={0}
			aria-describedby={hintId || undefined}
			className={cn(swappable({ variant }).item(), className)}
			{...props}
		/>
	);
}

/** Optional grip: once an item holds one, only the grip starts a drag. */
export function SwappableHandle({
	className,
	children,
	...props
}: ComponentProps<"span">) {
	return (
		<span
			data-swapy-handle=""
			data-slot="swappable-handle"
			aria-hidden
			className={cn(swappable().handle(), className)}
			{...props}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
					<circle cx="6" cy="4" r="1.2" />
					<circle cx="10" cy="4" r="1.2" />
					<circle cx="6" cy="8" r="1.2" />
					<circle cx="10" cy="8" r="1.2" />
					<circle cx="6" cy="12" r="1.2" />
					<circle cx="10" cy="12" r="1.2" />
				</svg>
			)}
		</span>
	);
}
