"use client";

import { type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/react/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	downloadBlob,
	HISTORY_LIMIT,
	historyKey,
	INK_SIZES,
	INK_TONES,
	INK_WIDTHS,
	type InkPoint,
	type InkStroke,
	type InkTone,
	type InkWidth,
	inkPoint,
	PAD_HEIGHT,
	PAD_ICONS,
	PAD_WIDTH,
	type PadIcon,
	type ReplayPlan,
	replayFrame,
	replayPlan,
	signatureSvgBlob,
	signatureToPng,
	strokePath,
	TONE_LABELS,
	toneColors,
	WIDTH_LABELS,
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
	/** Rests above the baseline until the first stroke. */
	hint?: string;
	/** Printed under the line, e.g. the signer's name. */
	signer?: string;
	defaultTone?: InkTone;
	defaultWidth?: InkWidth;
	/** Shows "Save as" PNG and SVG buttons; both crop to the ink. */
	downloadable?: boolean;
	/** Export file name, without extension. */
	fileName?: string;
	disabled?: boolean;
	className?: string;
}

type Saved = "png" | "svg" | "failed" | null;

function Icon({ name, className }: { name: PadIcon; className: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
			<path d={PAD_ICONS[name]} />
		</svg>
	);
}

/** A signature field with real ink: width follows pressure or speed, ends taper, with undo, redo, replay, a wiping clear and PNG or SVG export. */
export function SignaturePad({
	value,
	onValueChange,
	variant = "default",
	label = "Signature",
	hint = "Sign here",
	signer,
	defaultTone = "default",
	defaultWidth = "medium",
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
	const [past, setPast] = useState<InkStroke[][]>([]);
	const [future, setFuture] = useState<InkStroke[][]>([]);
	const [fresh, setFresh] = useState<string | null>(null);
	const [live, setLive] = useState<InkStroke | null>(null);
	const [tone, setTone] = useState<InkTone>(defaultTone);
	const [width, setWidth] = useState<InkWidth>(defaultWidth);
	const [wiping, setWiping] = useState(false);
	const [replayAt, setReplayAt] = useState<number | null>(null);
	const [saved, setSaved] = useState<Saved>(null);
	const [status, setStatus] = useState("");
	const pointerId = useRef<number | null>(null);
	const startedAt = useRef(0);
	const plan = useRef<ReplayPlan | null>(null);
	const frame = useRef(0);
	const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const empty = strokes.length === 0;
	const replaying = replayAt !== null;

	useEffect(
		() => () => {
			cancelAnimationFrame(frame.current);
			clearTimeout(savedTimer.current);
		},
		[],
	);

	const emit = (next: InkStroke[]) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next);
	};
	const commit = (next: InkStroke[], freshId: string | null = null) => {
		setPast((list) => [...list, strokes].slice(-HISTORY_LIMIT));
		setFuture([]);
		setFresh(freshId);
		emit(next);
	};
	const stopReplay = () => {
		cancelAnimationFrame(frame.current);
		setReplayAt(null);
	};
	const undo = () => {
		const back = past.at(-1);
		if (!back || live || wiping) return;
		stopReplay();
		setPast((list) => list.slice(0, -1));
		setFuture((list) => [strokes, ...list]);
		setFresh(null);
		emit(back);
		setStatus("Undone");
	};
	const redo = () => {
		const next = future[0];
		if (!next || live || wiping) return;
		stopReplay();
		setFuture((list) => list.slice(1));
		setPast((list) => [...list, strokes]);
		setFresh(null);
		emit(next);
		setStatus("Redone");
	};
	const finishWipe = () => {
		commit([]);
		setWiping(false);
		setStatus("Signature cleared. Undo brings it back.");
	};
	const clear = () => {
		if (empty || wiping || live) return;
		stopReplay();
		// Reduced motion has no wipe transition to end, so it clears at once.
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finishWipe();
		setWiping(true);
	};
	const toggleReplay = () => {
		if (replaying) {
			stopReplay();
			setStatus("Replay stopped");
			return;
		}
		if (empty || live) return;
		const current = replayPlan(strokes);
		plan.current = current;
		const begin = performance.now();
		const tick = (now: number) => {
			const at = (now - begin) * current.speed;
			if (at >= current.total) {
				setReplayAt(null);
				setStatus("Replay finished");
				return;
			}
			setReplayAt(at);
			frame.current = requestAnimationFrame(tick);
		};
		setReplayAt(0);
		setStatus("Replaying signature");
		frame.current = requestAnimationFrame(tick);
	};
	const save = async (kind: "png" | "svg") => {
		if (empty || !pad.current) return;
		clearTimeout(savedTimer.current);
		const colors = toneColors(pad.current);
		try {
			const blob =
				kind === "svg"
					? signatureSvgBlob(strokes, colors)
					: await signatureToPng(strokes, colors);
			downloadBlob(blob, `${fileName}.${kind}`);
			setSaved(kind);
			setStatus(`Saved ${fileName}.${kind}`);
		} catch {
			setSaved("failed");
			setStatus("Export failed. Try again.");
		}
		savedTimer.current = setTimeout(() => setSaved(null), 1800);
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

	const frameNow =
		replayAt !== null && plan.current
			? replayFrame(strokes, plan.current, replayAt)
			: null;

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
				aria-label={`${label}, ${empty ? "empty" : `${strokes.length} ${strokes.length === 1 ? "stroke" : "strokes"}`}`}
				aria-describedby={`${id}-keys`}
				tabIndex={disabled ? -1 : 0}
				data-drawing={Boolean(live)}
				className={s.surface()}
				onPointerDown={(event) => {
					if (disabled || wiping || pointerId.current !== null || event.button !== 0)
						return;
					event.preventDefault();
					stopReplay();
					event.currentTarget.focus({ preventScroll: true });
					event.currentTarget.setPointerCapture(event.pointerId);
					pointerId.current = event.pointerId;
					startedAt.current = event.timeStamp;
					setLive(
						add(event, {
							id: `${id}-${event.timeStamp}`,
							points: [],
							tone,
							width,
							at: event.timeStamp,
						}),
					);
				}}
				onPointerMove={(event) => {
					if (live && event.pointerId === pointerId.current) setLive(add(event, live));
				}}
				onPointerUp={(event) => {
					if (!live || event.pointerId !== pointerId.current) return;
					pointerId.current = null;
					commit([...strokes, live], live.id);
					setLive(null);
					setStatus(`Stroke added. ${strokes.length + 1} in the signature.`);
				}}
				onPointerCancel={() => {
					pointerId.current = null;
					setLive(null);
				}}
				onKeyDown={(event) => {
					if (event.key === "Escape" && replaying) return stopReplay();
					const action = historyKey(event.nativeEvent);
					if (!action || disabled || event.target !== event.currentTarget) return;
					event.preventDefault();
					if (action === "undo") undo();
					else if (action === "redo") redo();
					else clear();
				}}
			>
				<Icon name="mark" className={cn(s.icon(), s.mark())} />
				<span aria-hidden className={s.baseline()} />
				<span
					aria-hidden
					data-hidden={!empty || Boolean(live) || wiping}
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
					onTransitionEnd={(event) => {
						if (wiping && event.target === event.currentTarget) finishWipe();
					}}
				>
					{strokes.map((stroke, i) => {
						const d = frameNow?.paths[i];
						return (
							<path
								key={stroke.id}
								d={d ?? strokePath(stroke)}
								data-tone={stroke.tone}
								data-fresh={stroke.id === fresh}
								className={s.stroke()}
							/>
						);
					})}
					{live ? (
						<path
							d={strokePath(live, { live: true })}
							data-tone={live.tone}
							data-fresh
							className={s.stroke()}
						/>
					) : null}
					{frameNow?.nib ? (
						<circle
							cx={frameNow.nib.x}
							cy={frameNow.nib.y}
							r={frameNow.nib.r}
							data-tone={frameNow.nib.tone}
							className={s.nib()}
						/>
					) : null}
				</svg>
				<span aria-hidden data-wiping={wiping} className={s.sweep()} />
			</div>
			<div className={s.toolbar()}>
				<div className={s.group()}>
					<ToggleGroup
						variant="segmented"
						size="sm"
						label="Ink colour"
						value={tone}
						onValueChange={(next) => {
							const picked = INK_TONES.find((item) => item === next);
							if (!picked) return;
							setTone(picked);
							setStatus(`${TONE_LABELS[picked]} selected`);
						}}
					>
						{INK_TONES.map((item) => (
							<ToggleGroupItem
								key={item}
								value={item}
								aria-label={TONE_LABELS[item]}
								title={TONE_LABELS[item]}
							>
								<span aria-hidden data-tone={item} className={s.swatch()} />
							</ToggleGroupItem>
						))}
					</ToggleGroup>
					<span aria-hidden className={s.divider()} />
					<ToggleGroup
						variant="segmented"
						size="sm"
						label="Nib width"
						value={width}
						onValueChange={(next) => {
							const picked = INK_WIDTHS.find((item) => item === next);
							if (!picked) return;
							setWidth(picked);
							setStatus(`${WIDTH_LABELS[picked]} selected`);
						}}
					>
						{INK_WIDTHS.map((item) => (
							<ToggleGroupItem
								key={item}
								value={item}
								aria-label={WIDTH_LABELS[item]}
								title={WIDTH_LABELS[item]}
							>
								<span
									aria-hidden
									className={s.weight()}
									style={{ width: INK_SIZES[item] + 2, height: INK_SIZES[item] + 2 }}
								/>
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className={s.group()}>
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label="Undo"
						title="Undo"
						onClick={undo}
						disabled={disabled || !past.length || wiping}
					>
						<Icon name="undo" className={s.icon()} />
					</Button>
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label="Redo"
						title="Redo"
						onClick={redo}
						disabled={disabled || !future.length || wiping}
					>
						<Icon name="redo" className={s.icon()} />
					</Button>
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label={replaying ? "Stop replay" : "Replay signature"}
						title={replaying ? "Stop replay" : "Replay signature"}
						aria-pressed={replaying}
						onClick={toggleReplay}
						disabled={empty || wiping}
					>
						<Icon
							key={replaying ? "stop" : "play"}
							name={replaying ? "stop" : "play"}
							className={cn(s.icon(), s.swap())}
						/>
					</Button>
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label="Clear signature"
						title="Clear signature"
						onClick={clear}
						disabled={disabled || empty || wiping}
					>
						<Icon name="clear" className={s.icon()} />
					</Button>
				</div>
			</div>
			{downloadable ? (
				<div className={s.exports()}>
					<span className={s.exportLabel()}>Save as</span>
					{(["png", "svg"] as const).map((kind) => (
						<Button
							key={kind}
							size="sm"
							variant="outline"
							className="grid min-w-20"
							aria-label={`Download ${kind.toUpperCase()}`}
							disabled={empty}
							onClick={() => save(kind)}
						>
							{saved === kind ? (
								<span key="done" className={s.swap()}>
									<Icon name="check" className={s.icon()} />
									Saved
								</span>
							) : (
								<span key="idle" className={s.swap()}>
									<Icon name="download" className={s.icon()} />
									{kind.toUpperCase()}
								</span>
							)}
						</Button>
					))}
				</div>
			) : null}
			<p id={`${id}-keys`} className="sr-only">
				Draw with a pointer, pen or finger. Mod plus Z undoes, Shift plus Mod plus Z
				redoes, Delete clears, Escape stops a replay.
			</p>
			<p role="status" aria-live="polite" className="sr-only">
				{status}
			</p>
		</div>
	);
}
