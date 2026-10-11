import { Markdown } from "@baby-ui/react";

export function Example({ answer, done }: { answer: string; done: boolean }) {
	return (
		<>
			<Markdown content="Components are **copied into your project**, not installed." />
			{/* An AI answer: pass the whole text so far and flip `streaming` off when it ends. */}
			<Markdown content={answer} streaming={!done} animate="settle" />
		</>
	);
}
