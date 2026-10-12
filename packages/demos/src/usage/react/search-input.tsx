"use client";

import { SearchInput } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [query, setQuery] = useState("");
	return (
		<SearchInput
			label="Search projects"
			shortcut="/"
			value={query}
			onValueChange={setQuery}
		/>
	);
}
