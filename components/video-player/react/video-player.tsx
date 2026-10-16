"use client";

import type { default as Hls, HlsConfig } from "hls.js";
import type { MediaController as MediaControllerElement } from "media-chrome";
import {
	MediaControlBar,
	MediaController,
	MediaFullscreenButton,
	MediaLoadingIndicator,
	MediaMuteButton,
	MediaPipButton,
	MediaPlayButton,
	MediaPreviewTimeDisplay,
	MediaSeekBackwardButton,
	MediaSeekForwardButton,
	MediaTimeRange,
	MediaVolumeRange,
} from "media-chrome/react";
import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	type Ref,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { button } from "../../button/react/variants";
import { cardFrame } from "../../card/react/variants";
import { cn } from "../../lib/react/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import { RadioGroup, RadioGroupItem } from "../../radio-group/react/radio-group";
import {
	clampVolume,
	formatPlaybackRate,
	formatQuality,
	formatVideoTime,
	isHlsSource,
	mediaErrorKind,
	routesToHotkeys,
	screenOpen,
	VIDEO_ERROR_MESSAGES,
	VIDEO_HOTKEY_SCROLL_KEYS,
	VIDEO_PLAYBACK_RATES,
	VIDEO_QUALITY_AUTO,
	VIDEO_SEEK_TOLERANCE,
	type VideoPlayerErrorKind,
	type VideoPlayerRendition,
	type VideoPlayerScreenTrigger,
	type VideoPlayerVolumeLevel,
	volumeLevel,
} from "./types";
import {
	VIDEO_PLAYER_CARD,
	type VideoPlayerButtonSize,
	type VideoPlayerVariant,
	videoPlayer,
	videoPlayerButton,
} from "./variants";

export type {
	VideoPlayerButtonSize,
	VideoPlayerErrorKind,
	VideoPlayerRendition,
	VideoPlayerScreenTrigger,
	VideoPlayerVariant,
	VideoPlayerVolumeLevel,
};

type VideoPlayerContextValue = {
	variant: VideoPlayerVariant;
	root: HTMLElement | null;
	fullscreen: boolean;
	playing: boolean;
	ended: boolean;
	started: boolean;
	pip: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	setVolume: (volume: number) => void;
	muted: boolean;
	setMuted: (muted: boolean) => void;
	level: VideoPlayerVolumeLevel;
	loop: boolean;
	setLoop: (loop: boolean) => void;
	playbackRate: number;
	setPlaybackRate: (rate: number) => void;
	quality: number;
	setQuality: (quality: number) => void;
	qualities: VideoPlayerRendition[];
	setQualities: (qualities: VideoPlayerRendition[]) => void;
	activeQuality: number;
	setActiveQuality: (index: number) => void;
	error: VideoPlayerErrorKind | null;
	setError: (error: VideoPlayerErrorKind | null) => void;
	attempt: number;
	retry: () => void;
	menuOpen: boolean;
	holdControls: (open: boolean) => void;
	controller: MediaControllerElement | null;
	setController: (controller: MediaControllerElement | null) => void;
	setVideo: (video: HTMLVideoElement | null) => void;
};

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

function useVideoPlayer(part: string) {
	const context = useContext(VideoPlayerContext);
	if (!context) throw new Error(`<${part}> must be used inside <VideoPlayer>.`);
	return context;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
}

function useControlled<T>(
	prop: T | undefined,
	initial: T,
	onChange?: (value: T) => void,
) {
	const [inner, setInner] = useState(initial);
	const value = prop ?? inner;
	const latest = useRef(value);
	latest.current = value;
	const notify = useRef(onChange);
	notify.current = onChange;
	const controlled = prop !== undefined;
	const set = useCallback(
		(next: T) => {
			if (Object.is(next, latest.current)) return;
			latest.current = next;
			if (!controlled) setInner(next);
			notify.current?.(next);
		},
		[controlled],
	);
	return [value, set] as const;
}

/** Keeps the bar visible while a menu is open, even though its popup is portalled out of the bar. */
function useHoldControls(open: boolean, holdControls: (open: boolean) => void) {
	useEffect(() => {
		if (!open) return;
		holdControls(true);
		return () => holdControls(false);
	}, [open, holdControls]);
}

function Icon({
	className,
	shown,
	glyph,
	children,
}: {
	className?: string;
	shown?: boolean;
	/** `fill` marks a glyph the large play button paints solid. */
	glyph?: "fill";
	children: ReactNode;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			data-shown={shown}
			data-glyph={glyph}
			className={className}
		>
			{children}
		</svg>
	);
}

