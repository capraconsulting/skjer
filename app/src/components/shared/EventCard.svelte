<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.model";

  export let event: Event;
</script>

<a class="flex flex-col last:relative sm:flex-row" href={`/event/${event._id}`}>
  <div class="group flex h-full w-full flex-col hover:underline">
    <div
      class="max-h-[260px] min-h-[260px] overflow-hidden rounded-2xl sm:max-h-[300px] sm:min-h-[300px]
    md:max-h-[240px] md:min-h-[240px] lg:max-h-[200px] lg:min-h-[200px] xl:max-h-[240px] xl:min-h-[240px]"
    >
      {#if event.image}
        <img
          class="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
          src={urlFor(event.image).url()}
          alt="Bilde for arrangementet: {event.title}"
        />
      {:else}
        <div class="h-full w-full bg-zinc-100 dark:bg-zinc-800" />
      {/if}
    </div>

    <div class="my-3 grid h-full grid-cols-1 content-between gap-2 sm:my-5">
      <div class="flex flex-col gap-2 break-words">
        <h2 class="line-clamp-2 text-xl font-semibold">
          {event.title}
        </h2>
      </div>
    </div>
  </div>
</a>
