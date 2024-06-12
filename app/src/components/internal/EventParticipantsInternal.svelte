<script>
  import { Badge } from "flowbite-svelte";

  export let names;
</script>

{#if names.length}
  {#each names as name}
    <Badge rounded class="mr-1 h-6 border border-black bg-transparent dark:bg-zinc-800"
      >{name}</Badge
    >
  {/each}
{:else}
  <p>Det er foreløpig ingen påmeldte 😔</p>
{/if}