function SpeakerIcon({
	level,
	className,
}: {
	level: VideoPlayerVolumeLevel;
	className: string;
}) {
	return (
		<Icon>
			<path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
			<path data-shown={level !== "off"} className={className} d="M15 8a5 5 0 0 1 0 8" />
			<path
				data-shown={level === "high"}
				className={className}
				d="M17.7 5a9 9 0 0 1 0 14"
			/>
			<path data-shown={level === "off"} className={className} d="M16 10l4 4m0 -4l-4 4" />
		</Icon>
	);
}

export interface VideoPlayerProps
	extends Omit<ComponentProps<"section">, "onVolumeChange" | "onError"> {
	variant?: VideoPlayerVariant;
	playing?: boolean;
	defaultPlaying?: boolean;
	onPlayingChange?: (playing: boolean) => void;
	/** Playhead in seconds. */
	currentTime?: number;
	defaultCurrentTime?: number;
	onCurrentTimeChange?: (seconds: number) => void;
	/** 0 to 1. */
	volume?: number;
	defaultVolume?: number;
	onVolumeChange?: (volume: number) => void;
	muted?: boolean;
	defaultMuted?: boolean;
	onMutedChange?: (muted: boolean) => void;
	loop?: boolean;
	defaultLoop?: boolean;
	onLoopChange?: (loop: boolean) => void;
	playbackRate?: number;
	defaultPlaybackRate?: number;
	onPlaybackRateChange?: (rate: number) => void;
	/** HLS rendition index, or `-1` for automatic. */
	quality?: number;
	defaultQuality?: number;
	onQualityChange?: (quality: number) => void;
	/** Fires when playback fails; `VideoPlayerError` shows the matching message. */
	onError?: (error: VideoPlayerErrorKind) => void;
	/** Accessible name of the player region. */
	label?: string;
}

