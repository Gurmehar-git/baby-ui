"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import {
	type TabsOrientation,
	type TabsSize,
	type TabsVariant,
	tabsFrame,
} from "./variants";

export type { TabsOrientation, TabsSize, TabsVariant };

const ARROW =
	"absolute inset-y-0 z-20 inline-flex w-9 items-center justify-center text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-0";

type Ctx = {
	value: string;
	variant: TabsVariant;
	size: TabsSize;
	orientation: TabsOrientation;
};

type Rect = { left: number; top: number; width: number; height: number };

const TabsCtx = createContext<Ctx | null>(null);

function useTabs() {
	const ctx = useContext(TabsCtx);
	if (!ctx) throw new Error("Tabs parts must be used inside <Tabs>");
	return ctx;
}

export function Tabs({
	className,
	value: valueProp,
	defaultValue = "",
	variant = "pill",
	size = "default",
	orientation = "horizontal",
	onValueChange,
	children,
	...props
}: Omit<
	ComponentProps<typeof TabsPrimitive.Root>,
	"value" | "defaultValue" | "onValueChange" | "orientation"
> & {
	value?: string;
	defaultValue?: string;
	variant?: TabsVariant;
	size?: TabsSize;
	orientation?: TabsOrientation;
	onValueChange?: (value: string) => void;
}) {
	const [internal, setInternal] = useState(defaultValue);
	const value = valueProp ?? internal;

	const setValue = useCallback(
		(next: string) => {
			if (valueProp === undefined) setInternal(next);
			onValueChange?.(next);
		},
		[valueProp, onValueChange],
	);

	const ctx = useMemo(
		() => ({ value, variant, size, orientation }),
		[value, variant, size, orientation],
	);

	return (
		<TabsCtx.Provider value={ctx}>
			<TabsPrimitive.Root
				data-slot="tabs"
				value={value}
				orientation={orientation}
				onValueChange={(next) => setValue(String(next ?? ""))}
				className={cn(
					"flex",
					orientation === "vertical" ? "flex-row items-start gap-4" : "flex-col",
					className,
				)}
				{...props}
			>
				{children}
			</TabsPrimitive.Root>
		</TabsCtx.Provider>
	);
}

