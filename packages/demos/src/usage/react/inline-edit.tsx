"use client";

import { InlineEdit } from "@baby-ui/react";

export function Example({
	name,
	rename,
}: {
	name: string;
	rename: (next: string) => Promise<void>;
}) {
	return <InlineEdit label="Project name" value={name} onSave={rename} as="h2" />;
}
