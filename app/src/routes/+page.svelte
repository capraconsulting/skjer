<script lang="ts">
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

<section>
  <label for="category">Filtrer etter kategori:</label>
  <select
    id="category"
    bind:value={selectedCategory}
    on:change={() => updateCategory(selectedCategory)}
  >
    {#each categories as category}
      <option value={category.value}>{category.title}</option>
    {/each}
  </select>
</section>

<section>
  {#if events.length}
    {#each events as event}
      <Card {event} />
    {/each}
  {:else}
    <div>Fant ingen eventer</div>
  {/if}
</section>
