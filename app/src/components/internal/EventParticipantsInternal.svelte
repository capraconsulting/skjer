<script>
  import { Badge } from "flowbite-svelte";

  export let names;
  export let emptyText = "Det er foreløpig ingen kollegaer som er påmeldt 😔";
</script>

{#if names?.length}
  {#each names as name}
    <span>
      <Badge rounded class="mb-1 mr-1 h-6 border border-black bg-transparent dark:bg-zinc-800"
        >{name}</Badge
      >
    </span>
  {/each}
{:else}
  <p>{emptyText}</p>
{/if}
