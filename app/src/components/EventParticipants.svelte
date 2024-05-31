<script>
  import { Badge } from "flowbite-svelte";

  export let participantNames;
</script>

{#if participantNames.length > 0}
  {#each participantNames as participantName}
    <Badge class="mr-2" color="dark">{participantName}</Badge>
  {/each}
{:else}
  <p>Det er foreløpig ingen påmeldte 😔</p>
{/if}