export function TabsList({ className, children, ...props }: ComponentProps<"div">) {
	const tabs = useTabs();
	const { list: listClass, indicator: indicatorClass } = tabsFrame({
		variant: tabs.variant,
		size: tabs.size,
		orientation: tabs.orientation,
	});
	const root = useRef<HTMLDivElement>(null);
	const viewport = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const [rects, setRects] = useState<Record<string, Rect>>({});
	const [edges, setEdges] = useState({ overflow: false, left: false, right: false });

	const measure = useCallback(() => {
		if (!list.current || !viewport.current || !root.current) return;
		const next: Record<string, Rect> = {};
		for (const el of list.current.querySelectorAll<HTMLElement>("[data-tab]")) {
			const id = el.dataset.tab;
			if (id)
				next[id] = {
					left: el.offsetLeft,
					top: el.offsetTop,
					width: el.offsetWidth,
					height: el.offsetHeight,
				};
		}
		setRects(next);

		// Overlay arrows sit above the viewport, so they never shrink its scroll range.
		const port = viewport.current;
		const max = Math.max(0, port.scrollWidth - port.clientWidth);
		const from = Math.max(0, Math.min(max, Math.abs(port.scrollLeft)));
		setEdges({
			overflow: port.scrollWidth > root.current.clientWidth + 1,
			left: from > 1,
			right: from < max - 1,
		});
	}, []);

	useLayoutEffect(() => {
		measure();
	}, [measure]);

	useEffect(() => {
		const port = viewport.current;
		if (!root.current || !port || !list.current) return;
		const observer = new ResizeObserver(measure);
		observer.observe(root.current);
		observer.observe(list.current);
		port.addEventListener("scroll", measure, { passive: true });
		return () => {
			observer.disconnect();
			port.removeEventListener("scroll", measure);
		};
	}, [measure]);

	const indicatorRects = rects[tabs.value] ?? { left: 0, top: 0, width: 0, height: 0 };
	const vertical = tabs.orientation === "vertical";

	/** Keep the selected tab clear of the arrows that overlay the faded edges. */
	useEffect(() => {
		const el = list.current?.querySelector<HTMLElement>(
			`[data-tab="${CSS.escape(tabs.value)}"]`,
		);
		const port = viewport.current;
		if (!el || !port || !edges.overflow) return;
		const frame = port.getBoundingClientRect();
		const item = el.getBoundingClientRect();
		const left = frame.left + (edges.left ? 36 : 0);
		const right = frame.right - (edges.right ? 36 : 0);
		const delta =
			item.left < left ? item.left - left : item.right > right ? item.right - right : 0;
		if (delta) port.scrollBy({ left: delta, behavior: "smooth" });
	}, [tabs.value, edges]);

	const mask = edges.overflow
		? `linear-gradient(to right, ${edges.left ? "transparent, black 40px" : "black, black 0"}, ${
				edges.right ? "black calc(100% - 40px), transparent" : "black 100%"
			})`
		: undefined;

	function scroll(direction: number) {
		const port = viewport.current;
		if (port)
			port.scrollBy({ left: direction * port.clientWidth * 0.8, behavior: "smooth" });
	}

	return (
		<div
			ref={root}
			className={cn(
				"relative isolate flex w-full min-w-0 max-w-full items-center",
				vertical && "w-auto shrink-0",
				edges.overflow && tabs.variant === "pill" && "rounded-full bg-card",
				edges.overflow && tabs.variant === "segment" && "rounded-lg bg-card",
			)}
		>
			{edges.overflow ? (
				<button
					type="button"
					aria-label="Scroll tabs left"
					disabled={!edges.left}
					onClick={() => scroll(-1)}
					className={cn(ARROW, "left-0 rounded-l-full")}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
						<path
							d="M10 3.5 5.5 8l4.5 4.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			) : null}

			<div
				ref={viewport}
				style={{ maskImage: mask, WebkitMaskImage: mask }}
				className={cn(
					"scrollbar-none w-full min-w-0 overflow-x-auto",
					edges.overflow && "[border-radius:inherit]",
				)}
			>
				<TabsPrimitive.List
					ref={list}
					data-slot="tabs-list"
					// Base UI defaults to manual activation; this matches bits-ui's default and
					// the pre-migration behavior (arrow keys select immediately).
					activateOnFocus
					className={cn(listClass(), className)}
					{...props}
				>
					<span
						aria-hidden
						style={
							vertical
								? {
										transform: `translate(${indicatorRects.left}px, ${indicatorRects.top}px)`,
										width: indicatorRects.width,
										height: indicatorRects.height,
										top: 0,
										bottom: "auto",
									}
								: {
										transform: `translateX(${indicatorRects.left}px)`,
										width: indicatorRects.width,
									}
						}
						className={indicatorClass()}
					/>
					{children}
				</TabsPrimitive.List>
			</div>

			{edges.overflow ? (
				<button
					type="button"
					aria-label="Scroll tabs right"
					disabled={!edges.right}
					onClick={() => scroll(1)}
					className={cn(ARROW, "right-0 rounded-r-full")}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
						<path
							d="M6 3.5 10.5 8 6 12.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			) : null}
		</div>
	);
}

export function TabsTrigger({
	className,
	value,
	...props
}: ComponentProps<typeof TabsPrimitive.Tab> & { value: string }) {
	const tabs = useTabs();
	const { trigger } = tabsFrame({
		variant: tabs.variant,
		size: tabs.size,
		orientation: tabs.orientation,
	});

	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			data-tab={value}
			value={value}
			className={cn(trigger(), className)}
			{...props}
		/>
	);
}

export function TabsContent({
	className,
	value,
	...props
}: ComponentProps<typeof TabsPrimitive.Panel> & { value: string }) {
	const tabs = useTabs();
	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			value={value}
			keepMounted
			className={cn(
				tabs.orientation === "vertical" ? "min-w-0 flex-1" : "mt-4",
				className,
			)}
			{...props}
		/>
	);
}
