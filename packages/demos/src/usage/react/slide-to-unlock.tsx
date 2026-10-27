"use client";

import {
	SlideToUnlock,
	SlideToUnlockHandle,
	SlideToUnlockText,
	SlideToUnlockTrack,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [value, setValue] = useState(0);
	return (
		<SlideToUnlock
			label="Confirm publish"
			value={value}
			onValueChange={setValue}
			onComplete={() => console.log("Publish confirmed")}
		>
			<SlideToUnlockTrack>
				<SlideToUnlockText>Slide to publish</SlideToUnlockText>
				<SlideToUnlockHandle />
			</SlideToUnlockTrack>
		</SlideToUnlock>
	);
}
