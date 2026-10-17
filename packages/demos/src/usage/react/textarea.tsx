"use client";

import {
	Field,
	FieldDescription,
	FieldLabel,
	Textarea,
	TextareaCount,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [value, setValue] = useState("");

	return (
		<Field>
			<FieldLabel htmlFor="notes">Release notes</FieldLabel>
			<Textarea
				id="notes"
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				aria-describedby="notes-description"
				maxLength={280}
				autoGrow
			/>
			<div className="flex items-start justify-between gap-3">
				<FieldDescription id="notes-description">Markdown is supported.</FieldDescription>
				<TextareaCount value={value.length} max={280} />
			</div>
		</Field>
	);
}
