<script lang="ts">
  import { formatDate } from "$lib/utils";
  import type { Event } from "$models/sanity.types";
  import { Badge } from "flowbite-svelte";
  import capraLogo from "$lib/assets/capra-black-small.webp";
  import frydeLogo from "$lib/assets/fryde-black-small.webp";
  import lifligLogo from "$lib/assets/liflig-black-small.webp";

  export let event: Event;
</script>

<a
  class="flex flex-col p-3 relative border border-black sm:flex-row group rounded-md hover:bg-zinc-100 hover:transition-[2s] justify-between"
  href={`/event/${event._id}`}
>
  <div class="flex sm:flex-row flex-col sm:gap-2 gap-3 font-light px-0 sm:px-2">
    <h2 class="text-xl pr-3">
      {event.title}
    </h2>
    <div class="flex flex-row gap-2 items-center">
      <Badge rounded class="h-6 border border-black bg-white">{event.category}</Badge>
      <Badge rounded class="h-6 border border-black bg-white">
        {formatDate(event.start)}
      </Badge>
    </div>
  </div>
  <div class="flex flex-row justify-between gap-6 items-center sm:pt-0 pt-4">
    <div class="flex gap-4">
      {#if event.organisers?.includes("Capra")}
        <img class="h-5" alt="Capra-logo" src={capraLogo} />
      {/if}
      {#if event.organisers?.includes("Liflig")}
        <img class="h-5" alt="Liflig-logo" src={lifligLogo} />
      {/if}
      {#if event.organisers?.includes("Fryde")}
        <img class="h-5" alt="Fryde-logo" src={frydeLogo} />
      {/if}
    </div>
    <span class="material-icons mr-2 text-base">arrow_forward</span>
  </div>
</a>
