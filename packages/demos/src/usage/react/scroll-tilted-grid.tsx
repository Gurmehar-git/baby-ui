import { ScrollTiltedGrid } from "@baby-ui/react";

const images = [
	{ src: "/photos/1.jpg", alt: "Harbour at dawn" },
	{ src: "/photos/2.jpg", alt: "Pine ridge" },
	{ src: "/photos/3.jpg", alt: "Desert road" },
	{ src: "/photos/4.jpg", alt: "City lights" },
];

export function Example() {
	return <ScrollTiltedGrid images={images} size="default" />;
}