/** Root of a composable video player; every playback value is controllable from here. */
export function VideoPlayer({
	variant = "default",
	playing: playingProp,
	defaultPlaying = false,
	onPlayingChange,
	currentTime: currentTimeProp,
	defaultCurrentTime = 0,
	onCurrentTimeChange,
	volume: volumeProp,
	defaultVolume = 1,
	onVolumeChange,
	muted: mutedProp,
	defaultMuted = false,
	onMutedChange,
	loop: loopProp,
	defaultLoop = false,
	onLoopChange,
	playbackRate: playbackRateProp,
	defaultPlaybackRate = 1,
	onPlaybackRateChange,
	quality: qualityProp,
	defaultQuality = VIDEO_QUALITY_AUTO,
	onQualityChange,
	onError,
	label = "Video player",
	className,
	ref,
	children,
	onKeyDown,
	onKeyUp,
	...props
}: VideoPlayerProps) {
	const s = videoPlayer({ variant });
	const [root, setRoot] = useState<HTMLElement | null>(null);
	const [video, setVideo] = useState<HTMLVideoElement | null>(null);
	const [controller, setController] = useState<MediaControllerElement | null>(null);
	const [duration, setDuration] = useState(0);
	const [ended, setEnded] = useState(false);
	const [started, setStarted] = useState(false);
	const [pip, setPip] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const [qualities, setQualities] = useState<VideoPlayerRendition[]>([]);
	const [activeQuality, setActiveQuality] = useState(VIDEO_QUALITY_AUTO);
	const [error, setErrorState] = useState<VideoPlayerErrorKind | null>(null);
	const [attempt, setAttempt] = useState(0);
	const [menus, setMenus] = useState(0);
	const [playing, setPlaying] = useControlled(
		playingProp,
		defaultPlaying,
		onPlayingChange,
	);
	const [currentTime, setCurrentTime] = useControlled(
		currentTimeProp,
		defaultCurrentTime,
		onCurrentTimeChange,
	);
	const [volume, setVolume] = useControlled(volumeProp, defaultVolume, onVolumeChange);
	const [muted, setMuted] = useControlled(mutedProp, defaultMuted, onMutedChange);
	const [loop, setLoop] = useControlled(loopProp, defaultLoop, onLoopChange);
	const [playbackRate, setPlaybackRate] = useControlled(
		playbackRateProp,
		defaultPlaybackRate,
		onPlaybackRateChange,
	);
	const [quality, setQuality] = useControlled(
		qualityProp,
		defaultQuality,
		onQualityChange,
	);
	const errorRef = useRef(onError);
	errorRef.current = onError;

	const setError = useCallback((next: VideoPlayerErrorKind | null) => {
		setErrorState(next);
		if (next) errorRef.current?.(next);
	}, []);
	const retry = useCallback(() => {
		setErrorState(null);
		setAttempt((n) => n + 1);
	}, []);
	const holdControls = useCallback(
		(open: boolean) => setMenus((n) => Math.max(0, n + (open ? 1 : -1))),
		[],
	);

	useEffect(() => {
		if (!video) return;
		const readDuration = () =>
			setDuration(Number.isFinite(video.duration) ? video.duration : 0);
		const readTime = () => setCurrentTime(video.currentTime);
		const listeners: [string, () => void][] = [
			[
				"play",
				() => {
					setPlaying(true);
					setEnded(false);
					setStarted(true);
				},
			],
			["pause", () => setPlaying(false)],
			["ended", () => setEnded(true)],
			["seeking", () => setEnded(false)],
			["timeupdate", readTime],
			["seeked", readTime],
			["durationchange", readDuration],
			["loadedmetadata", readDuration],
			[
				"emptied",
				() => {
					readDuration();
					setStarted(false);
					setEnded(false);
				},
			],
			[
				"volumechange",
				() => {
					setVolume(video.volume);
					setMuted(video.muted);
				},
			],
			["ratechange", () => setPlaybackRate(video.playbackRate)],
			["enterpictureinpicture", () => setPip(true)],
			["leavepictureinpicture", () => setPip(false)],
			["error", () => setError(mediaErrorKind(video.error?.code))],
		];
		for (const [name, listener] of listeners) video.addEventListener(name, listener);
		readDuration();
		return () => {
			for (const [name, listener] of listeners) video.removeEventListener(name, listener);
		};
	}, [video, setPlaying, setCurrentTime, setVolume, setMuted, setPlaybackRate, setError]);

	// Muted is applied before play, so a muted autoplay clears the browser's autoplay policy.
	useEffect(() => {
		if (video && video.muted !== muted) video.muted = muted;
	}, [video, muted]);

	useEffect(() => {
		const next = clampVolume(volume);
		if (video && Math.abs(video.volume - next) > 0.001) video.volume = next;
	}, [video, volume]);

	useEffect(() => {
		if (video) video.loop = loop;
	}, [video, loop]);

	useEffect(() => {
		if (video && video.playbackRate !== playbackRate) video.playbackRate = playbackRate;
	}, [video, playbackRate]);

	useEffect(() => {
		if (video && Math.abs(video.currentTime - currentTime) > VIDEO_SEEK_TOLERANCE)
			video.currentTime = Math.max(0, currentTime);
	}, [video, currentTime]);

	useEffect(() => {
		if (!video) return;
		if (playing && video.paused) video.play().catch(() => setPlaying(false));
		else if (!playing && !video.paused) video.pause();
	}, [video, playing, setPlaying]);

	// Fullscreen takes the whole player, so a control row outside the video comes along.
	useEffect(() => {
		if (controller && root) controller.fullscreenElement = root;
	}, [controller, root]);

	useEffect(() => {
		const read = () => setFullscreen(!!root && document.fullscreenElement === root);
		document.addEventListener("fullscreenchange", read);
		return () => document.removeEventListener("fullscreenchange", read);
	}, [root]);

	const context = useMemo<VideoPlayerContextValue>(
		() => ({
			variant,
			root,
			fullscreen,
			playing,
			ended,
			started,
			pip,
			currentTime,
			duration,
			volume,
			setVolume,
			muted,
			setMuted,
			level: volumeLevel(volume, muted),
			loop,
			setLoop,
			playbackRate,
			setPlaybackRate,
			quality,
			setQuality,
			qualities,
			setQualities,
			activeQuality,
			setActiveQuality,
			error,
			setError,
			attempt,
			retry,
			menuOpen: menus > 0,
			holdControls,
			controller,
			setController,
			setVideo,
		}),
		[
			variant,
			root,
			fullscreen,
			playing,
			ended,
			started,
			pip,
			currentTime,
			duration,
			volume,
			setVolume,
			muted,
			setMuted,
			loop,
			setLoop,
			playbackRate,
			setPlaybackRate,
			quality,
			setQuality,
			qualities,
			activeQuality,
			error,
			setError,
			attempt,
			retry,
			menus,
			holdControls,
			controller,
		],
	);

	return (
		<VideoPlayerContext.Provider value={context}>
			<section
				ref={(node) => {
					setRoot(node);
					assignRef(ref, node);
				}}
				aria-label={label}
				// Media-chrome only hears hotkeys inside its controller; keys from the bar are handed to it.
				onKeyDown={(event) => {
					onKeyDown?.(event);
					const native = event.nativeEvent;
					if (controller && routesToHotkeys(native, controller))
						if (VIDEO_HOTKEY_SCROLL_KEYS.includes(event.key)) event.preventDefault();
				}}
				onKeyUp={(event) => {
					onKeyUp?.(event);
					if (controller && routesToHotkeys(event.nativeEvent, controller))
						controller.keyboardShortcutHandler(event.nativeEvent);
				}}
				data-slot="video-player"
				data-variant={variant}
				data-playing={playing}
				data-ended={ended}
				className={cn(
					cardFrame({ variant: VIDEO_PLAYER_CARD[variant] }).root(),
					s.root(),
					className,
				)}
				{...props}
			>
				{children}
			</section>
		</VideoPlayerContext.Provider>
	);
}

