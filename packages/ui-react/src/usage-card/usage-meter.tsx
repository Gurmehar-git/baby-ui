"use client";

import {
	type CSSProperties,
	type KeyboardEvent,
	type PointerEvent,
	useRef,
	useState,
} from "react";
import { type ChartConfig, ChartStyle } from "../chart/chart";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import { type MeterStatus, meterKeyStep, type meterLayout, meterNumber } from "./meter";
import type { usageCard } from "./variants";

export interface UsageMeterProps {
	id: string;
	title: string;
	config: ChartConfig;
	layout: ReturnType<typeof meterLayout>;
	limit: number;
	unit: string;
	decimals: number;
	freeLabel: string;
	overLabel: string;
	locale?: string;
	activeIndex: number | null;
	onActiveIndexChange: (index: number | null) => void;
	styles: ReturnType<typeof usageCard>;
}

const STATUS_NOTE: Record<MeterStatus, (free: string, over: string) => string> = {
	ok: (free) => `Under the limit. ${free} free.`,
	near: (free) => `Almost full. ${free} free.`,
	over: (_, over) => `Over the limit by ${over}.`,
};

/** The meter body of a usage card: hover or focus previews a share, a press pins it until pressed again or Escape. */
export function UsageMeter({
	id,
	title,
	config,
	layout,
	limit,
	unit,
	decimals,
	freeLabel,
	overLabel,
	locale,
	activeIndex,
	onActiveIndexChange,
	styles,
}: UsageMeterProps) {
	const track = useRef<HTMLDivElement>(null);
	const legend = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState<number | null>(null);
	const [focused, setFocused] = useState<number | null>(null);
	const { bars, total, free, over, status, limitAt } = layout;
	const amount = (value: number) =>
		`${meterNumber(value, decimals, locale)}${unit ? ` ${unit}` : ""}`;
	const label = (key: string) => {
		const entry = config[key]?.label;
		return typeof entry === "string" ? entry : key;
	};
	const items = [
		...bars.map((bar) => ({ key: bar.key, label: label(bar.key), value: bar.value })),
		{
			key: "rest",
			label: status === "over" ? overLabel : freeLabel,
			value: status === "over" ? over : free,
		},
	];
	const active = hovered ?? focused ?? activeIndex;
	const item = active !== null ? items[active] : undefined;
	const restIndex = bars.length;
	const caption = !item
		? `${unit} of ${amount(limit)} used`
		: active === restIndex
			? `${unit} ${status === "over" ? "over the limit" : "free"}`
			: `${unit} in ${item.label}, ${Math.round((item.value / Math.max(limit, 1e-6)) * 100)}% of plan`;

	const [note, setNote] = useState({ status, over, message: "" });
	if (note.status !== status || (status === "over" && note.over !== over))
		setNote({ status, over, message: STATUS_NOTE[status](amount(free), amount(over)) });

	const indexAt = (clientX: number) => {
		const box = track.current?.getBoundingClientRect();
		if (!box?.width) return null;
		const at = ((clientX - box.left) / box.width) * 100;
		if (at > limitAt) return restIndex;
		const hit = bars.findIndex((bar) => at <= bar.left + bar.width);
		return hit === -1 ? restIndex : hit;
	};
	const toggle = (index: number | null) =>
		onActiveIndexChange(index === activeIndex ? null : index);
	const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			if (activeIndex !== null) {
				event.preventDefault();
				onActiveIndexChange(null);
			}
			return;
		}
		const from = focused ?? 0;
		const next = meterKeyStep(event.key, from, items.length);
		if (next === null) return;
		event.preventDefault();
		legend.current?.querySelectorAll("button")[next]?.focus();
	};
	const dim = (index: number) => active !== null && active !== index;

	return (
		// biome-ignore lint/a11y/useSemanticElements: a fieldset implies form controls; this groups a read-only meter.
		<div data-chart={id} role="group" aria-label={title}>
			<ChartStyle id={id} config={config} />
			<div className={styles.headline()} aria-hidden="true">
				<RollingDigits
					variant="count"
					value={item ? item.value : total}
					format={(value) => meterNumber(value, decimals, locale)}
					size="sm"
					startOnView={false}
					className={styles.figure()}
				/>
				<span className={styles.caption()}>{caption}</span>
			</div>
			<div
				ref={track}
				aria-hidden="true"
				className={styles.track()}
				onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
					if (event.pointerType === "mouse") setHovered(indexAt(event.clientX));
				}}
				onPointerLeave={() => setHovered(null)}
				onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
					if (event.pointerType !== "mouse") toggle(indexAt(event.clientX));
				}}
			>
				{bars.map((bar, index) => (
					<span
						key={bar.key}
						data-slot="usage-meter-segment"
						data-dim={dim(index)}
						className={styles.segment()}
						style={
							{
								left: `${bar.left}%`,
								width: `max(0px, calc(${bar.width}% - 2px))`,
								"--meter-color": `var(--color-${bar.key})`,
							} as CSSProperties
						}
					/>
				))}
				<span
					className={styles.hatch()}
					style={{ left: `${limitAt}%`, opacity: status === "over" ? 1 : 0 }}
				/>
				<span
					className={styles.marker()}
					style={{ left: `${limitAt}%`, opacity: status === "over" ? 1 : 0 }}
				/>
			</div>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys rove between the legend buttons inside. */}
			<div ref={legend} className={styles.items()} onKeyDown={onKey}>
				{items.map((entry, index) => (
					<button
						key={entry.key}
						type="button"
						aria-pressed={activeIndex === index}
						data-active={active === index}
						data-dim={dim(index)}
						tabIndex={index === (focused ?? activeIndex ?? 0) ? 0 : -1}
						className={styles.item()}
						style={
							{
								"--meter-color":
									index < restIndex
										? `var(--color-${entry.key})`
										: status === "over"
											? "var(--destructive)"
											: "var(--border)",
							} as CSSProperties
						}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						onFocus={() => setFocused(index)}
						onBlur={() => setFocused(null)}
						onClick={() => toggle(index)}
					>
						<span aria-hidden="true" className={styles.swatch()} />
						{entry.label}
						<span className={styles.amount()}>{amount(entry.value)}</span>
					</button>
				))}
			</div>
			<p className={styles.srOnly()}>
				{`${title}: ${amount(total)} of ${amount(limit)} used. ${STATUS_NOTE[status](amount(free), amount(over))}`}
			</p>
			<span className={styles.srOnly()} aria-live="polite">
				{note.message}
			</span>
		</div>
	);
}
