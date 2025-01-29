<script lang="ts">
  import { ArrowDownIcon } from "svelte-feather-icons";
  import { Button } from "flowbite-svelte";
  import EventListItem from "$components/shared/EventListItem.svelte";
  import { PUBLIC_APP_DEFAULT_BASE_URL } from "$env/static/public";

  export let data;

  let { futureEvents } = data;
</script>

{#if futureEvents.length}
  <div class="flex flex-col gap-4">
    {#each futureEvents as event}
      <EventListItem {event} />
    {/each}
    <div class="mt-6 flex flex-wrap self-center">
      <Button pill href={PUBLIC_APP_DEFAULT_BASE_URL} color="alternative" padding={3}>
        <span class="mr-2">Se flere arrangementer</span>
        <ArrowDownIcon class="w-[20px]" strokeWidth={1.5} />
      </Button>
    </div>
  </div>
{/if}
