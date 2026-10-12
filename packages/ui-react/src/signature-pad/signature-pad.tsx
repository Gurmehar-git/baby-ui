"use client";

import { type PointerEvent, useId, useRef, useState } from "react";
import { Button } from "../button/button";
import { cn } from "../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group/toggle-group";
import {
	downloadBlob,
	historyKey,
	type InkPoint,
	type InkStroke,
	type InkTone,
	type InkWidth,
	inkPoint,
	PAD_HEIGHT,
	PAD_WIDTH,
	signatureToPng,
	strokePath,
	toneColors,
} from "./ink";
import { type SignaturePadVariant, signaturePad } from "./variants";

export type { InkPoint, InkStroke, InkTone, InkWidth, SignaturePadVariant };

export interface SignaturePadProps {
	/** The strokes; empty means unsigned. */
	value?: InkStroke[];
	onValueChange?: (strokes: InkStroke[]) => void;
	/** `default` frames the pad on a bordered surface; `line` keeps only the baseline. */
	variant?: SignaturePadVariant;
	/** Accessible name of the pad. */
	label?: string;
	/** Rests on the baseline until the first stroke. */
	hint?: string;
	/** Printed under the line, e.g. the signer's name. */
	signer?: string;
	/** Shows a Download button that saves a cropped PNG. */
	downloadable?: boolean;
	fileName?: string;
	disabled?: boolean;
	className?: string;
}

const TONES: InkTone[] = ["default", "primary"];
const WIDTHS: InkWidth[] = ["fine", "medium", "bold"];

/** A signature field with real ink: width follows pressure or speed, ends taper, with undo, redo, a wiping clear and PNG export. */
export function SignaturePad({
	value,
	onValueChange,
	variant = "default",
	label = "Signature",
	hint = "Sign here",
	signer,
	downloadable = false,
	fileName = "signature",
	disabled = false,
	className,
}: SignaturePadProps) {
	const id = useId();
	const s = signaturePad({ variant });
	const pad = useRef<HTMLDivElement>(null);
	const [own, setOwn] = useState<InkStroke[]>([]);
	const strokes = value ?? own;
	const [undone, setUndone] = useState<InkStroke[]>([]);
	const [live, setLive] = useState<InkStroke | null>(null);
	const [tone, setTone] = useState<InkTone>("default");
	const [width, setWidth] = useState<InkWidth>("medium");
	const [wiping, setWiping] = useState(false);
	const startedAt = useRef(0);

	const commit = (next: InkStroke[]) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next);
	};
	const undo = () => {
		const last = strokes.at(-1);
		if (!last) return;
		setUndone((list) => [...list, last]);
		commit(strokes.slice(0, -1));
	};
	const redo = () => {
		const back = undone.at(-1);
		if (!back) return;
		setUndone((list) => list.slice(0, -1));
		commit([...strokes, back]);
	};
	const clear = () => {
		if (!strokes.length || wiping) return;
		setWiping(true);
	};
	const add = (event: PointerEvent<HTMLDivElement>, stroke: InkStroke) => {
		const el = pad.current;
		if (!el) return stroke;
		const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
		const points: InkPoint[] = samples.map((sample) =>
			inkPoint(sample, el, startedAt.current),
		);
		return { ...stroke, points: [...stroke.points, ...points] };
	};

	return (
		<div
			data-slot="signature-pad"
			data-variant={variant}
			className={cn(s.root(), className)}
		>
			<div
				ref={pad}
				role="application"
				aria-roledescription="signature pad"
				aria-label={strokes.length ? `${label}, signed` : `${label}, empty`}
				aria-describedby={`${id}-keys`}
				tabIndex={disabled ? -1 : 0}
				className={s.surface()}
				onPointerDown={(event) => {
					if (disabled || wiping || !pad.current || event.button !== 0) return;
					event.currentTarget.setPointerCapture(event.pointerId);
					startedAt.current = event.timeStamp;
					setLive(add(event, { id: `${Date.now()}`, points: [], tone, width }));
				}}
				onPointerMove={(event) => {
					if (live) setLive(add(event, live));
				}}
				onPointerUp={() => {
					if (!live) return;
					commit([...strokes, live]);
					setUndone([]);
					setLive(null);
				}}
				onPointerCancel={() => setLive(null)}
				onKeyDown={(event) => {
					const action = historyKey(event.nativeEvent);
					if (!action || disabled) return;
					event.preventDefault();
					if (action === "undo") undo();
					else if (action === "redo") redo();
					else clear();
				}}
			>
				<span aria-hidden className={s.baseline()} />
				<span
					aria-hidden
					data-hidden={Boolean(strokes.length || live)}
					className={s.hint()}
				>
					{hint}
				</span>
				{signer ? (
					<span aria-hidden className={s.signer()}>
						{signer}
					</span>
				) : null}
				<svg
					aria-hidden
					viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}
					data-wiping={wiping}
					className={s.ink()}
					onTransitionEnd={() => {
						if (!wiping) return;
						setUndone([]);
						commit([]);
						setWiping(false);
					}}
				>
					{strokes.map((stroke) => (
						<path
							key={stroke.id}
							d={strokePath(stroke)}
							data-tone={stroke.tone}
							className={s.stroke()}
						/>
					))}
					{live ? (
						<path
							d={strokePath(live, false)}
							data-tone={live.tone}
							className={s.stroke()}
						/>
					) : null}
				</svg>
			</div>
			<div className={s.toolbar()}>
				<div className={s.group()}>
					<ToggleGroup
						variant="segmented"
						size="sm"
						label="Ink"
						value={tone}
						onValueChange={(next) => {
							if (next === "default" || next === "primary") setTone(next);
						}}
					>
						{TONES.map((item) => (
							<ToggleGroupItem
								key={item}
								value={item}
								aria-label={item === "default" ? "Dark ink" : "Accent ink"}
							>
								<span aria-hidden data-tone={item} className={s.swatch()} />
							</ToggleGroupItem>
						))}
					</ToggleGroup>
					<ToggleGroup
						variant="segmented"
						size="sm"
						label="Pen width"
						value={width}
						onValueChange={(next) => {
							const picked = WIDTHS.find((item) => item === next);
							if (picked) setWidth(picked);
						}}
					>
						{WIDTHS.map((item) => (
							<ToggleGroupItem key={item} value={item} className="capitalize">
								{item}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className={s.group()}>
					<Button
						size="sm"
						variant="ghost"
						onClick={undo}
						disabled={disabled || !strokes.length}
					>
						Undo
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={redo}
						disabled={disabled || !undone.length}
					>
						Redo
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={clear}
						disabled={disabled || !strokes.length}
					>
						Clear
					</Button>
					{downloadable ? (
						<Button
							size="sm"
							variant="outline"
							disabled={!strokes.length}
							onClick={async () => {
								if (!pad.current) return;
								downloadBlob(
									await signatureToPng(strokes, toneColors(pad.current)),
									`${fileName}.png`,
								);
							}}
						>
							Download
						</Button>
					) : null}
				</div>
			</div>
			<p id={`${id}-keys`} className="sr-only">
				Draw with a pointer or pen. Mod plus Z undoes, Shift plus Mod plus Z redoes,
				Delete clears.
			</p>
		</div>
	);
}
