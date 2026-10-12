"use client";

import { EMPTY_MENTIONS, MentionInput } from "@baby-ui/react";
import { useState } from "react";

const people = [
	{ id: "u1", name: "Ada Park", role: "Design lead" },
	{ id: "u2", name: "Marcus Webb", role: "Engineer" },
];
const channels = [{ id: "c1", name: "general" }];

export function Example() {
	const [value, setValue] = useState(EMPTY_MENTIONS);
	return (
		<MentionInput
			value={value}
			onValueChange={setValue}
			people={people}
			channels={channels}
		/>
	);
}
