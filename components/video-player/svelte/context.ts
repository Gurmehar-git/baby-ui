import { createContext } from "svelte";
import type {
	VideoPlayerErrorKind,
	VideoPlayerRendition,
	VideoPlayerVolumeLevel,
} from "./types";
import type { VideoPlayerVariant } from "./variants";

export type VideoPlayerContext = {
	readonly variant: VideoPlayerVariant;
	readonly root: HTMLElement | null;
	readonly fullscreen: boolean;
	readonly playing: boolean;
	readonly ended: boolean;
	readonly started: boolean;
	readonly pip: boolean;
	readonly currentTime: number;
	readonly duration: number;
	readonly volume: number;
	readonly muted: boolean;
	readonly level: VideoPlayerVolumeLevel;
	readonly loop: boolean;
	readonly playbackRate: number;
	readonly quality: number;
	readonly activeQuality: number;
	readonly error: VideoPlayerErrorKind | null;
	readonly attempt: number;
	readonly menuOpen: boolean;
	qualities: VideoPlayerRendition[];
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	setLoop: (loop: boolean) => void;
	setPlaybackRate: (rate: number) => void;
	setQuality: (quality: number) => void;
	setActiveQuality: (index: number) => void;
	setError: (error: VideoPlayerErrorKind | null) => void;
	retry: () => void;
	holdControls: (open: boolean) => void;
	/** The viewport's `<media-controller>`, registered by VideoPlayerViewport. */
	controller: HTMLElement | null;
	/** The `<video>`, registered by VideoPlayerContent. */
	video: HTMLVideoElement | null;
};

export const [getVideoPlayer, setVideoPlayer] = createContext<VideoPlayerContext>();