export type VideoPlayerViewportProps = ComponentProps<typeof MediaController>;

/** The video frame: holds the media element and anything layered over it. */
export function VideoPlayerViewport({
	className,
	ref,
	...props
}: VideoPlayerViewportProps) {
	const { variant, setController } = useVideoPlayer("VideoPlayerViewport");
	return (
		<MediaController
			ref={(node: MediaControllerElement | null) => {
				setController(node);
				assignRef(ref, node);
			}}
			data-slot="video-player-viewport"
			className={cn(videoPlayer({ variant }).viewport(), className)}
			{...props}
		/>
	);
}

export interface VideoPlayerContentProps extends ComponentProps<"video"> {
	/** Passed to hls.js when an `.m3u8` source starts; read once per source. */
	hlsConfig?: Partial<HlsConfig>;
	/** Receives the hls.js instance, or null when the source is not HLS. */
	hlsRef?: Ref<Hls | null>;
}

/** The `<video>` element. An `.m3u8` source streams through hls.js, loaded only when needed. */
export function VideoPlayerContent({
	className,
	ref,
	src,
	hlsConfig,
	hlsRef,
	...props
}: VideoPlayerContentProps) {
	const {
		variant,
		setVideo,
		quality,
		setQualities,
		setActiveQuality,
		setError,
		attempt,
	} = useVideoPlayer("VideoPlayerContent");
	const [element, setElement] = useState<HTMLVideoElement | null>(null);
	const [hls, setHls] = useState<Hls | null>(null);
	const hlsSrc = isHlsSource(src) ? src : undefined;
	const config = useRef(hlsConfig);
	config.current = hlsConfig;
	const hlsTarget = useRef(hlsRef);
	hlsTarget.current = hlsRef;

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: attempt.
	useEffect(() => {
		if (!element || !hlsSrc) return;
		let instance: Hls | null = null;
		let cancelled = false;
		// Safari plays HLS natively; everything with Media Source Extensions goes through hls.js.
		if (!("MediaSource" in window || "ManagedMediaSource" in window)) {
			element.src = hlsSrc;
			return;
		}
		import("hls.js").then(({ default: HlsEngine }) => {
			if (cancelled) return;
			if (!HlsEngine.isSupported()) {
				element.src = hlsSrc;
				return;
			}
			const engine = new HlsEngine(config.current);
			instance = engine;
			let recovered = false;
			engine.on(HlsEngine.Events.MANIFEST_PARSED, () =>
				setQualities(
					engine.levels.map((level, index) => ({
						index,
						height: level.height,
						bitrate: level.bitrate,
					})),
				),
			);
			engine.on(HlsEngine.Events.LEVEL_SWITCHED, (_, data) =>
				setActiveQuality(data.level),
			);
			engine.on(HlsEngine.Events.ERROR, (_, data) => {
				if (!data.fatal) return;
				if (data.type === HlsEngine.ErrorTypes.MEDIA_ERROR && !recovered) {
					recovered = true;
					engine.recoverMediaError();
					return;
				}
				setError(data.type === HlsEngine.ErrorTypes.NETWORK_ERROR ? "network" : "decode");
			});
			engine.loadSource(hlsSrc);
			engine.attachMedia(element);
			setHls(engine);
		});
		return () => {
			cancelled = true;
			instance?.destroy();
			setHls(null);
			setQualities([]);
			setActiveQuality(VIDEO_QUALITY_AUTO);
		};
	}, [element, hlsSrc, attempt, setQualities, setActiveQuality, setError]);

	useEffect(() => assignRef(hlsTarget.current, hls), [hls]);

	useEffect(() => {
		if (hls && hls.currentLevel !== quality) hls.currentLevel = quality;
	}, [hls, quality]);

	useEffect(() => {
		if (element && !hlsSrc && attempt > 0) element.load();
	}, [element, hlsSrc, attempt]);

	return (
		<video
			ref={(node) => {
				setElement(node);
				setVideo(node);
				assignRef(ref, node);
			}}
			slot="media"
			data-slot="video-player-content"
			playsInline
			preload="metadata"
			src={hlsSrc ? undefined : src}
			className={cn(videoPlayer({ variant }).content(), className)}
			{...props}
		/>
	);
}

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

/** The control row. It drives the viewport from outside it, so it can sit under or over the video. */
export function VideoPlayerControlBar({
	className,
	ref,
	...props
}: VideoPlayerControlBarProps) {
	const { variant, controller, menuOpen } = useVideoPlayer("VideoPlayerControlBar");
	const [bar, setBar] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!controller || !bar) return;
		controller.associateElement(bar);
		return () => controller.unassociateElement(bar);
	}, [controller, bar]);

	return (
		<MediaControlBar
			ref={(node: HTMLElement | null) => {
				setBar(node);
				assignRef(ref, node);
			}}
			data-slot="video-player-control-bar"
			data-menu-open={String(menuOpen)}
			className={cn(videoPlayer({ variant }).controlBar(), className)}
			{...props}
		/>
	);
}

