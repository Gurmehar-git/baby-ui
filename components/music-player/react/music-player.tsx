"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/react/cn";
import type { ImageSlotProps } from "../../lib/react/image";
import { Slider } from "../../slider/react/slider";
import {
	clampUnit,
	formatTime,
	MUSIC_PLAYER_LABELS,
	type MusicPlayerLabels,
	SEEK_TOLERANCE,
} from "./types";
import { type MusicPlayerLayout, musicPlayer } from "./variants";

export type { MusicPlayerLabels, MusicPlayerLayout };

export interface MusicPlayerProps {
	title: string;
	artist: string;
	/** Cover art URL, shown as the record face. */
	cover: string;
	coverAlt?: string;
	/** Track length in seconds. */
	duration: number;
	/** Audio URL; when set the player drives a real `<audio>` element, otherwise it only renders. */
	src?: string;
	playing?: boolean;
	defaultPlaying?: boolean;
	onPlayingChange?: (playing: boolean) => void;
	/** Playhead in seconds. */
	position?: number;
	defaultPosition?: number;
	onPositionChange?: (position: number) => void;
	/** 0 to 1. */
	volume?: number;
	defaultVolume?: number;
	onVolumeChange?: (volume: number) => void;
	/** Shows a previous-track button when set. */
	onPrevious?: () => void;
	/** Shows a next-track button when set. */
	onNext?: () => void;
	layout?: MusicPlayerLayout;
	labels?: Partial<MusicPlayerLabels>;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

function useControlled<T>(
	prop: T | undefined,
	initial: T,
	onChange?: (value: T) => void,
) {
	const [inner, setInner] = useState(initial);
	const value = prop ?? inner;
	const set = (next: T) => {
		if (prop === undefined) setInner(next);
		onChange?.(next);
	};
	return [value, set] as const;
}

function Icon({ filled = false, children }: { filled?: boolean; children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill={filled ? "currentColor" : "none"}
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{children}
		</svg>
	);
}

/** A record-deck player whose playing state, playhead and volume are all caller-controllable. */
export function MusicPlayer({
	title,
	artist,
	cover,
	coverAlt = "",
	duration,
	src,
	playing: playingProp,
	defaultPlaying = false,
	onPlayingChange,
	position: positionProp,
	defaultPosition = 0,
	onPositionChange,
	volume: volumeProp,
	defaultVolume = 1,
	onVolumeChange,
	onPrevious,
	onNext,
	layout = "vinyl",
	labels,
	image,
	className,
}: MusicPlayerProps) {
	const text = { ...MUSIC_PLAYER_LABELS, ...labels };
	const s = musicPlayer({ layout });
	const [playing, setPlaying] = useControlled(
		playingProp,
		defaultPlaying,
		onPlayingChange,
	);
	const [position, setPosition] = useControlled(
		positionProp,
		defaultPosition,
		onPositionChange,
	);
	const [volume, setVolume] = useControlled(volumeProp, defaultVolume, onVolumeChange);
	const lastVolume = useRef(volume > 0 ? volume : 1);
	const audio = useRef<HTMLAudioElement>(null);
	const setPlayingRef = useRef(setPlaying);
	setPlayingRef.current = setPlaying;

	const level = clampUnit(volume);
	const length = Math.max(0, duration);
	const at = Math.min(length, Math.max(0, position));

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: src.
	useEffect(() => {
		const el = audio.current;
		if (!el) return;
		if (playing) el.play().catch(() => setPlayingRef.current(false));
		else el.pause();
	}, [playing, src]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: src.
	useEffect(() => {
		if (audio.current) audio.current.volume = level;
	}, [level, src]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: src.
	useEffect(() => {
		const el = audio.current;
		if (el && Math.abs(el.currentTime - at) > SEEK_TOLERANCE) el.currentTime = at;
	}, [at, src]);

	const toggleMute = () => {
		if (level > 0) {
			lastVolume.current = level;
			setVolume(0);
		} else setVolume(lastVolume.current);
	};

	return (
		<div
			data-slot="music-player"
			data-layout={layout}
			data-playing={playing}
			className={cn(s.root(), className)}
		>
			{src ? (
				// biome-ignore lint/a11y/useMediaCaption: a music track has no caption file to point at.
				<audio
					ref={audio}
					src={src}
					preload="metadata"
					className="hidden"
					onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
					onEnded={() => setPlaying(false)}
				/>
			) : null}
			<div className={s.frame()}>
				<div className={s.deck()}>
					<div className={s.disc()} data-playing={playing}>
						{image ? (
							image({ src: cover, alt: coverAlt, className: s.cover() })
						) : (
							<img
								src={cover}
								alt={coverAlt}
								className={s.cover()}
								decoding="async"
								draggable={false}
							/>
						)}
						<div aria-hidden className={s.grooves()} />
						<div aria-hidden className={s.label()}>
							<div className={s.pin()} />
						</div>
					</div>
					<div aria-hidden className={s.sheen()} />
					<div aria-hidden className={s.arm()} data-playing={playing}>
						<div className={s.armBase()} />
						<div className={s.armStick()}>
							<div className={s.needle()} />
						</div>
					</div>
				</div>
				<div className={s.body()}>
					<div className={s.meta()}>
						<span className={s.title()}>{title}</span>
						<span className={s.artist()}>{artist}</span>
					</div>
					<div className={s.scrub()}>
						<Slider
							size="sm"
							label={text.seek}
							min={0}
							max={length}
							step={1}
							value={at}
							onValueChange={(v) => setPosition(v as number)}
						/>
						<div className={s.times()} aria-hidden>
							<span>{formatTime(at)}</span>
							<span>-{formatTime(length - at)}</span>
						</div>
					</div>
					<div className={s.controls()}>
						<div className={s.transport()}>
							{onPrevious ? (
								<Button
									variant="ghost"
									size="icon"
									aria-label={text.previous}
									onClick={onPrevious}
								>
									<Icon>
										<path d="M20 5v14l-12 -7z" />
										<path d="M4 5l0 14" />
									</Icon>
								</Button>
							) : null}
							<Button
								size="icon-lg"
								className="rounded-full"
								aria-label={playing ? text.pause : text.play}
								onClick={() => setPlaying(!playing)}
							>
								{playing ? (
									<Icon filled>
										<path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
										<path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
									</Icon>
								) : (
									<Icon filled>
										<path d="M7 4v16l13 -8z" />
									</Icon>
								)}
							</Button>
							{onNext ? (
								<Button
									variant="ghost"
									size="icon"
									aria-label={text.next}
									onClick={onNext}
								>
									<Icon>
										<path d="M4 5v14l12 -7z" />
										<path d="M20 5l0 14" />
									</Icon>
								</Button>
							) : null}
						</div>
						<div className={s.volume()}>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={level > 0 ? text.mute : text.unmute}
								onClick={toggleMute}
							>
								<Icon>
									<path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
									{level > 0 ? (
										<>
											<path d="M15 8a5 5 0 0 1 0 8" />
											<path d="M17.7 5a9 9 0 0 1 0 14" />
										</>
									) : (
										<path d="M16 10l4 4m0 -4l-4 4" />
									)}
								</Icon>
							</Button>
							<Slider
								size="sm"
								label={text.volume}
								min={0}
								max={100}
								step={1}
								value={Math.round(level * 100)}
								onValueChange={(v) => setVolume((v as number) / 100)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
