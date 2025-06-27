<script lang="ts">
  import { ArrowDownIcon } from "svelte-feather-icons";
  import { Button } from "flowbite-svelte";
  import EventCard from "$components/shared/EventCard.svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import EventFilter from "$components/shared/EventFilter.svelte";
  import { page } from '$app/stores';
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { applyFilters } from '$lib/utils/filters'
  import { VALID_FILTERS, type ActiveFilterFromURL } from "$lib/types/filters.type";

  /*
  This effectively renders the event list on the landing page of Skjer.

  All filtering logic is contained here on the front end.

  Data is fetched from backend, naturally, but so is a whole bunch of information about valid filters, their groups, and their URL Search Param name.
    - See lib/types/filter.ts for type definitions, and constants that are used in the filtering process.
    - lib/filters.ts contains helper functions for the filtering logic

  HOW FILTERS WORK
  
  - All filter state is to be found in the URL, more specifically in the URL search params. When these change, so does the filtering of the list.
  - We have filters, and we have filter groups, which filters belong to.
  - A filter group is a self-contained group of filter toggles that are mutually exclusive. If you toggle one of the filters in a group, the others in that group are toggled off.
    - Toggling on or off filters in one group will not affect those in other groups
  - In the EventFilter component, these filter groups are arranged into separate ButtonGroups.
  - Each filter is therefore rendered as a Button
  - Each click of a button (filter) will directly edit the URL search params client side, and then call goto(new url).
  - This page (containing the list of events) will conditionally render the list of events, based on these URL search parameters.
  - It will also continuously sanitize (remove unwanted) URL search params, quite simply because a server-side version of that sanitization using redirects I could not get to work. The current solution works fine.
  */

  export let data;

  let { pastEvents } = data;

  // Shorthands for further down the line
  const participantFilterUrlParamName = data.filterGroups.participantFilters.name;
  const eventCategoryFilterUrlParamName = data.filterGroups.eventCategoryFilters.name;

  let amountOfVisibleFutureEvents = 6;
  let amountOfVisiblePastEvents = 6;

  let activeFilters: ActiveFilterFromURL;

  $: activeFilters = {
    deltakerType: $page.url.searchParams.get(participantFilterUrlParamName) || '',
    eventKategori: $page.url.searchParams.get(eventCategoryFilterUrlParamName) || '',
  };


  $: filteredFutureEvents = applyFilters(data.futureEvents, activeFilters)

  // See below
  $: removeInvalidSearchParamsAndNavigateIfNeeded();

  /**
  This function ensures that URL search parameters are valid. It does so by iterating through all valid filters, getting the current URL parameter value of that filter, and then checking to see if that value exists, and is valid.
  If it is not, it removes that parameter directly from the URL, and navigates to the new (remaining) URL.
  **/
  const removeInvalidSearchParamsAndNavigateIfNeeded = () => {

    if(browser) {
      let hasInvalidFilter = false;

      Object.entries(VALID_FILTERS).forEach(([filterType, validFilterKeys]) => {
        const currentParam = $page.url.searchParams.get(filterType);
        if(currentParam && !(validFilterKeys as readonly string[]).includes(currentParam)) {
          $page.url.searchParams.delete(filterType);
          hasInvalidFilter = true;
        }
      });

      // Removing invalid FilterTypes too, because why not
      $page.url.searchParams.keys().forEach((supposedFilterType) => {
        if(!Object.keys(VALID_FILTERS).includes(supposedFilterType)) {
          $page.url.searchParams.delete(supposedFilterType);
          hasInvalidFilter = true;
        }
      })

      if (hasInvalidFilter) {
        goto($page.url, { replaceState: true } )
      }
      
    }
    
  }
</script>

<svelte:head>
  <title>Skjer | Capra Liflig Fryde</title>
</svelte:head>

<section class="pb-8">
  <div class="flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center md:py-10">
    <h1 class="text-4xl font-semibold md:text-5xl">
      Kommende<br />arrangementer
    </h1>
    <EventFilter {activeFilters} deltakerFilter={data.filterGroups.participantFilters} kategoriFilter={data.filterGroups.eventCategoryFilters} />
  </div>

  <ol class="flex flex-col gap-4 pb-5" role="list">
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
  </ol>
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