function iconButton(variant: VideoPlayerVariant, className?: string) {
	return cn(
		button({ variant: "ghost", size: "icon-sm" }),
		videoPlayer({ variant }).button(),
		className,
	);
}

export interface VideoPlayerPlayButtonProps
	extends ComponentProps<typeof MediaPlayButton> {
	/** `lg` is a round control centred over the video, for use inside the viewport. */
	size?: VideoPlayerButtonSize;
}

/** Play, pause, and replay once the video has ended. */
export function VideoPlayerPlayButton({
	size = "default",
	className,
	...props
}: VideoPlayerPlayButtonProps) {
	const { variant, playing, ended } = useVideoPlayer("VideoPlayerPlayButton");
	const s = videoPlayer({ variant });
	return (
		<MediaPlayButton
			noTooltip
			data-slot="video-player-play-button"
			data-size={size}
			// The media-chrome wrappers write `true` as an empty attribute, so state goes in as text.
			data-playing={String(playing)}
			className={iconButton(variant, cn(videoPlayerButton({ size, variant }), className))}
			{...props}
		>
			<span slot="icon" className={s.iconStack()}>
				<Icon shown={!playing && !ended} glyph="fill" className={s.swapIcon()}>
					<path d="M7 4v16l13 -8z" />
				</Icon>
				<Icon shown={playing} glyph="fill" className={s.swapIcon()}>
					<path d="M6 5h3v14h-3z" />
					<path d="M15 5h3v14h-3z" />
				</Icon>
				<Icon shown={!playing && ended} className={s.swapIcon()}>
					<path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
				</Icon>
			</span>
		</MediaPlayButton>
	);
}

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
	typeof MediaSeekBackwardButton
>;

export function VideoPlayerSeekBackwardButton({
	className,
	seekOffset = 10,
	...props
}: VideoPlayerSeekBackwardButtonProps) {
	const { variant } = useVideoPlayer("VideoPlayerSeekBackwardButton");
	const s = videoPlayer({ variant });
	return (
		<MediaSeekBackwardButton
			noTooltip
			seekOffset={seekOffset}
			data-slot="video-player-seek-backward-button"
			className={iconButton(variant, cn(s.seekButton(), className))}
			{...props}
		>
			<span slot="icon" data-direction="backward" className={s.seekIcon()}>
				<Icon>
					<path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
				</Icon>
			</span>
		</MediaSeekBackwardButton>
	);
}

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
	typeof MediaSeekForwardButton
>;

export function VideoPlayerSeekForwardButton({
	className,
	seekOffset = 10,
	...props
}: VideoPlayerSeekForwardButtonProps) {
	const { variant } = useVideoPlayer("VideoPlayerSeekForwardButton");
	const s = videoPlayer({ variant });
	return (
		<MediaSeekForwardButton
			noTooltip
			seekOffset={seekOffset}
			data-slot="video-player-seek-forward-button"
			className={iconButton(variant, cn(s.seekButton(), className))}
			{...props}
		>
			<span slot="icon" data-direction="forward" className={s.seekIcon()}>
				<Icon>
					<path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
				</Icon>
			</span>
		</MediaSeekForwardButton>
	);
}

export interface VideoPlayerTimeRangeProps extends ComponentProps<typeof MediaTimeRange> {
	/** Shows the time under the pointer while hovering the scrubber. */
	showPreview?: boolean;
}

/** The scrubber, with the buffered span drawn behind the playhead. */
export function VideoPlayerTimeRange({
	showPreview = true,
	className,
	children,
	...props
}: VideoPlayerTimeRangeProps) {
	const { variant } = useVideoPlayer("VideoPlayerTimeRange");
	const s = videoPlayer({ variant });
	return (
		<MediaTimeRange
			data-slot="video-player-time-range"
			className={cn(s.range(), s.timeRange(), className)}
			{...props}
		>
			{showPreview ? (
				<MediaPreviewTimeDisplay slot="preview" className={s.preview()} />
			) : null}
			{children}
		</MediaTimeRange>
	);
}

function TickingText({ text, className }: { text: string; className: string }) {
	const chars = [...text];
	return chars.map((char, i) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
		<span key={`${chars.length - i}:${char}`} className={className}>
			{char}
		</span>
	));
}

export interface VideoPlayerTimeDisplayProps extends ComponentProps<"span"> {
	/** Appends the total length, as in `0:12 / 1:30`. */
	showDuration?: boolean;
	/** Shows time left (`-1:18`) instead of time elapsed. */
	remaining?: boolean;
	formatTime?: (seconds: number) => string;
}

