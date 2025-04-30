<script lang="ts">
  import { ArrowDownIcon } from "svelte-feather-icons";
  import { Button } from "flowbite-svelte";
  import EventCard from "$components/shared/EventCard.svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import EventFilter from "$components/shared/EventFilter.svelte";

  export let data;

  let { futureEvents, pastEvents, selectedFilter } = data;

  let amountOfVisibleFutureEvents = 6;
  let amountOfVisiblePastEvents = 6;

  $: futureEventsFiltered = futureEvents.filter(({ category, openForExternals }) => {
    if (!selectedFilter) {
      return true;
    }
    if (selectedFilter === "kun-interne") {
      return !openForExternals;
    }
    if (selectedFilter === "for-alle") {
      return openForExternals;
    }
    return category?.toLowerCase() === selectedFilter;
  });
</script>

<svelte:head>
  <title>Skjer | Capra Liflig Fryde</title>
  <meta name="description" content="Skjer er en arrangementsplattform for Capra, Liflig og Fryde. Her finner du alle kommende og tidligere arrangementer, og kan melde deg på de du ønsker å delta på." />
  <link rel="canonical" href="https://skjer.capraconsulting.no/" />
  <meta property="og:title" content="Skjer | Capra Liflig Fryde" />
  <meta property="og:description" content="Skjer er en arrangementsplattform for Capra, Liflig og Fryde. Her finner du alle kommende og tidligere arrangementer, og kan melde deg på de du ønsker å delta på." />
  <meta property="og:image" content="https://skjer.capraconsulting.no/logo.png" />
  <meta property="og:url" content="https://skjer.capraconsulting.no/" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="pb-8">
  <div class="flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center md:py-10">
    <h1 class="text-4xl font-semibold md:text-5xl">
      Kommende<br />arrangementer
    </h1>
    <EventFilter {selectedFilter} on:filterChange={({ detail }) => (selectedFilter = detail)} />
  </div>

  <div class="flex flex-col gap-4 pb-5" data-testid="upcoming-event-list">
    {#if futureEventsFiltered.length}
      {#each futureEventsFiltered.slice(0, amountOfVisibleFutureEvents) as event}
        <EventListItem {event} />
      {/each}
      {#if futureEventsFiltered.length > amountOfVisibleFutureEvents}
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
  </div>
</section>

<section class="pb-8">
  <h2 class="pb-6 pt-10 text-4xl font-semibold md:pb-10 md:text-5xl">
    Tidligere<br /> arrangementer
  </h2>
  {#if pastEvents.length}
    <div class="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3" data-testid="past-event-list">
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
