"use client";

import { MorphSelect } from "@baby-ui/react";
import { useState } from "react";

const STATUSES = [
	{ value: "backlog", label: "Backlog" },
	{ value: "in-progress", label: "In progress" },
	{ value: "done", label: "Done" },
];

export function Example() {
	const [status, setStatus] = useState("backlog");
	return (
		<MorphSelect
			label="Status"
			items={STATUSES}
			value={status}
			onValueChange={setStatus}
		/>
	);
}
