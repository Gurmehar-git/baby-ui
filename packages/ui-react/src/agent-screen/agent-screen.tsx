"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { Button } from "../button/button";
import { button } from "../button/variants";
import { Dialog, DialogClose, DialogContent } from "../dialog/dialog";
import { cn } from "../lib/cn";
import { Spinner } from "../spinner/spinner";
import { type AgentScreenSize, agentScreen } from "./variants";

export type { AgentScreenSize };

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;

function fmt(total: number) {
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CursorIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg
			viewBox="0 0 24 24"
			strokeWidth="1.4"
			strokeLinejoin="round"
			aria-hidden
			width="26"
			height="26"
			className={cn("fill-foreground stroke-background", className)}
			style={style}
		>
			<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
		</svg>
	);
}

function ConnectingScreen() {
	return (
		<div className="absolute inset-0 grid place-items-center bg-black">
			<div className="flex flex-col items-center gap-3">
				<Spinner size="lg" className="text-white" label="Connecting to agent's screen" />
				<span className="text-xs text-white/70 font-medium">
					Connecting to agent&apos;s screen
				</span>
			</div>
		</div>
	);
}

function Screen({ streamSrc }: { streamSrc?: string }) {
	if (!streamSrc) {
		return (
			<div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground text-xs">
				Screen unavailable
			</div>
		);
	}
	return (
		<div className="absolute inset-0 overflow-hidden bg-muted">
			{VIDEO_EXT.test(streamSrc) ? (
				<video
					src={streamSrc}
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 size-full object-cover"
				/>
			) : (
				<img src={streamSrc} alt="" className="absolute inset-0 size-full object-cover" />
			)}
			<CursorIcon
				className="pointer-events-none absolute"
				style={{ left: "42%", top: "53%" }}
			/>
		</div>
	);
}

function MediaSizer({ streamSrc }: { streamSrc?: string }) {
	if (!streamSrc) {
		return (
			<div className="grid h-[40vh] w-[min(720px,90vw)] place-items-center text-muted-foreground text-sm">
				Screen unavailable
			</div>
		);
	}
	const style: CSSProperties = {
		maxHeight: "calc(100vh - 150px)",
		maxWidth: "min(960px, 90vw)",
	};
	const className = "block h-auto w-auto object-contain";
	return VIDEO_EXT.test(streamSrc) ? (
		<video
			src={streamSrc}
			autoPlay
			muted
			loop
			playsInline
			className={className}
			style={style}
		/>
	) : (
		<img src={streamSrc} alt="" className={className} style={style} />
	);
}

export interface AgentScreenProps {
	agentName?: string;
	streamSrc?: string;
	loading?: boolean;
	size?: AgentScreenSize;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

/** Recording (`Teach a task`) keeps ticking while the viewer is collapsed, since its
 * state lives here rather than inside the dialog's own content. */
export function AgentScreen({
	agentName = "Agent",
	streamSrc,
	loading = false,
	size = "default",
	open,
	defaultOpen = false,
	onOpenChange,
	className,
}: AgentScreenProps) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const [recording, setRecording] = useState(false);
	const [secs, setSecs] = useState(0);
	const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
	const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
	const isOpen = open ?? internalOpen;
	const { root } = agentScreen({ size });

	function setOpen(next: boolean) {
		if (open === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	}

	function startRecording() {
		setSecs(0);
		setRecording(true);
		clearInterval(tickRef.current);
		tickRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
	}

	function endRecording() {
		setRecording(false);
		setSecs(0);
		clearInterval(tickRef.current);
	}

	return (
		<div data-slot="agent-screen" className={cn(root(), className)}>
			<button
				type="button"
				disabled={loading}
				onClick={() => setOpen(true)}
				className={cn(
					"group/screen relative aspect-[2964/1856] w-full overflow-hidden rounded-2xl bg-muted text-left shadow-sm transition-shadow duration-(--duration-fast)",
					!loading && "cursor-pointer hover:shadow-md",
				)}
			>
				{loading ? (
					<ConnectingScreen />
				) : (
					<>
						<Screen streamSrc={streamSrc} />
						<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-(--duration-fast) group-hover/screen:bg-black/20">
							<span
								aria-hidden
								className={cn(
									button({ variant: "default", size: "sm" }),
									"translate-y-1 opacity-0 transition duration-(--duration-fast) group-hover/screen:translate-y-0 group-hover/screen:opacity-100",
								)}
							>
								Open
							</span>
						</div>
					</>
				)}
			</button>

			<p className="mt-2.5 truncate px-0.5 font-medium text-sm text-foreground">
				{agentName}&apos;s screen
			</p>

			<Dialog open={isOpen} onOpenChange={setOpen}>
				<DialogContent className="flex max-h-[90vh] w-[min(960px,92vw)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl bg-card p-2 pt-0">
					<div className="flex h-11 shrink-0 items-center justify-between gap-3 px-1.5">
						<div className="flex min-w-0 items-center gap-2">
							<span className="truncate font-semibold text-sm text-foreground">
								{agentName}
							</span>
							{recording ? (
								<span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 py-0.5 pr-2 pl-1.5 font-medium text-xs text-destructive-strong tabular-nums">
									<span className="size-2 animate-pulse rounded-full bg-destructive" />
									{fmt(secs)}
								</span>
							) : null}
						</div>
						<div className="flex shrink-0 items-center gap-1.5">
							{recording ? (
								<Button
									variant="destructive"
									size="sm"
									className="gap-1.5 rounded-full"
									onClick={endRecording}
								>
									<span className="size-2.5 rounded-[2px] bg-current" />
									End
								</Button>
							) : (
								<Button variant="secondary" size="sm" onClick={startRecording}>
									<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
										<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
										<circle cx="8" cy="8" r="2.4" fill="currentColor" />
									</svg>
									Teach a task
								</Button>
							)}
							<DialogClose className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
								<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
									<path
										d="M3 9h4v4M13 7H9V3M9 7l5-5M7 9l-5 5"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="sr-only">Collapse</span>
							</DialogClose>
						</div>
					</div>

					{/* biome-ignore lint/a11y/noStaticElementInteractions: decorative cursor-follow overlay, not a real control */}
					<div
						className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-muted [cursor:none]"
						onMouseMove={(event) => {
							const rect = event.currentTarget.getBoundingClientRect();
							setCursorPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
						}}
						onMouseLeave={() => setCursorPos(null)}
					>
						{loading ? (
							<ConnectingScreen />
						) : (
							<div className="flex h-full items-center justify-center">
								<MediaSizer streamSrc={streamSrc} />
							</div>
						)}
						{!loading && cursorPos ? (
							<CursorIcon
								className="pointer-events-none absolute z-10 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]"
								style={{ left: cursorPos.x, top: cursorPos.y }}
							/>
						) : null}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
