"use client";

import {
	type CSSProperties,
	createElement,
	type ReactNode,
	type SVGProps,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import { createIconMorph } from "./engine";
import {
	type IconMorphName,
	type IconTreeOptions,
	iconTree,
	type MorphNode,
	paint,
	rest,
	staticAttrs,
} from "./icons";
import { type IconMorphSize, iconMorph } from "./variants";

export type { IconMorphName, IconMorphSize };

export interface IconMorphProps
	extends Omit<SVGProps<SVGSVGElement>, "ref" | "children" | "name">,
		IconTreeOptions {
	name: IconMorphName;
	/**
	 * The second look. menu: close, play: pause, plus: check, copy: check, theme: moon,
	 * chevron: turned, bell: on, heart: liked.
	 */
	state?: boolean;
	size?: IconMorphSize;
	/** Stroke width in the 24-unit grid. */
	strokeWidth?: number;
}

const camel = (key: string) =>
	key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function renderNodes(nodes: MorphNode[], on: boolean, id: string): ReactNode[] {
	return nodes.map((node) => {
		const { attrs, style } = paint(node, rest(node, on));
		const css: Record<string, string> = {};
		for (const [key, value] of Object.entries(style)) css[camel(key)] = value;
		return createElement(
			node.tag,
			{
				key: node.i,
				"data-m": node.i,
				...staticAttrs(node, id),
				...attrs,
				style: css satisfies CSSProperties,
			},
			node.children && renderNodes(node.children, on, id),
		);
	});
}

function Glyph({
	tree,
	state,
	...props
}: { tree: MorphNode[]; state: boolean } & SVGProps<SVGSVGElement>) {
	const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
	// Server and first paint only; after that the engine owns every animated value.
	const [initial] = useState(state);
	const svgRef = useRef<SVGSVGElement>(null);
	const engine = useRef<ReturnType<typeof createIconMorph> | null>(null);
	useLayoutEffect(() => {
		if (!svgRef.current) return;
		engine.current = createIconMorph(svgRef.current, tree, initial);
		return () => engine.current?.destroy();
	}, [tree, initial]);
	useEffect(() => {
		engine.current?.set(state);
	}, [state]);
	return (
		<svg ref={svgRef} aria-hidden focusable="false" {...props}>
			{renderNodes(tree, initial, id)}
		</svg>
	);
}

/**
 * Icons that morph between two looks instead of swapping, on interruptible springs. They are
 * decorative: put one inside a button that carries the name and `aria-pressed`.
 */
export function IconMorph({
	name,
	state = false,
	size = "default",
	strokeWidth = 1.75,
	turn,
	pointing,
	className,
	...props
}: IconMorphProps) {
	const tree = useMemo(() => iconTree(name, { turn, pointing }), [name, turn, pointing]);
	return (
		<Glyph
			key={`${name}-${turn}-${pointing}`}
			tree={tree}
			state={state}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			data-slot="icon-morph"
			data-name={name}
			data-on={state}
			className={cn(iconMorph({ size }), className)}
			{...props}
		/>
	);
}
