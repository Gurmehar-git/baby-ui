import { createContext } from "svelte";

export type CarouselContext = {
	/** Called once by each CarouselItem during init; returns its position. */
	register: () => number;
	readonly index: number;
	slideLabel: (index: number) => string;
	slideId: (index: number) => string;
};

export const [getCarousel, setCarousel] = createContext<CarouselContext>();
