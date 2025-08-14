<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import type { FilterCategory, FilterKey, FilterData } from "$lib/types/filters.type";

  export let activeFilters;
  export let participantFilter: FilterData;
  export let eventCategoryFilter: FilterData;

  const searchParams = new URLSearchParams();

  /**
   If a given filter key already exists in the url, or filterKey is empty, this function deletes the given url search parameter. Otherwise, it updates the search parameter to the new filter.
   In either case, it ultimately navigates to the new url.
   @arg filterKey: if empty, will remove the given filterCategory from the search.
   @arg filterCategory
   @arg urlParams: feed this function with a URLSearchParams object, representing the current state of the url search params.
   */
  const handleFilterChange = async (
    filterKey: FilterKey,
    filterCategory: FilterCategory,
    urlParams: URLSearchParams
  ) => {
    if (filterKey) {
      if (urlParams.has(filterCategory) && filterKey === urlParams.get(filterCategory)) {
        urlParams.delete(filterCategory);
      } else {
        urlParams.set(filterCategory, filterKey);
      }
    } else {
      urlParams.delete(filterCategory);
    }

    await goto(`?${urlParams.toString()}`, { noScroll: true });
  };
</script>

<menu class="flex-wrap space-y-4">
  <div class="flex w-fit flex-col gap-2 lg:flex-row lg:items-center">
    <ButtonGroup class="flex-row flex-wrap gap-2 shadow-none lg:justify-end lg:self-end">
      {#each participantFilter.valid_parameters as { displayName, filterKey }}
        <li>
          <Button
            on:click={() => handleFilterChange(filterKey, participantFilter.name, searchParams)}
            class={`basis-1/4 whitespace-nowrap sm:basis-auto ${
              Object.values(activeFilters).includes(filterKey)
                ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
                : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
            }`}
          >
            {displayName}
          </Button>
        </li>
      {/each}
    </ButtonGroup>

    <div class="h-px w-full bg-gray-300 dark:bg-gray-600 lg:h-8 lg:w-px lg:self-center"></div>

    <ButtonGroup class="flex-row flex-wrap gap-2 shadow-none lg:justify-end lg:self-end">
      {#each eventCategoryFilter.valid_parameters as { displayName, filterKey }}
        <li>
          <Button
            on:click={() => handleFilterChange(filterKey, eventCategoryFilter.name, searchParams)}
            class={`basis-1/4 whitespace-nowrap sm:basis-auto ${
              Object.values(activeFilters).includes(filterKey)
                ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
                : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
            }`}
          >
            {displayName}
          </Button>
        </li>
      {/each}
    </ButtonGroup>
  </div>
</menu>
