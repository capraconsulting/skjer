<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils";
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$lib/sanity/queries";

  export let event: Event;
</script>

<a
  class="flex flex-col p-3 relative border border-b-[1px] sm:flex-row group first:rounded-t-md last:rounded-b-md"
  href={`/event/${event._id}`}
>
  {#if event.image}
    <img
      class="w-full h-60 object-cover sm:w-96 sm:max-h-60"
      src={urlFor(event.image).width(500).height(300).url()}
      alt="Cover image for {event.title}"
    />
  {/if}

  <div class="my-0 mx-4">
    <h3
      class="text-4xl font-extrabold leading-tight pt-4 pb-2 group-hover:opacity-80 group-hover:transition-[2s]"
    >
      {event.title}
    </h3>
    {#if event.summary}
      <p class="text-xl">{event.summary}</p>
    {/if}
    <div class="my-6 text-sm font-semibold">
      <div class="flex items-center">
        <span class="material-icons mr-2 text-base">schedule</span>
        <p>
          {formatDate(event.start)}
          {formatTime(event.start)}
        </p>
      </div>
      <div class="flex items-center">
        <span class="material-icons mr-2 text-base">location_on</span>
        <p>{event.place}</p>
      </div>
    </div>
  </div>
</a>
