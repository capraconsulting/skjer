<script lang="ts">
  import { Badge } from "flowbite-svelte";
  import type { Event } from "$models/sanity.model";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import EventInfoBox from "$components/shared/EventInfoBox.svelte";

  export let event: Event;
</script>

<Badge rounded class="mb-4 h-6 border border-black bg-transparent">{event.category}</Badge>
<h1 class="pb-6 text-3xl font-light sm:text-5xl">{event.title}</h1>

{#if event.summary}
  <p class="pb-6 text-base font-light sm:text-xl">{event.summary}</p>
{/if}

<div class="flex flex-col gap-5 pb-6 sm:h-60 sm:flex-row">
  <div class="w-full sm:w-[40%]">
    <EventInfoBox {event} />
  </div>
  <div class="w-full sm:w-[60%]">
    <img
      class="w-full rounded-xl object-cover sm:h-full"
      src={urlFor(event.image).format("webp").url()}
      alt="Bilde for arrangementet: {event.title}"
    />
  </div>
</div>

{#if event.body}
  <div class="flex flex-col gap-4 text-base font-light sm:text-xl">
    <PortableText components={{}} value={event.body} />
  </div>
{/if}
