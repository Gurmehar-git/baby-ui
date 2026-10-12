const ADA = { id: "ada", name: "Ada Park" };
const MARCUS = { id: "marcus", name: "Marcus Webb" };
const PRIYA = { id: "priya", name: "Priya Nair" };

/** The demo's signed-in reviewer. */
export const THREAD_ME = { id: "you", name: "Sam Rivera" };

export const THREAD_PEOPLE = [ADA, MARCUS, PRIYA, THREAD_ME];

/** A design review discussion about a hero headline. */
export const THREAD_COMMENTS = [
	{
		id: "c1",
		author: ADA,
		body: "Should the headline lead with the outcome instead of the feature? “Ship reviews in minutes” reads stronger to me.",
		createdAt: "2h",
		reactions: [{ emoji: "👍", users: ["marcus", "priya"] }],
		replies: [
			{
				id: "c2",
				author: MARCUS,
				body: "Agree. @Priya Nair can we test both in the next experiment?",
				createdAt: "1h",
				reactions: [],
			},
			{
				id: "c3",
				author: THREAD_ME,
				body: "I can set up the variant today.",
				createdAt: "45m",
				reactions: [{ emoji: "🎉", users: ["ada"] }],
			},
		],
	},
	{
		id: "c4",
		author: PRIYA,
		body: "Also, the subhead wraps to three lines on mobile. Can we trim it?",
		createdAt: "20m",
		reactions: [],
	},
];
