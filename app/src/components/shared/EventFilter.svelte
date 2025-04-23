<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { goto } from "$app/navigation";
  import { _ } from "$lib/i18n";

  export let selectedFilter: string;

  const dispatch = createEventDispatcher();
  const searchParams = new URLSearchParams();

  type Filters = { keyword: string; titleKey: string }[];
  const filter: Filters = [
    { titleKey: "filter.all", keyword: "" },
    { titleKey: "filter.forAll", keyword: "for-alle" },
    { titleKey: "filter.internalOnly", keyword: "kun-interne" },
    { titleKey: "filter.academic", keyword: "fag" },
    { titleKey: "filter.social", keyword: "sosialt" },
  ];

  const handleFilterChange = async (filter: string) => {
    dispatch("filterChange", filter);

    if (filter) {
      searchParams.set("filter", filter);
    } else {
      searchParams.delete("filter");
    }

    await goto(`?${searchParams.toString()}`, { noScroll: true });
  };
</script>

<ButtonGroup class="flex-row flex-wrap gap-2 shadow-none md:justify-end md:self-end">
  {#each filter as { titleKey, keyword }}
    <Button
      on:click={() => handleFilterChange(keyword)}
      class={`basis-1/4 whitespace-nowrap sm:basis-auto ${
        selectedFilter === keyword
          ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
          : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
      }`}
    >
      {$_(titleKey)}
    </Button>
  {/each}
</ButtonGroup>
