import { getContext, setContext } from "svelte";
import type { Pricing02Period } from "../types";
import type { Pricing02Variant, pricing02 } from "../variants";

/** What Pricing02 shares with its parts; read through getters so they stay reactive. */
export interface Pricing02State {
	readonly variant: Pricing02Variant;
	readonly periods: Pricing02Period[];
	readonly current?: Pricing02Period;
	readonly currentIndex: number;
	readonly moved: boolean;
	readonly styles: ReturnType<typeof pricing02>;
	setPeriod(next: string | string[]): void;
}

const KEY = Symbol("pricing-02");
const PLAN = Symbol("pricing-02-plan");

export const setPricing02 = (state: Pricing02State) => setContext(KEY, state);
export function pricing02State(): Pricing02State {
	const state = getContext<Pricing02State | undefined>(KEY);
	if (!state) throw new Error("Pricing02 parts must be rendered inside a Pricing02.");
	return state;
}

/** Whether the enclosing Pricing02Plan is featured. */
export const setPricing02Plan = (plan: { readonly featured: boolean }) =>
	setContext(PLAN, plan);
export const pricing02Plan = () =>
	getContext<{ readonly featured: boolean } | undefined>(PLAN) ?? { featured: false };
