<script lang="ts">
  import EventCard from "$components/shared/EventCard.svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import EventCategoryFilter from "$components/shared/EventCategoryFilter.svelte";

  export let data;

  let { futureEvents, pastEvents, selectedCategory } = data;

  $: futureEventsFiltered = futureEvents.filter(({ category }) => {
    if (!selectedCategory) return true;
    return category.toLowerCase() === selectedCategory;
  });
</script>

<svelte:head>
  <title>Arrangementer | Capra Liflig Fryde</title>
</svelte:head>

<section class="pb-8">
  <div class="flex flex-col justify-between sm:flex-row sm:items-center">
    <h1 class="pb-6 text-4xl font-light sm:w-[50%] sm:pt-10 sm:text-5xl">
      Kommende kurs og arrangementer
    </h1>

    <EventCategoryFilter
      {selectedCategory}
      on:categoryChange={({ detail }) => (selectedCategory = detail)}
    />
  </div>

  <div class="flex flex-col gap-4 py-5">
    {#if futureEventsFiltered.length}
      {#each futureEventsFiltered as event}
        <EventListItem {event} />
      {/each}
    {:else}
      <div class="text-large font-light">
        Fant ingen kommende kurs eller arrangementer i denne kategorien 😭
      </div>
    {/if}
  </div>
</section>

<section class="pb-8">
  <h1 class="pb-12 pt-10 text-4xl font-light sm:w-[50%] sm:text-5xl">
    Tidligere kurs og arrangementer
  </h1>

  <div class="grid grid-cols-1 gap-7 sm:grid-cols-2">
    {#if pastEvents.length}
      {#each pastEvents as event}
        <EventCard {event} />
      {/each}
    {:else}
      <div class="text-large font-light">Fant ingen tidligere kurs eller arrangementer 😭</div>
    {/if}
  </div>
</section>
