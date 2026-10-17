"use client";

import type {
	ChangeEvent,
	KeyboardEvent,
	ReactNode,
	PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group/react/input-group";
import { cn } from "../../lib/cn";
import {
	hexKeyStep,
	hexToHsl,
	hexToHsv,
	hexToRgb,
	hslToHex,
	hsvToHex,
	isValidHex,
	parseHex,
	rgbToHex,
	stepHex,
} from "../../lib/color";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import {
	arrowStep,
	type ColorPickerSize,
	type ColorPickerVariant,
	colorPicker,
	hasEyeDropper,
	pickScreenColor,
} from "../variants";

export type { ColorPickerSize, ColorPickerVariant };

export type ColorFormat = "hsv" | "hsl" | "rgb";

export interface ColorPickerProps {
	value: string;
	format?: ColorFormat;
	swatches?: string[];
	label?: string;
	className?: string;
	onValueChange: (value: string) => void;
	onFormatChange?: (format: ColorFormat) => void;
	/**
	 * `field` (default) swatch + hex field, `row` labelled panel row, `inline` full picker,
	 * `area` saturation square, `slider` hue strip, `swatch` one disc, `swatches` discs to pick.
	 */
	variant?: ColorPickerVariant;
	/** Size of the field, area, slider and discs; the inline panel keeps its width. */
	size?: ColorPickerSize;
	/** `field`: marks the hex input invalid from outside, e.g. a form error. */
	invalid?: boolean;
	disabled?: boolean;
	/** `field`: id and form name of the hex input. */
	id?: string;
	name?: string;
	/** Recently used colours, newest first; the parent owns the list. */
	recent?: string[];
	/** Offer the screen eyedropper where the browser supports it. */
	eyedropper?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const DEFAULT_SWATCHES = [
	"#7dd3fc",
	"#a78bfa",
	"#86efac",
	"#fcd34d",
	"#fda4af",
	"#f87171",
	"#e5e7eb",
];
const FORMATS: ColorFormat[] = ["hsv", "hsl", "rgb"];

function clamp(n: number) {
	return Math.max(0, Math.min(1, n));
}

const clamp100 = (n: number) => Math.max(0, Math.min(100, n));

export function ColorPicker({
	value,
	format: formatProp,
	swatches = DEFAULT_SWATCHES,
	label = "Colour",
	className,
	onValueChange,
	onFormatChange,
	variant = "field",
	size = "default",
	invalid = false,
	disabled = false,
	id,
	name,
	recent = [],
	eyedropper = true,
	open,
	onOpenChange,
}: ColorPickerProps) {
	const s = colorPicker({ variant, size });
	const [canDrop, setCanDrop] = useState(false);
	useEffect(() => setCanDrop(eyedropper && hasEyeDropper()), [eyedropper]);
	const uid = useId();
	const [internalFormat, setInternalFormat] = useState<ColorFormat>("hsv");
	const format = formatProp ?? internalFormat;

	const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
	const [hex, setHex] = useState(() =>
		isValidHex(value) ? value.toLowerCase() : "#000000",
	);

	/**
	 * HSL lives beside HSV rather than being derived from the hex: a grey hex has no
	 * hue at all, so a round trip would snap the H slider back to 0 mid-drag.
	 */
	const [hsl, setHsl] = useState<[number, number, number]>(() => hexToHsl(value));
	const [rgb, setRgb] = useState<[number, number, number]>(() => hexToRgb(value));
	const skipSync = useRef(false);

	const square = useRef<HTMLDivElement>(null);
	const strip = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState<"square" | "strip" | null>(null);

	useEffect(() => {
		if (!isValidHex(value)) return;
		setHsv(hexToHsv(value));
		setHex(value.toLowerCase());
		setRgb(hexToRgb(value));
		if (skipSync.current) {
			skipSync.current = false;
			return;
		}
		const next = hexToHsl(value);
		setHsl((current) => [next[1] > 0 ? next[0] : current[0], next[1], next[2]]);
	}, [value]);

	const [hue, sat, val] = hsv;
	const hueColor = `hsl(${hue}, 100%, 50%)`;
	const preview = isValidHex(hex) ? hex : isValidHex(value) ? value : "#000000";

	function apply(next: string) {
		if (isValidHex(next)) onValueChange(next);
	}

	function applyHsv(next: [number, number, number]) {
		setHsv(next);
		const hexValue = hsvToHex(next[0], next[1], next[2]);
		setHex(hexValue);
		onValueChange(hexValue);
	}

	function setHslChannel(channel: 0 | 1 | 2, raw: string) {
		const next = Number.parseFloat(raw);
		if (!Number.isFinite(next)) return;
		const copy: [number, number, number] = [...hsl];
		copy[channel] = next;
		// At S=0 every hue is the same grey, so moving H would feel dead.
		if (channel === 0 && copy[1] === 0) copy[1] = 60;
		setHsl(copy);
		skipSync.current = true;
		apply(hslToHex(copy[0], copy[1], copy[2]));
	}

	function setRgbChannel(channel: 0 | 1 | 2, raw: string) {
		const next = Number.parseFloat(raw);
		if (!Number.isFinite(next)) return;
		const copy: [number, number, number] = [...rgb];
		copy[channel] = next;
		setRgb(copy);
		apply(rgbToHex(copy[0], copy[1], copy[2]));
	}

	function typeHex(raw: string) {
		const digits = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
		const next = `#${digits}`;
		setHex(next);
		apply(next);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: applyHsv left out on purpose, the listed values decide when it runs.
	const readSquare = useCallback(
		(clientX: number, clientY: number) => {
			const rect = square.current?.getBoundingClientRect();
			if (!rect) return;
			applyHsv([
				hue,
				Math.round(clamp((clientX - rect.left) / rect.width) * 100),
				Math.round(clamp(1 - (clientY - rect.top) / rect.height) * 100),
			]);
		},
		[hue],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: applyHsv left out on purpose, the listed values decide when it runs.
	const readStrip = useCallback(
		(clientX: number) => {
			const rect = strip.current?.getBoundingClientRect();
			if (!rect) return;
			applyHsv([Math.round(clamp((clientX - rect.left) / rect.width) * 360), sat, val]);
		},
		[sat, val],
	);

	useEffect(() => {
		if (!dragging) return;
		function onMove(event: PointerEvent) {
			if (dragging === "square") readSquare(event.clientX, event.clientY);
			else readStrip(event.clientX);
		}
		const stop = () => setDragging(null);
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", stop);
		window.addEventListener("pointercancel", stop);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", stop);
			window.removeEventListener("pointercancel", stop);
		};
	}, [dragging, readSquare, readStrip]);

	const channels =
		format === "hsl"
			? ([
					{ key: "h", label: "H", max: 360, unit: "°", value: hsl[0] },
					{ key: "s", label: "S", max: 100, unit: "%", value: hsl[1] },
					{ key: "l", label: "L", max: 100, unit: "%", value: hsl[2] },
				] as const)
			: format === "rgb"
				? ([
						{ key: "r", label: "R", max: 255, unit: "", value: rgb[0] },
						{ key: "g", label: "G", max: 255, unit: "", value: rgb[1] },
						{ key: "b", label: "B", max: 255, unit: "", value: rgb[2] },
					] as const)
				: ([
						{ key: "h", label: "H", max: 360, unit: "°", value: hue },
						{ key: "s", label: "S", max: 100, unit: "%", value: sat },
						{ key: "v", label: "V", max: 100, unit: "%", value: val },
					] as const);

	function setChannel(key: string, raw: string) {
		if (format === "hsl")
			return setHslChannel(key === "h" ? 0 : key === "s" ? 1 : 2, raw);
		if (format === "rgb")
			return setRgbChannel(key === "r" ? 0 : key === "g" ? 1 : 2, raw);
		const next = Number.parseFloat(raw);
		if (!Number.isFinite(next)) return;
		applyHsv(
			key === "h" ? [next, sat, val] : key === "s" ? [hue, next, val] : [hue, sat, next],
		);
	}

	function pickFormat(next: ColorFormat) {
		if (formatProp === undefined) setInternalFormat(next);
		onFormatChange?.(next);
	}

	function startSquare(event: ReactPointerEvent) {
		setDragging("square");
		square.current?.setPointerCapture(event.pointerId);
		readSquare(event.clientX, event.clientY);
	}

	function startStrip(event: ReactPointerEvent) {
		setDragging("strip");
		strip.current?.setPointerCapture(event.pointerId);
		readStrip(event.clientX);
	}

	const area = (
		<div
			ref={square}
			role="slider"
			tabIndex={disabled ? -1 : 0}
			aria-label={`${label} saturation and brightness`}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={sat}
			aria-valuetext={`Saturation ${sat}%, brightness ${val}%`}
			aria-disabled={disabled || undefined}
			onPointerDown={startSquare}
			onKeyDown={(e) => {
				const step = arrowStep(e.key, e.shiftKey);
				if (!step) return;
				e.preventDefault();
				applyHsv([hue, clamp100(sat + step.dx), clamp100(val + step.dy)]);
			}}
			style={{
				background:
					"linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, var(--picker-hue))",
				["--picker-hue" as string]: hueColor,
			}}
			className={cn(s.area(), variant === "area" && className)}
		>
			<span
				aria-hidden
				style={{ left: `${sat}%`, top: `${100 - val}%`, background: preview }}
				className={s.areaThumb()}
			/>
		</div>
	);

	const track = (
		<div
			ref={strip}
			role="slider"
			tabIndex={disabled ? -1 : 0}
			aria-label={`${label} hue`}
			aria-valuemin={0}
			aria-valuemax={360}
			aria-valuenow={hue}
			aria-valuetext={`${hue}°`}
			aria-disabled={disabled || undefined}
			onPointerDown={startStrip}
			onKeyDown={(e) => {
				const step = arrowStep(e.key, e.shiftKey);
				if (!step) return;
				e.preventDefault();
				applyHsv([Math.max(0, Math.min(360, hue + step.dx + step.dy)), sat, val]);
			}}
			style={{
				background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
			}}
			className={s.track()}
		>
			<span
				aria-hidden
				style={{ left: `${(hue / 360) * 100}%`, background: hueColor }}
				className={s.trackThumb()}
			/>
		</div>
	);

	if (variant === "area") return area;

	if (variant === "slider") {
		return (
			<div data-slot="color-picker-slider" className={cn(s.slider(), className)}>
				<div className={s.sliderHeader()}>
					<span>Hue</span>
					<span className={s.sliderValue()}>{hue}°</span>
				</div>
				{track}
			</div>
		);
	}

	if (variant === "swatch") {
		return (
			<span
				role="img"
				aria-label={`${label}: ${preview}`}
				data-slot="color-picker-swatch"
				style={{ background: preview }}
				className={cn(s.disc(), className)}
			/>
		);
	}

	if (variant === "swatches") {
		return (
			<fieldset
				aria-label={label}
				data-slot="color-picker-swatches"
				className={cn(s.discs(), className)}
			>
				{swatches.map((swatch) => (
					<label key={swatch} className={s.discLabel()}>
						<input
							type="radio"
							name={`${uid}-swatch`}
							value={swatch}
							checked={swatch.toLowerCase() === value.toLowerCase()}
							disabled={disabled}
							aria-label={swatch}
							onChange={() => apply(swatch)}
							className="peer sr-only"
						/>
						<span
							aria-hidden
							style={{ background: swatch, ["--disc" as string]: swatch }}
							className={cn(s.discOption(), s.disc())}
						/>
					</label>
				))}
			</fieldset>
		);
	}

	const picker = (
		<div
			className={cn(
				"w-60 select-none overflow-hidden rounded-xl bg-popover shadow-(--overlay-shadow)",
				variant === "inline" && className,
			)}
		>
			{area}

			<div className="flex items-center gap-2.5 border-border border-b p-2">
				<span
					aria-hidden
					style={{ background: preview }}
					className="size-7 shrink-0 rounded-md ring-1 ring-foreground/10 ring-inset"
				/>
				<div className="min-w-0 flex-1 space-y-1.5">
					{track}
					<div className="flex items-center gap-1 rounded-md border border-border bg-background px-1.5 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring">
						<span className="font-mono text-xs text-muted-foreground">#</span>
						<input
							id={`${uid}-hex`}
							value={hex.replace(/^#/, "")}
							aria-label={`${label} hex value`}
							placeholder="000000"
							spellCheck={false}
							autoComplete="off"
							onChange={(e) => typeHex(e.currentTarget.value)}
							className="h-6 min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-1.5 border-border border-b p-2">
				<div className="flex items-center gap-0.5 rounded-md bg-card p-0.5">
					{FORMATS.map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => pickFormat(option)}
							aria-pressed={format === option}
							className="h-5 flex-1 rounded font-mono text-xs text-muted-foreground uppercase transition-colors aria-pressed:bg-background aria-pressed:text-foreground"
						>
							{option}
						</button>
					))}
				</div>

				{channels.map((channel) => (
					<div key={channel.key} className="flex items-center gap-2">
						<label
							htmlFor={`${uid}-${channel.key}`}
							className="w-3 shrink-0 font-mono text-xs text-muted-foreground"
						>
							{channel.label}
						</label>
						<input
							id={`${uid}-${channel.key}`}
							type="range"
							min={0}
							max={channel.max}
							step={1}
							value={channel.value}
							style={{ ["--thumb" as string]: preview }}
							onChange={(e) => setChannel(channel.key, e.currentTarget.value)}
							className="color-slider h-1 flex-1"
						/>
						<span className="w-9 shrink-0 text-right font-mono text-xs text-foreground tabular-nums">
							{channel.value}
							{channel.unit}
						</span>
					</div>
				))}
			</div>

			<div className="flex flex-wrap items-center gap-1.5 p-2">
				{swatches.map((swatch) => (
					<button
						key={swatch}
						type="button"
						aria-label={swatch}
						aria-pressed={value.toLowerCase() === swatch.toLowerCase()}
						onClick={() => apply(swatch)}
						style={{ background: swatch }}
						className="grid size-6 place-items-center rounded-md ring-1 ring-foreground/10 ring-inset transition-[transform,scale,translate] hover:scale-110"
					>
						{value.toLowerCase() === swatch.toLowerCase() ? (
							<svg
								viewBox="0 0 12 12"
								fill="none"
								aria-hidden
								className="size-3 text-white drop-shadow-[0_1px_1px_rgb(0_0_0/0.6)]"
							>
								<path
									d="M2.5 6.2 4.8 8.5 9.5 3.6"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : null}
					</button>
				))}
			</div>
			{recent.length || canDrop ? (
				<div className={s.extras()}>
					{recent.length ? <span className={s.extrasLabel()}>Recent</span> : null}
					{recent.map((swatch) => (
						<button
							key={swatch}
							type="button"
							aria-label={`Recent ${swatch}`}
							onClick={() => apply(swatch)}
							style={{ background: swatch }}
							className="size-6 rounded-md ring-1 ring-foreground/10 ring-inset"
						/>
					))}
					{canDrop ? (
						<button
							type="button"
							aria-label="Pick a colour from the screen"
							onClick={async () => {
								const picked = await pickScreenColor();
								if (picked) apply(picked);
							}}
							className={s.eyedropper()}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M11 7l6 6M4 16L15.7 4.3a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4L8 20H4z" />
							</svg>
						</button>
					) : null}
				</div>
			) : null}
		</div>
	);

	if (variant === "inline") return picker;

	return (
		<HexField
			row={variant === "row"}
			value={preview}
			onValueChange={apply}
			size={size}
			label={label}
			invalid={invalid}
			disabled={disabled}
			id={id}
			name={name}
			open={open}
			onOpenChange={onOpenChange}
			className={className}
		>
			{picker}
		</HexField>
	);
}

/** `field`: a swatch that opens the picker beside a hex input. `row`: label, hex, then swatch. */
function HexField({
	row,
	value,
	onValueChange,
	size,
	label,
	invalid,
	disabled,
	id,
	name,
	open,
	onOpenChange,
	className,
	children,
}: {
	row: boolean;
	className?: string;
	value: string;
	onValueChange: (value: string) => void;
	size: ColorPickerSize;
	label: string;
	invalid: boolean;
	disabled: boolean;
	id?: string;
	name?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: ReactNode;
}) {
	const s = colorPicker({ size });
	// What the user is typing; null shows the committed value.
	const [draft, setDraft] = useState<string | null>(null);
	const parsed = draft === null ? value : parseHex(draft);

	const ownId = useId();
	const inputId = id ?? ownId;

	function commit(next: string) {
		setDraft(null);
		if (next !== value) onValueChange(next);
	}

	const hexProps = {
		id: inputId,
		name,
		disabled,
		spellCheck: false,
		autoComplete: "off",
		value: draft ?? value.toUpperCase(),
		onChange: (e: ChangeEvent<HTMLInputElement>) => setDraft(e.currentTarget.value),
		onBlur: () => (parsed ? commit(parsed) : setDraft(null)),
		onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
			const step = hexKeyStep(e.key);
			if (e.key === "Enter" && parsed) commit(parsed);
			else if (e.key === "Escape") setDraft(null);
			else if (step !== null) {
				e.preventDefault();
				commit(stepHex(parsed ?? value, step));
			}
		},
	};

	const swatchPicker = (align: "start" | "end") => (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger
				disabled={disabled}
				aria-label={`Pick ${label.toLowerCase()}`}
				className={s.trigger()}
			>
				<span
					aria-hidden
					className={s.swatch()}
					style={{ backgroundColor: parsed ?? value }}
				/>
			</PopoverTrigger>
			<PopoverContent align={align} className={s.content()}>
				{children}
			</PopoverContent>
		</Popover>
	);

	if (row) {
		return (
			<div data-slot="color-picker-row" className={cn(s.row(), className)}>
				<label htmlFor={inputId} className={s.rowLabel()}>
					{label}
				</label>
				<input
					{...hexProps}
					aria-invalid={invalid || parsed === null || undefined}
					className={s.rowHex()}
				/>
				{swatchPicker("end")}
			</div>
		);
	}

	return (
		<InputGroup
			size={size}
			data-slot="color-picker-field"
			className={cn(s.field(), className)}
		>
			<InputGroupAddon>{swatchPicker("start")}</InputGroupAddon>
			<InputGroupInput
				{...hexProps}
				aria-label={label}
				invalid={invalid || parsed === null}
				className={s.hexInput()}
			/>
		</InputGroup>
	);
}
