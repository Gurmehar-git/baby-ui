<script lang="ts">
import { ScrollTiltedGrid } from "@baby-ui/svelte";

const images = [
	{ src: "/photos/1.jpg", alt: "Harbour at dawn" },
	{ src: "/photos/2.jpg", alt: "Pine ridge" },
	{ src: "/photos/3.jpg", alt: "Desert road" },
	{ src: "/photos/4.jpg", alt: "City lights" },
];
</script>

<ScrollTiltedGrid {images} size="default" />
