import { tv, type VariantProps } from "tailwind-variants";

export const candlestick = tv({
	slots: {
		candle:
			"transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0.42,0,0.58,1)]",
		wick: "fill-none stroke-(--candle) [stroke-linecap:round]",
		body: "stroke-(--candle)",
	},
	variants: {
		size: {
			narrow: { wick: "[stroke-width:1]", body: "[stroke-width:1]" },
			regular: { wick: "[stroke-width:1.5]", body: "[stroke-width:1.5]" },
			wide: { wick: "[stroke-width:2]", body: "[stroke-width:2]" },
		},
		// Up candles are hollow, down are filled, so direction never rests on colour alone.
		direction: {
			up: { body: "fill-background" },
			down: { body: "fill-(--candle)" },
		},
	},
	defaultVariants: { size: "regular", direction: "up" },
});

export type CandlestickSize = NonNullable<VariantProps<typeof candlestick>["size"]>;

/** Body width as a share of each candle's slot. */
export const CANDLE_BODY: Record<CandlestickSize, number> = {
	narrow: 0.4,
	regular: 0.6,
	wide: 0.8,
};
