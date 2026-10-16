import { type CSSProperties, createContext, type ReactNode, useContext } from "react";
import { cn } from "../../lib/react/cn";
import { type HeroStageMotion, heroStage } from "./variants";

export type { HeroStageMotion };

const MotionCtx = createContext<HeroStageMotion>("scroll");

export interface HeroStageProps {
	children: ReactNode;
	className?: string;
	/** `scroll` scatters the slots and settles them as the page scrolls; `enter` only fades them in. */
	motion?: HeroStageMotion;
}

export function HeroStage({ children, className, motion = "scroll" }: HeroStageProps) {
	const s = heroStage({ motion });
	return (
		<MotionCtx.Provider value={motion}>
			<div data-slot="hero-stage" className={cn(s.root(), className)}>
				<div className={s.frame()}>{children}</div>
			</div>
		</MotionCtx.Provider>
	);
}

export interface HeroStageSlotProps {
	children: ReactNode;
	className?: string;
	/** Entrance order; each step delays the slot by 110ms. */
	index?: number;
	/** Scattered offset in px and tilt in degrees, before scrolling settles it. */
	x?: number;
	y?: number;
	rotate?: number;
}

export function HeroStageSlot({
	children,
	className,
	index = 0,
	x = 0,
	y = 0,
	rotate = 0,
}: HeroStageSlotProps) {
	const s = heroStage({ motion: useContext(MotionCtx) });
	const scatter = {
		"--sx": `${x}px`,
		"--sy": `${y}px`,
		"--sr": `${rotate}deg`,
	} as CSSProperties;
	return (
		<div
			data-slot="hero-stage-slot"
			className={cn(s.slot(), className)}
			style={{ "--i": index } as CSSProperties}
		>
			<div className={s.card()} style={scatter}>
				{children}
			</div>
		</div>
	);
}
