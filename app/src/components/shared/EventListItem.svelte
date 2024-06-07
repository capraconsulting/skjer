<script lang="ts">
  import { formatDate } from "$lib/utils";
  import { Badge } from "flowbite-svelte";
  import capraLogo from "$lib/assets/capra-black-small.webp";
  import frydeLogo from "$lib/assets/fryde-black-small.webp";
  import lifligLogo from "$lib/assets/liflig-black-small.webp";
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";

  export let event: EventWithAttending;
</script>

<a
  class="flex flex-col justify-between rounded-md border border-black px-3 py-4 hover:bg-[#E5FFE3] hover:transition-[2s] sm:flex-row"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col gap-3 px-0 font-light sm:flex-row sm:gap-2 sm:px-2">
    <h2 class="pr-3 text-xl">
      {event.title}
    </h2>
    <div class="flex flex-row items-center gap-2">
      <Badge rounded class="h-6 border border-black bg-transparent">{event.category}</Badge>
      <Badge rounded class="h-6 border border-black bg-transparent">
        {formatDate(event.start)}
      </Badge>

      {#if event.attending}
        <Badge rounded class="h-6 border border-black bg-[#E5FFE3]">Påmeldt</Badge>
      {/if}
    </div>
  </div>
  <div class="flex flex-row items-center justify-between gap-6 pt-4 sm:pt-0">
    <div class="flex items-center gap-4">
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
    <ArrowRight class="mr-2" />
  </div>
</a>
