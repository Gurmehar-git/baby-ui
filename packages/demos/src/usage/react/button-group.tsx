"use client";

import { Button, ButtonGroup } from "@baby-ui/react";

export function Example() {
	return (
		<ButtonGroup aria-label="Pagination">
			<Button variant="outline">Previous</Button>
			<Button variant="outline">Next</Button>
		</ButtonGroup>
	);
}
