import { tv } from "tailwind-variants";

export const emailPasswordReset = tv({
	slots: {
		prompt:
			"m-0 mt-10 text-center font-semibold text-[20px] text-foreground leading-[28px] dark:text-foreground-dark",
		action: "mt-6",
		reassurance: "mt-6 text-center",
	},
});
