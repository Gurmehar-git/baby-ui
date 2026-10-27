"use client";

import {
	Button,
	SlideToUnlock,
	SlideToUnlockHandle,
	SlideToUnlockText,
	SlideToUnlockTrack,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function SlideToUnlockDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SlideToUnlock>>(props);
	const [value, setValue] = useState(0);
	const [complete, setComplete] = useState(false);
	return (
		<div className="grid place-items-center gap-3">
			<SlideToUnlock
				label={p.label ?? "Confirm publish"}
				value={value}
				onValueChange={setValue}
				onComplete={() => setComplete(true)}
				threshold={p.threshold ?? 90}
				variant={p.variant ?? "default"}
				size={p.size ?? "xl"}
				disabled={p.disabled}
				loading={p.loading}
			>
				<SlideToUnlockTrack>
					<SlideToUnlockText>
						{complete ? "Published" : "Slide to publish"}
					</SlideToUnlockText>
					<SlideToUnlockHandle />
				</SlideToUnlockTrack>
			</SlideToUnlock>
			<p role="status" className="text-muted-foreground text-sm">
				{complete ? "Post published" : `${Math.round(value)}% confirmed`}
			</p>
			<Button
				variant="ghost"
				size="sm"
				disabled={!complete && value === 0}
				onClick={() => {
					setValue(0);
					setComplete(false);
				}}
			>
				Reset
			</Button>
		</div>
	);
}
