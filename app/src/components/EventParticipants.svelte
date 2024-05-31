<script>
  import { Badge } from "flowbite-svelte";

  export let internalParticipantNames;
</script>

{#if internalParticipantNames.length}
  {#each internalParticipantNames as internalParticipantName}
    <Badge class="mr-2" color="dark">{internalParticipantName}</Badge>
  {/each}
{:else}
  <p>Det er foreløpig ingen påmeldte 😔</p>
{/if}
