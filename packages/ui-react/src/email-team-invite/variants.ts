import { tv } from "tailwind-variants";

// Centred card led by a large avatar and the team name as display text.
export const emailTeamInvite = tv({
	slots: {
		avatar: "mx-auto block h-[64px] w-[64px] rounded-full",
		initials:
			"m-0 mx-auto h-[64px] w-[64px] rounded-full bg-primary-soft text-center font-semibold text-[22px] text-foreground leading-[64px] dark:bg-primary-soft-dark dark:text-foreground-dark",
		lead: "m-0 mt-5 mb-1 text-center text-[14px] text-muted-foreground leading-[22px] dark:text-muted-foreground-dark",
		role: "mt-4 text-center",
		signoff:
			"m-0 mt-2 text-[13px] text-muted-foreground leading-[20px] dark:text-muted-foreground-dark",
		closing: "mt-4 text-center",
	},
});

/** Up to two initials for the fallback avatar, e.g. "Grace Hopper" to "GH". */
export const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