/** Elapsed time; each character that changes ticks up into place. */
export function VideoPlayerTimeDisplay({
	showDuration = true,
	remaining = false,
	formatTime = formatVideoTime,
	className,
	...props
}: VideoPlayerTimeDisplayProps) {
	const { variant, currentTime, duration } = useVideoPlayer("VideoPlayerTimeDisplay");
	const s = videoPlayer({ variant });
	const shown = remaining
		? `-${formatTime(Math.max(0, duration - Math.floor(currentTime)))}`
		: formatTime(Math.floor(currentTime));
	return (
		<span
			data-slot="video-player-time-display"
			className={cn(s.time(), className)}
			{...props}
		>
			<span className={s.timeValue()}>
				<TickingText text={shown} className={s.timeChar()} />
			</span>
			{showDuration ? (
				<>
					<span aria-hidden className={s.separator()}>
						/
					</span>
					<span className={s.timeValue()}>
						<TickingText text={formatTime(duration)} className={s.timeChar()} />
					</span>
				</>
			) : null}
		</span>
	);
}

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export function VideoPlayerMuteButton({
	className,
	...props
}: VideoPlayerMuteButtonProps) {
	const { variant, level } = useVideoPlayer("VideoPlayerMuteButton");
	const s = videoPlayer({ variant });
	return (
		<MediaMuteButton
			noTooltip
			data-slot="video-player-mute-button"
			data-level={level}
			className={iconButton(variant, className)}
			{...props}
		>
			<span slot="icon" className={s.iconStack()}>
				<SpeakerIcon level={level} className={s.wave()} />
			</span>
		</MediaMuteButton>
	);
}

export interface VideoPlayerVolumeProps {
	/** Names the trigger and the popup. */
	label?: string;
	/** Opens on hover as well as on click. */
	openOnHover?: boolean;
	openDelay?: number;
	closeDelay?: number;
	/** Forwarded to the media-chrome volume range inside the popup. */
	rangeProps?: ComponentProps<typeof MediaVolumeRange>;
	className?: string;
}

