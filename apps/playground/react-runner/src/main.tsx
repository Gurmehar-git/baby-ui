import { type DemoComponent, demos } from "@baby-ui/demos/react";
import {
	type LazyExoticComponent,
	lazy,
	StrictMode,
	Suspense,
	useEffect,
	useState,
} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { connect, initialState, type RunnerState } from "./runner-state";

// The demo map holds loaders; one lazy component per slug so revisits don't refetch.
const lazyDemos = new Map<string, LazyExoticComponent<DemoComponent>>();
function demoFor(slug: string) {
	const loader = demos[slug];
	if (!loader) return undefined;
	const cached = lazyDemos.get(slug) ?? lazy(loader);
	lazyDemos.set(slug, cached);
	return cached;
}

function Runner() {
	const [state, setState] = useState<RunnerState>(initialState);
	useEffect(() => connect("react", setState), []);

	const Demo = demoFor(state.slug);
	return (
		<div className="grid h-full place-items-center p-8">
			{Demo ? (
				<Suspense fallback={null}>
					<Demo props={state.props} />
				</Suspense>
			) : (
				<p className="text-sm text-muted-foreground">No React demo for “{state.slug}”.</p>
			)}
		</div>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Runner />
	</StrictMode>,
);
