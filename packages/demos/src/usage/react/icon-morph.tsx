"use client";

import { Button, IconMorph } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [open, setOpen] = useState(false);
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={open ? "Close menu" : "Open menu"}
			onClick={() => setOpen(!open)}
		>
			<IconMorph name="menu" state={open} />
		</Button>
	);
}