/** A speaker button that opens a volume range, styled like the scrubber, beside a mute toggle. */
export function VideoPlayerVolume({
	label = "Volume",
	openOnHover = true,
	openDelay = 0,
	closeDelay = 200,
	rangeProps,
	className,
}: VideoPlayerVolumeProps) {
	const { variant, root, fullscreen, controller, volume, muted, level, holdControls } =
		useVideoPlayer("VideoPlayerVolume");
	const s = videoPlayer({ variant });
	// The popup sits on the popover surface, so its controls take the light-surface look.
	const surface = videoPlayer({ variant: "default" });
	const [open, setOpen] = useState(false);
	const [panel, setPanel] = useState<HTMLDivElement | null>(null);
	const percent = muted ? 0 : Math.round(clampVolume(volume) * 100);
	useHoldControls(open, holdControls);

	// Portalled out of the bar, so the panel registers with the controller itself.
	useEffect(() => {
		if (!controller || !panel) return;
		controller.associateElement(panel);
		return () => controller.unassociateElement(panel);
	}, [controller, panel]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				openOnHover={openOnHover}
				delay={openDelay}
				closeDelay={closeDelay}
				aria-label={label}
				data-slot="video-player-volume"
				data-level={level}
				className={iconButton(variant, className)}
			>
				<span className={s.iconStack()}>
					<SpeakerIcon level={level} className={s.wave()} />
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={8}
				aria-label={label}
				container={fullscreen ? root : undefined}
				className={s.volumeMenu()}
			>
				<div ref={setPanel} className={s.volumePanel()}>
					<MediaMuteButton
						noTooltip
						data-level={level}
						className={iconButton("default", "size-7")}
					>
						<span slot="icon" className={s.iconStack()}>
							<SpeakerIcon level={level} className={s.wave()} />
						</span>
					</MediaMuteButton>
					<MediaVolumeRange
						{...rangeProps}
						className={cn(surface.range(), s.volumeRange(), rangeProps?.className)}
					/>
					<span className={s.volumeValue()}>{percent}</span>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export interface VideoPlayerPlaybackRateProps {
	/** Speeds offered, as multipliers. */
	rates?: number[];
	label?: string;
	formatRate?: (rate: number) => string;
	className?: string;
}

/** The current speed as a button; it opens a list of speeds. */
export function VideoPlayerPlaybackRate({
	rates = VIDEO_PLAYBACK_RATES,
	label = "Speed",
	formatRate = formatPlaybackRate,
	className,
}: VideoPlayerPlaybackRateProps) {
	const { variant, root, fullscreen, playbackRate, setPlaybackRate, holdControls } =
		useVideoPlayer("VideoPlayerPlaybackRate");
	const s = videoPlayer({ variant });
	const [open, setOpen] = useState(false);
	useHoldControls(open, holdControls);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${label}: ${formatRate(playbackRate)}`}
				data-slot="video-player-playback-rate"
				className={cn(
					button({ variant: "ghost", size: "sm" }),
					s.button(),
					s.menuTrigger(),
					className,
				)}
			>
				<span key={playbackRate} className={s.menuValue()}>
					{formatRate(playbackRate)}
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={8}
				aria-label={label}
				container={fullscreen ? root : undefined}
				className={s.menu()}
			>
				<p className={s.menuLabel()}>{label}</p>
				<RadioGroup
					variant="list"
					size="sm"
					value={String(playbackRate)}
					onValueChange={(next) => {
						setPlaybackRate(Number(next));
						setOpen(false);
					}}
				>
					{rates.map((rate) => (
						<RadioGroupItem key={rate} value={String(rate)} label={formatRate(rate)} />
					))}
				</RadioGroup>
			</PopoverContent>
		</Popover>
	);
}

export interface VideoPlayerQualityProps {
	label?: string;
	autoLabel?: string;
	formatQuality?: (quality: VideoPlayerRendition) => string;
	className?: string;
}

/** HLS rendition picker. Renders nothing until the stream offers more than one rendition. */
export function VideoPlayerQuality({
	label = "Quality",
	autoLabel = "Auto",
	formatQuality: format = formatQuality,
	className,
}: VideoPlayerQualityProps) {
	const {
		variant,
		root,
		fullscreen,
		quality,
		setQuality,
		qualities,
		activeQuality,
		holdControls,
	} = useVideoPlayer("VideoPlayerQuality");
	const s = videoPlayer({ variant });
	const [open, setOpen] = useState(false);
	useHoldControls(open, holdControls);
	if (qualities.length < 2) return null;

	const byHeight = [...qualities].sort(
		(a, b) => b.height - a.height || b.bitrate - a.bitrate,
	);
	const active = qualities.find((q) => q.index === activeQuality);
	const current = qualities.find((q) => q.index === quality);
	const shown = current ? format(current) : autoLabel;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${label}: ${shown}`}
				data-slot="video-player-quality"
				className={cn(
					button({ variant: "ghost", size: "sm" }),
					s.button(),
					s.menuTrigger(),
					className,
				)}
			>
				<span key={shown} className={s.menuValue()}>
					{shown}
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={8}
				aria-label={label}
				container={fullscreen ? root : undefined}
				className={s.menu()}
			>
				<p className={s.menuLabel()}>{label}</p>
				<RadioGroup
					variant="list"
					size="sm"
					value={String(quality)}
					onValueChange={(next) => {
						setQuality(Number(next));
						setOpen(false);
					}}
				>
					<RadioGroupItem value={String(VIDEO_QUALITY_AUTO)}>
						<span className="flex w-full items-center">
							{autoLabel}
							{active ? <span className={s.menuHint()}>{format(active)}</span> : null}
						</span>
					</RadioGroupItem>
					{byHeight.map((q) => (
						<RadioGroupItem key={q.index} value={String(q.index)} label={format(q)} />
					))}
				</RadioGroup>
			</PopoverContent>
		</Popover>
	);
}

export type VideoPlayerLoopButtonProps = Omit<
	ComponentProps<"button">,
	"onClick" | "aria-pressed"
>;

/** Toggles the root's `loop`; the arrows turn over as it switches. */
export function VideoPlayerLoopButton({
	className,
	"aria-label": label = "Loop",
	...props
}: VideoPlayerLoopButtonProps) {
	const { variant, loop, setLoop } = useVideoPlayer("VideoPlayerLoopButton");
	const s = videoPlayer({ variant });
	return (
		<button
			type="button"
			data-slot="video-player-loop-button"
			aria-label={label}
			aria-pressed={loop}
			className={iconButton(variant, cn(s.loopButton(), className))}
			onClick={() => setLoop(!loop)}
			{...props}
		>
			<Icon className={s.loopIcon()}>
				<path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
				<path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
			</Icon>
			<span aria-hidden className={s.loopDot()} />
		</button>
	);
}

export type VideoPlayerPipButtonProps = ComponentProps<typeof MediaPipButton>;

/** Picture in picture; hidden where the browser has none. */
export function VideoPlayerPipButton({ className, ...props }: VideoPlayerPipButtonProps) {
	const { variant, pip } = useVideoPlayer("VideoPlayerPipButton");
	const s = videoPlayer({ variant });
	return (
		<MediaPipButton
			noTooltip
			data-slot="video-player-pip-button"
			data-pip={String(pip)}
			className={iconButton(variant, cn("[&[mediapipunavailable]]:hidden", className))}
			{...props}
		>
			<span slot="icon" className={s.iconStack()}>
				<Icon shown={!pip} className={s.swapIcon()}>
					<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
					<path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" />
				</Icon>
				<Icon shown={pip} className={s.swapIcon()}>
					<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
					<path d="M7 9l4 4m-4 -1v-3h3" />
				</Icon>
			</span>
		</MediaPipButton>
	);
}

