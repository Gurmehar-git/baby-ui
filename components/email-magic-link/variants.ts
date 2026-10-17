import { tv } from "tailwind-variants";

export const emailMagicLink = tv({
	slots: {
		intro: "mt-3 text-center",
		codeLabel:
			"m-0 mb-3 text-center font-semibold text-[13px] text-foreground leading-[20px] dark:text-foreground-dark",
		expiry: "mt-4 text-center",
	},
});
