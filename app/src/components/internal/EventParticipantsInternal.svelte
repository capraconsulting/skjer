<script>
  import { Badge } from "flowbite-svelte";

  export let internalParticipantNames;
</script>

{#if internalParticipantNames.length}
  {#each internalParticipantNames as internalParticipantName}
    <Badge rounded class="mr-1 h-6 border border-black bg-transparent dark:bg-zinc-800"
      >{internalParticipantName}</Badge
    >
  {/each}
{:else}
  <p>Det er foreløpig ingen påmeldte 😔</p>
{/if}
