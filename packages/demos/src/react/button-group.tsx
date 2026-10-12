"use client";

import {
	Button,
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	Input,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ButtonGroupDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ButtonGroup>>(props);
	return (
		<div className="flex flex-col items-center gap-4">
			<ButtonGroup aria-label="Message actions" orientation={p.orientation}>
				<Button variant="outline">Archive</Button>
				<Button variant="outline">Report</Button>
				<Button variant="outline">Snooze</Button>
			</ButtonGroup>
			<ButtonGroup aria-label="Publish">
				<Button>Publish</Button>
				<ButtonGroupSeparator />
				<Button>Schedule</Button>
			</ButtonGroup>
			<ButtonGroup>
				<ButtonGroupText>https://</ButtonGroupText>
				<Input aria-label="Domain" placeholder="example.com" />
			</ButtonGroup>
		</div>
	);
}
