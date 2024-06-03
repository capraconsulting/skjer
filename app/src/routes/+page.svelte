<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import EventCard from "../components/EventCard.svelte";
  import type { PageData } from "./$types";
  import EventListItem from "$components/EventListItem.svelte";

  export let data: PageData;
  let futureEvents = data.futureEvents;
  let pastEvents = data.pastEvents;
  let selectedCategory: string = data.category || "";

  function updateCategory(category: string) {
    const url = new URL(window.location.href);
    if (category) {
      url.searchParams.set("category", category);
    } else {
      url.searchParams.delete("category");
    }
    window.location.href = url.toString();
  }

  const categories = [
    { value: "", title: "Alle" },
    { value: "Tech", title: "Tech" },
    { value: "Design", title: "Design" },
    { value: "Sosialt", title: "Sosialt" },
  ];
</script>

<section class="pb-8">
  <div class="flex flex-row justify-between items-center">
    <h1 class="text-5xl sm:w-[50%] pt-10 pb-6 font-light">Kommende kurs og arrangementer</h1>

    <ButtonGroup class="gap-2 h-7 mt-8">
      {#each categories as category}
        <Button
          on:click={() => updateCategory(category.value)}
          class={`${selectedCategory === category.value ? "bg-zinc-800 text-white hover:bg-zinc-600 border-black !rounded-xl" : "border border-black !rounded-xl"}`}
        >
          {category.title}
        </Button>
      {/each}
    </ButtonGroup>
  </div>

  <div class="flex flex-col gap-4 py-5">
    {#if futureEvents.length}
      {#each futureEvents as event}
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
  <h1 class="text-5xl sm:w-[50%] pt-10 pb-12 font-light">Tidligere kurs og arrangementer</h1>

  <div class="grid grid-cols-2 gap-7">
    {#if pastEvents.length}
      {#each pastEvents as event}
        <EventCard {event} />
      {/each}
    {:else}
      <div class="text-large font-light">Fant ingen tidligere kurs eller arrangementer 😭</div>
    {/if}
  </div>
</section>
