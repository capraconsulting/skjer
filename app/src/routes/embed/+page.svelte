<script lang="ts">
  import EventListItem from "$components/shared/EventListItem.svelte";

  export let data;
  let { futureEvents } = data;
</script>

<svelte:head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@latest/dist/index.js"
  ></script>
</svelte:head>

{#if futureEvents.length}
  <div class="flex flex-col gap-4">
    {#each futureEvents as event}
      <EventListItem {event} target="_blank" />
    {/each}
  </div>
{/if}
