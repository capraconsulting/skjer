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
  class="group relative flex flex-col justify-between rounded-md border border-black p-3 hover:bg-zinc-100 hover:transition-[2s] sm:flex-row"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col gap-3 px-0 font-light sm:flex-row sm:gap-2 sm:px-2">
    <h2 class="pr-3 text-xl">
      {event.title}
    </h2>
    <div class="flex flex-row items-center gap-2">
      <Badge rounded class="h-6 border border-black bg-white">{event.category}</Badge>
      <Badge rounded class="h-6 border border-black bg-white">
        {formatDate(event.start)}
      </Badge>
    </div>
  </div>
  <div class="flex flex-row items-center justify-between gap-6 pt-4 sm:pt-0">
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
