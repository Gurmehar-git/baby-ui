<script lang="ts">
import { navigating } from "$app/state";

let visible = $state(false);
let complete = $state(false);
let showTimer: ReturnType<typeof setTimeout>;
let hideTimer: ReturnType<typeof setTimeout>;

$effect(() => {
	const isNavigating = navigating.to !== null;
	clearTimeout(showTimer);
	clearTimeout(hideTimer);

	if (isNavigating) {
		complete = false;
		// Delayed so an already-prefetched, near-instant navigation never flashes the bar.
		showTimer = setTimeout(() => {
			visible = true;
		}, 120);
		return;
	}

	if (!visible) return;
	complete = true;
	hideTimer = setTimeout(() => {
		visible = false;
		complete = false;
	}, 200);
});
</script>

{#if visible}
	<div aria-hidden="true" class="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden">
		<div class="nav-progress-bar h-full origin-left bg-primary" class:nav-progress-bar-complete={complete}></div>
	</div>
{/if}

<style>
	.nav-progress-bar {
		transform: scaleX(0);
		animation: nav-progress-grow 4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.nav-progress-bar-complete {
		animation: none;
		transform: scaleX(1);
		opacity: 0;
		transition:
			transform 200ms var(--ease-ui-out),
			opacity 200ms var(--ease-ui-out) 50ms;
	}

	@keyframes nav-progress-grow {
		0% {
			transform: scaleX(0);
		}
		100% {
			transform: scaleX(0.85);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-progress-bar {
			animation-duration: 1ms;
		}
		.nav-progress-bar-complete {
			transition: none;
		}
	}
</style>
