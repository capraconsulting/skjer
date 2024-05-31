<script>
  import { Badge } from "flowbite-svelte";

  export let participants;
</script>

{#if participants.length > 0}
  {#each participants as participant}
    <Badge class="mr-2" color="dark">{participant.full_name}</Badge>
  {/each}
{:else}
  <p>Det er foreløpig ingen påmeldte 😔</p>
{/if}
