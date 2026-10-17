"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	formatElapsed,
	LOADING_PATTERNS,
	type LoadingStateVariant,
	loadingState,
} from "../variants";

export type { LoadingStateVariant };

type LoadingStateContextValue = {
	variant: LoadingStateVariant;
	styles: ReturnType<typeof loadingState>;
};

const LoadingStateContext = createContext<LoadingStateContextValue | null>(null);

function useLoadingState() {
	const state = useContext(LoadingStateContext);
	if (!state)
		throw new Error("LoadingState parts must be rendered inside a LoadingState.");
	return state;
}

export interface LoadingStateProps extends ComponentProps<"div"> {
	variant?: LoadingStateVariant;
}

/**
 * A status row from parts: LoadingStateIndicator, LoadingStateLabel and LoadingStateElapsed,
 * with an optional LoadingStatePreview underneath.
 */
export function LoadingState({
	variant = "drive",
	className,
	...props
}: LoadingStateProps) {
	const styles = loadingState({ variant });
	return (
		<LoadingStateContext.Provider value={{ variant, styles }}>
			<div
				data-slot="loading-state"
				role="status"
				className={cn(styles.root(), className)}
				{...props}
			/>
		</LoadingStateContext.Provider>
	);
}

/** The 3x3 pixel grid; reduced motion freezes it to its dim state. */
export function LoadingStateIndicator({ className }: { className?: string }) {
	const { variant, styles } = useLoadingState();
	const { delays, duration } = LOADING_PATTERNS[variant];
	return (
		<span
			data-slot="loading-state-indicator"
			aria-hidden
			className={cn(styles.indicator(), className)}
		>
			{delays.map((delay, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					key={index}
					className={cn(styles.cell(), delay !== null && "pixel-cell")}
					style={{
						opacity: delay === null ? 0.07 : 0.15,
						animationDuration: delay === null ? undefined : `${duration}ms`,
						animationDelay: delay === null ? undefined : `${delay}ms`,
					}}
				/>
			))}
		</span>
	);
}

export function LoadingStateLabel({ className, ...props }: ComponentProps<"span">) {
	const { styles } = useLoadingState();
	return (
		<span
			data-slot="loading-state-label"
			className={cn(styles.label(), className)}
			{...props}
		/>
	);
}

/** Time since this part mounted, ticking every tenth of a second. */
export function LoadingStateElapsed({ className }: { className?: string }) {
	const { styles } = useLoadingState();
	const [deciseconds, setDeciseconds] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setDeciseconds((d) => d + 1), 100);
		return () => clearInterval(id);
	}, []);
	return (
		<span data-slot="loading-state-elapsed" className={cn(styles.elapsed(), className)}>
			{formatElapsed(deciseconds)}
		</span>
	);
}

export interface LoadingStatePreviewProps {
	/** A looping video URL; without one, or if it fails, the fallback shows. */
	src?: string;
	/** Replaces the default "Video unavailable" placeholder. */
	children?: ReactNode;
	className?: string;
}

/** A looping video card under the row, for a "look away while this runs" long task. */
export function LoadingStatePreview({
	src,
	children,
	className,
}: LoadingStatePreviewProps) {
	const { styles } = useLoadingState();
	const [failed, setFailed] = useState(false);
	return (
		<div data-slot="loading-state-preview" className={cn(styles.preview(), className)}>
			<div className={styles.frame()}>
				{src && !failed ? (
					<video
						src={src}
						autoPlay
						muted
						loop
						playsInline
						onError={() => setFailed(true)}
						className={styles.video()}
					/>
				) : (
					(children ?? (
						<div className={styles.fallback()}>
							<LoadingStateIndicator />
							<span className={styles.fallbackText()}>Video unavailable</span>
						</div>
					))
				)}
			</div>
		</div>
	);
}
