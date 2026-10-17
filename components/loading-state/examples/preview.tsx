import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
	LoadingStatePreview,
} from "@baby-ui/components/react/loading-state";

export default function LoadingStateWithPreview() {
	return (
		<LoadingState>
			<LoadingStateIndicator />
			<LoadingStateLabel>Subway surfing</LoadingStateLabel>
			<LoadingStateElapsed />
			<LoadingStatePreview src="https://95dnc2a95qgwt9ff.public.blob.vercel-storage.com/subway-surfers.mp4" />
		</LoadingState>
	);
}