export type VideoPlayerFullscreenButtonProps = ComponentProps<
	typeof MediaFullscreenButton
>;

export function VideoPlayerFullscreenButton({
	className,
	...props
}: VideoPlayerFullscreenButtonProps) {
	const { variant, fullscreen } = useVideoPlayer("VideoPlayerFullscreenButton");
	const s = videoPlayer({ variant });
	return (
		<MediaFullscreenButton
			noTooltip
			data-slot="video-player-fullscreen-button"
			data-fullscreen={String(fullscreen)}
			className={iconButton(
				variant,
				cn("[&[mediafullscreenunavailable]]:hidden", className),
			)}
			{...props}
		>
			<span slot="icon" className={s.iconStack()}>
				<Icon shown={!fullscreen} className={s.swapIcon()}>
					<path d="M4 8v-2a2 2 0 0 1 2 -2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2 -2v-2" />
				</Icon>
				<Icon shown={fullscreen} className={s.swapIcon()}>
					<path d="M15 19v-2a2 2 0 0 1 2 -2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2 -2v-2" />
				</Icon>
			</span>
		</MediaFullscreenButton>
	);
}

export interface VideoPlayerLoadingIndicatorProps
	extends ComponentProps<typeof MediaLoadingIndicator> {
	/** Milliseconds of buffering before the spinner shows, so brief stalls never flash it. */
	loadingDelay?: number;
}

/** A spinner over the video while playback waits on data; place it inside the viewport. */
export function VideoPlayerLoadingIndicator({
	loadingDelay = 500,
	className,
	...props
}: VideoPlayerLoadingIndicatorProps) {
	const { variant } = useVideoPlayer("VideoPlayerLoadingIndicator");
	const s = videoPlayer({ variant });
	return (
		<MediaLoadingIndicator
			noAutohide
			style={
				{
					"--media-loading-indicator-transition-delay": `${loadingDelay}ms`,
				} as CSSProperties
			}
			data-slot="video-player-loading-indicator"
			className={cn(s.loading(), className)}
			{...props}
		>
			<span slot="icon" className={s.loadingIcon()}>
				<Icon>
					<path d="M12 3a9 9 0 1 0 9 9" />
				</Icon>
			</span>
		</MediaLoadingIndicator>
	);
}

export interface VideoPlayerErrorProps extends ComponentProps<"div"> {
	/** Overrides the message for any error kind. */
	messages?: Partial<Record<VideoPlayerErrorKind, string>>;
	retryLabel?: string;
}

/** Covers the video with the failure reason and a retry button; place it inside the viewport. */
export function VideoPlayerError({
	messages,
	retryLabel = "Try again",
	className,
	...props
}: VideoPlayerErrorProps) {
	const { variant, error, retry } = useVideoPlayer("VideoPlayerError");
	const s = videoPlayer({ variant });
	if (!error) return null;
	return (
		<div
			role="alert"
			data-slot="video-player-error"
			data-error={error}
			className={cn(s.error(), className)}
			{...props}
		>
			<p className={s.errorMessage()}>
				{messages?.[error] ?? VIDEO_ERROR_MESSAGES[error]}
			</p>
			<button
				type="button"
				onClick={retry}
				className={cn(button({ variant: "outline", size: "sm" }), s.errorAction())}
			>
				<Icon>
					<path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
				</Icon>
				{retryLabel}
			</button>
		</div>
	);
}

export interface VideoPlayerEndScreenProps extends ComponentProps<"div"> {
	/** Opens on its own after the video ends, before the first play, or whenever paused. */
	when?: VideoPlayerScreenTrigger;
	/** Forces the screen open or shut, overriding `when`. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/** A screen over the video for a call to action, a banner or a replay; place it inside the viewport. */
export function VideoPlayerEndScreen({
	when = "ended",
	open: openProp,
	onOpenChange,
	className,
	children,
	...props
}: VideoPlayerEndScreenProps) {
	const { variant, playing, ended, started } = useVideoPlayer("VideoPlayerEndScreen");
	const s = videoPlayer({ variant });
	const open = openProp ?? screenOpen(when, { playing, ended, started });
	const notify = useRef(onOpenChange);
	notify.current = onOpenChange;
	const first = useRef(true);

	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		notify.current?.(open);
	}, [open]);

	return (
		<div
			data-slot="video-player-end-screen"
			data-open={open}
			aria-hidden={!open}
			inert={!open}
			className={cn(s.endScreen(), className)}
			{...props}
		>
			<div className={s.endScreenBody()}>{children}</div>
		</div>
	);
}
