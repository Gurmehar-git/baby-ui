import { tv } from "tailwind-variants";

export const emailVerify = tv({
	slots: {
		subheading: "mt-2 text-center",
		intro: "mt-8 text-center",
		action: "mt-8 text-center",
		codeLabel: "mb-3 text-center",
		fallback: "mt-6",
		notice: "mt-10",
		helpList: "mt-3",
	},
});
