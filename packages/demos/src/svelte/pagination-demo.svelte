<script lang="ts">
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	paginationRange,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const size = $derived(
	controlProps<ComponentProps<typeof PaginationLink>>(props).size ?? "default",
);

let page = $state(4);

$effect(() => {
	page = Number(props.page ?? 4);
});

const total = $derived(Number(props.total ?? 12));
const entries = $derived(paginationRange(page, total, Number(props.siblings ?? 1)));
</script>

<Pagination>
	<PaginationPrevious {size} disabled={page <= 1} onclick={() => (page = Math.max(1, page - 1))} />
	<PaginationContent>
		{#each entries as entry, i (typeof entry === "number" ? entry : `gap-${i}`)}
			<PaginationItem>
				{#if entry === "gap"}
					<PaginationEllipsis />
				{:else}
					<PaginationLink {size} active={entry === page} onclick={() => (page = entry)}>
						{entry}
					</PaginationLink>
				{/if}
			</PaginationItem>
		{/each}
	</PaginationContent>
	<PaginationNext {size} disabled={page >= total} onclick={() => (page = Math.min(total, page + 1))} />
</Pagination>
