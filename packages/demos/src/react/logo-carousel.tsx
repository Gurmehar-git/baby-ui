"use client";

import { LogoCarousel } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { BRANDS } from "../data/media";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

function LogoMark({ brand }: { brand: (typeof BRANDS)[number] }) {
	return (
		<span className="flex h-10 w-28 shrink-0 items-center justify-center gap-2 text-foreground">
			<img src={brand.logo} alt="" width={24} height={24} className="size-6" />
			<span className="font-medium text-sm">{brand.name}</span>
		</span>
	);
}

export function LogoCarouselDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof LogoCarousel>>(props);
	return (
		<LogoCarousel
			columnCount={Number(props.columnCount ?? 4)}
			direction={p.direction ?? "ltr"}
			variant={p.variant}
			tone={p.tone}
			className={p.variant === "marquee" ? "w-full max-w-lg" : "w-full max-w-lg gap-3"}
		>
			{BRANDS.map((brand) => (
				<LogoMark key={brand.name} brand={brand} />
			))}
		</LogoCarousel>
	);
}
