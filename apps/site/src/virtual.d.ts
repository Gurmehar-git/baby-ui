declare module "virtual:component-dates" {
	/** Each component folder's first and last commit day, from vite.config.ts at startup. */
	const dates: Record<string, { added: string; updated?: string }>;
	export default dates;
}
