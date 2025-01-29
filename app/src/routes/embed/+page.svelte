<script lang="ts">
  import EventListItem from "$components/shared/EventListItem.svelte";

  export let data;
  let { futureEvents } = data;
</script>

{#if futureEvents.length}
  <div class="flex flex-col gap-4">
    {#each futureEvents as event}
      <EventListItem {event} target="_blank" />
    {/each}
  </div>
{/if}
