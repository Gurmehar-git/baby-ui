/** The signed-in person for the user-menu demo. */
export const MENU_USER = { name: "Sam Rivera", email: "sam@acme.dev", plan: "Pro" };

export const MENU_ITEMS = [
	{ label: "Profile", shortcut: "⇧⌘P" },
	{ label: "Billing", shortcut: "⌘B" },
	{ label: "Settings", shortcut: "⌘," },
];

/** Stands in for a sign-out request. */
export const fakeSignOut = () => new Promise((resolve) => setTimeout(resolve, 1200));
