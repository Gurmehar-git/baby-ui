import type { NewsletterIssue } from "@baby-ui/svelte";
import { avatar, photo } from "./media";

const story = (title: string, image: number, minutes: number) => ({
	title,
	image: photo(image, 160, 160),
	minutes,
});

/** Sample publication for the newsletter signup demos: three sent issues and the next one. */
export const NEWSLETTER_ISSUES: NewsletterIssue[] = [
	{
		number: 148,
		date: "Friday, September 25",
		subject: "The quiet power of empty states",
		stories: [
			story("Writing the first screen people see", 1015, 4),
			story("Why blank is never neutral", 1016, 3),
			story("Teaching through the placeholder", 1018, 2),
		],
	},
	{
		number: 147,
		date: "Friday, September 18",
		subject: "Motion that explains, not decorates",
		stories: [
			story("Exits that mirror entrances", 1019, 5),
			story("When a spring is the wrong tool", 1020, 3),
			story("Reduced motion as a design input", 1021, 4),
		],
	},
	{
		number: 146,
		date: "Friday, September 11",
		subject: "Forms that forgive",
		stories: [
			story("Validate on blur, not on keystroke", 1022, 3),
			story("Errors that keep what you typed", 1023, 2),
			story("The submit button's four states", 1024, 4),
		],
	},
];

export const NEWSLETTER_UPCOMING: NewsletterIssue = {
	number: 149,
	date: "Friday, October 2",
	subject: "Designing for the second visit, not the first",
	stories: [
		story("What returning users actually need", 1025, 4),
		story("Defaults that learn", 1026, 3),
		story("The cost of a fresh start", 1027, 2),
	],
};

export const NEWSLETTER_READERS = {
	count: 12480,
	avatars: [21, 33, 44].map((index) => ({ src: avatar(index) })),
};
