<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import type { FilterType, FilterKey, FilterData } from '$lib/types/filter';
 
  export let activeFilters;
  export let deltakerFilter: FilterData;
  export let kategoriFilter: FilterData;

  const searchParams = new URLSearchParams();

  const handleFilterChange = async (filter: FilterKey, searchParam: FilterType) => {

    if (filter) {
      if (searchParams.has(searchParam) && filter === searchParams.get(searchParam)){
        searchParams.delete(searchParam)
      } else {
        searchParams.set(searchParam, filter);
      }
    } else {
      searchParams.delete(searchParam);
    }

    await goto(`?${searchParams.toString()}`, { noScroll: true });
  };

</script>

<header>
  <ButtonGroup class="flex-row flex-wrap gap-2 shadow-none md:justify-end md:self-end">
    {#each deltakerFilter.list as { title, keyword }}
      <Button
        on:click={() => handleFilterChange(keyword, deltakerFilter.name)}
        class={`basis-1/4 whitespace-nowrap sm:basis-auto ${
          Object.values(activeFilters).includes(keyword)
            ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
            : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
        }`}
      >
        {title}
      </Button>
    {/each}
  </ButtonGroup>
  <span>|</span>
  <ButtonGroup class="flex-row flex-wrap gap-2 shadow-none md:justify-end md:self-end">
    {#each kategoriFilter.list as { title, keyword }}
      <Button
        on:click={() => handleFilterChange(keyword, kategoriFilter.name)}
        class={`basis-1/4 whitespace-nowrap sm:basis-auto ${
          Object.values(activeFilters).includes(keyword)
            ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
            : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
        }`}
      >
        {title}
      </Button>
    {/each}
  </ButtonGroup>
</header>

