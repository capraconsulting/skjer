<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import Card from "../components/Card.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let events = data.events;
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
    { value: "Sosialt", title: "Sosialt" },
    { value: "Frokostseminar", title: "Frokostseminar" },
    { value: "Konferanse", title: "Konferanse" },
    { value: "Fagsamling", title: "Fagsamling" },
    { value: "Fagsirkel", title: "Fagsirkel" },
  ];
</script>

<section class="my-6">
  <ButtonGroup>
    {#each categories as category}
      <Button
        on:click={() => updateCategory(category.value)}
        class={`${selectedCategory === category.value ? "bg-zinc-800 text-white hover:bg-zinc-600" : ""}`}
      >
        {category.title}
      </Button>
    {/each}
  </ButtonGroup>
</section>

<section>
  {#if events.length}
    {#each events as event}
      <Card {event} />
    {/each}
  {:else}
    <div class="text-large font-light">Fant ingen arrangementer i denne kategorien 😭</div>
  {/if}
</section>
