<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils";
  import type { Event } from "$models/sanity.types";
  import { Badge } from "flowbite-svelte";
  import capraLogo from "$lib/assets/capra-black.webp";
  import frydeLogo from "$lib/assets/fryde-black.webp";
  import lifligLogo from "$lib/assets/liflig-black.webp";

  export let event: Event;
</script>

<a
  class="flex flex-row p-3 relative border border-black sm:flex-row group rounded-md hover:bg-zinc-100 hover:transition-[2s] justify-between"
  href={`/event/${event._id}`}
>
  <div class="flex gap-2 items-center">
    <h2 class="text-xl">
      {event.title}
    </h2>
    <Badge rounded class="h-6 border border-black bg-white">{event.category}</Badge>
    <Badge rounded class="h-6 border border-black bg-white">
      {formatDate(event.start)}
    </Badge>
  </div>
  <div class="flex gap-6 items-center">
    <div class="flex gap-4">
      <img class="h-5" alt="Capra-logo" src={capraLogo} />
      <img class="h-5" alt="Liflig-logo" src={lifligLogo} />
      <img class="h-5" alt="Fryde-logo" src={frydeLogo} />
    </div>
    <span class="material-icons mr-2 text-base">arrow_forward</span>
  </div>
</a>
