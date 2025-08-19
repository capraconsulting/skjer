<script lang="ts">
  import { ArrowDownIcon } from "svelte-feather-icons";
  import { Button } from "flowbite-svelte";
  import EventCard from "$components/shared/EventCard.svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import EventFilter from "$components/shared/EventFilter.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { applyFilters } from "$lib/utils/filters";
  import { VALID_FILTERS, type ActiveFilterFromURL } from "$lib/types/filters.type";

  export let data;

  let { pastEvents } = data;

  // Aliases
  const participantFilterUrlParamName = data.filterGroups.participantFilters.name;
  const eventCategoryFilterUrlParamName = data.filterGroups.eventCategoryFilters.name;

  let amountOfVisibleFutureEvents = 6;
  let amountOfVisiblePastEvents = 6;

  let activeFilters: ActiveFilterFromURL;

  $: activeFilters = {
    "participant-type": $page.url.searchParams.get(participantFilterUrlParamName) || "",
    "event-category": $page.url.searchParams.get(eventCategoryFilterUrlParamName) || "",
  };

  $: filteredFutureEvents = applyFilters(data.futureEvents, activeFilters);

  // Run this function when search parameters change.
  $: if ($page.url.searchParams) {
    void (async () => await sanitizeSearchParamsAndNavigateIfNeeded())();
  }

  /**
  This function ensures that URL search parameters - the selected filter categories - are valid. It does so by iterating through all valid filters, getting the current URL parameter value of that filter, and then checking to see if that value exists, and is valid.
  If it is not, it removes that parameter directly from the URL, and navigates to the new (remaining) URL.
  **/
  const sanitizeSearchParamsAndNavigateIfNeeded = async () => {
    if (browser) {
      let hasInvalidFilter = false;

      // Removes invalid search parameter values
      Object.entries(VALID_FILTERS).forEach(([filterCategory, validFilterKeys]) => {
        const currentParam = $page.url.searchParams.get(filterCategory);
        if (currentParam && !(validFilterKeys as readonly string[]).includes(currentParam)) {
          $page.url.searchParams.delete(filterCategory);
          hasInvalidFilter = true;
        }
      });

      // Removing invalid FilterCategory too, because why not
      $page.url.searchParams.keys().forEach((supposedFilterCategory) => {
        if (!Object.keys(VALID_FILTERS).includes(supposedFilterCategory)) {
          $page.url.searchParams.delete(supposedFilterCategory);
          hasInvalidFilter = true;
        }
      });

      if (hasInvalidFilter) {
        await goto($page.url, { replaceState: true });
      }
    }
  };
</script>

<svelte:head>
  <title>Skjer | Capra Liflig Fryde</title>
</svelte:head>

<section class="pb-8">
  <div class="flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center md:py-10">
    <h1 class="text-4xl font-semibold md:text-5xl">
      Kommende<br />arrangementer
    </h1>
    <EventFilter
      {activeFilters}
      participantFilter={data.filterGroups.participantFilters}
      eventCategoryFilter={data.filterGroups.eventCategoryFilters}
    />
  </div>

  <ul class="flex flex-col gap-6 pb-5">
    {#if filteredFutureEvents.length}
      {#each filteredFutureEvents.slice(0, amountOfVisibleFutureEvents) as event}
        <EventListItem {event} />
      {/each}
      {#if filteredFutureEvents.length > amountOfVisibleFutureEvents}
        <div class="mt-6 flex flex-wrap self-center">
          <Button pill color="alternative" on:click={() => (amountOfVisibleFutureEvents += 6)}>
            <span class="mr-2">Se flere arrangementer</span>
            <ArrowDownIcon class="w-[20px]" strokeWidth={1.5} />
          </Button>
        </div>
      {/if}
    {:else}
      <div class="text-xl font-light">Fant ingen kommende arrangementer i denne kategorien 😭</div>
    {/if}
  </ul>
</section>

<section class="pb-8">
  <h1 class="pb-6 pt-10 text-4xl font-semibold md:pb-10 md:text-5xl">
    Tidligere<br /> arrangementer
  </h1>
  {#if pastEvents.length}
    <div class="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3">
      {#each pastEvents.slice(0, amountOfVisiblePastEvents) as event}
        <EventCard {event} />
      {/each}
    </div>
    {#if pastEvents.length > amountOfVisiblePastEvents}
      <div class="mt-6 flex flex-wrap self-center">
        <Button pill color="alternative" on:click={() => (amountOfVisiblePastEvents += 6)}>
          <span class="mr-2">Se flere arrangementer</span>
          <ArrowDownIcon class="w-[20px]" strokeWidth={1.5} />
        </Button>
      </div>
    {/if}
  {:else}
    <div class="text-xl font-light">Fant ingen tidligere arrangementer 😭</div>
  {/if}
</section>
