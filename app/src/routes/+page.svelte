<script lang="ts">
  import ArrowDownIcon from "svelte-icons/fa/FaArrowDown.svelte";
  import { Button } from "flowbite-svelte";

  import EventCard from "$components/shared/EventCard.svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import EventCategoryFilter from "$components/shared/EventCategoryFilter.svelte";

  export let data;

  let { futureEvents, pastEvents, selectedCategory } = data;

  let amountOfVisibleFutureEvents = 6;
  let amountOfVisiblePastEvents = 6;

  $: futureEventsFiltered = futureEvents.filter(({ category }) => {
    if (!selectedCategory) return true;
    return category?.toLowerCase() === selectedCategory;
  });
</script>

<svelte:head>
  <title>Skjer | Capra Liflig Fryde</title>
</svelte:head>

<section class="pb-8">
  <div class="flex flex-col justify-between md:flex-row md:items-center">
    <h1 class="pb-6 text-4xl font-semibold md:w-[30%] md:pt-10 md:text-5xl">
      Kommende arrangementer
    </h1>

    <EventCategoryFilter
      {selectedCategory}
      on:categoryChange={({ detail }) => (selectedCategory = detail)}
    />
  </div>

  <div class="flex flex-col gap-4 py-5">
    {#if futureEventsFiltered.length}
      {#each futureEventsFiltered.slice(0, amountOfVisibleFutureEvents) as event}
        <EventListItem {event} />
      {/each}
      {#if futureEventsFiltered.length > amountOfVisibleFutureEvents}
        <div class="mt-6 flex flex-wrap self-center">
          <Button
            class="hover:bg-zinc-800 hover:text-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
            pill
            color="light"
            padding={3}
            on:click={() => (amountOfVisibleFutureEvents += 6)}
          >
            <span>Se flere arrangementer</span>
            <span class="ml-2 w-[12px]"><ArrowDownIcon /></span>
          </Button>
        </div>
      {/if}
    {:else}
      <div class="text-xl font-light">Fant ingen kommende arrangementer i denne kategorien 😭</div>
    {/if}
  </div>
</section>

<section class="pb-8">
  <h1 class="pb-12 pt-10 text-4xl font-semibold md:w-[30%] md:text-5xl">Tidligere arrangementer</h1>
  {#if pastEvents.length}
    <div class="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3">
      {#each pastEvents.slice(0, amountOfVisiblePastEvents) as event}
        <EventCard {event} />
      {/each}
    </div>
    {#if pastEvents.length > amountOfVisiblePastEvents}
      <div class="mt-6 flex flex-wrap self-center">
        <Button
          class="hover:bg-zinc-800 hover:text-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
          pill
          color="light"
          padding={3}
          on:click={() => (amountOfVisiblePastEvents += 6)}
        >
          <span>Se flere arrangementer</span>
          <span class="ml-2 w-[12px]"><ArrowDownIcon /></span>
        </Button>
      </div>
    {/if}
  {:else}
    <div class="text-xl font-light">Fant ingen tidligere arrangementer 😭</div>
  {/if}
</section>
