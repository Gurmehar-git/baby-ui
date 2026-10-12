"use client";

import { SearchInput } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const FRUITS = [
	"Apple",
	"Apricot",
	"Banana",
	"Blueberry",
	"Cherry",
	"Grape",
	"Mango",
	"Peach",
];

export function SearchInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SearchInput>>(props);
	const [query, setQuery] = useState("");
	const hits = FRUITS.filter((fruit) =>
		fruit.toLowerCase().includes(query.trim().toLowerCase()),
	);
	return (
		<div className="flex w-full max-w-xs flex-col gap-3">
			<SearchInput
				label={p.label || "Search fruit"}
				shortcut={p.shortcut || "/"}
				variant={p.variant}
				size={p.size}
				value={query}
				onValueChange={setQuery}
			/>
			<p className="text-muted-foreground text-sm">
				{hits.length ? hits.join(", ") : "No matches"}
			</p>
		</div>
	);
}
