import { getContext, setContext } from "svelte";
import type { Pricing01Period } from "../types";
import type { Pricing01Variant, pricing01 } from "../variants";

/** What Pricing01 shares with its parts; read through getters so they stay reactive. */
export interface Pricing01State {
	readonly variant: Pricing01Variant;
	readonly periods: Pricing01Period[];
	readonly current?: Pricing01Period;
	readonly styles: ReturnType<typeof pricing01>;
	setPeriod(next: string | string[]): void;
}

const KEY = Symbol("pricing-01");
const PLAN = Symbol("pricing-01-plan");

export const setPricing01 = (state: Pricing01State) => setContext(KEY, state);
export function pricing01State(): Pricing01State {
	const state = getContext<Pricing01State | undefined>(KEY);
	if (!state) throw new Error("Pricing01 parts must be rendered inside a Pricing01.");
	return state;
}

/** Whether the enclosing Pricing01Plan is featured. */
export const setPricing01Plan = (plan: { readonly featured: boolean }) =>
	setContext(PLAN, plan);
export const pricing01Plan = () =>
	getContext<{ readonly featured: boolean } | undefined>(PLAN) ?? { featured: false };
