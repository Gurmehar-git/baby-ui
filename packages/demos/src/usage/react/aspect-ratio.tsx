import { AspectRatio, AspectRatioImage } from "@baby-ui/react";

export function Example() {
	return (
		<AspectRatio ratio={16 / 9} className="rounded-xl bg-muted">
			<AspectRatioImage
				src="/harbour.jpg"
				alt="Harbour at dusk"
				width={1200}
				height={800}
			/>
		</AspectRatio>
	);
}
