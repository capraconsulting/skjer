<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import { isToday } from "date-fns";
  import CompanyLogos from "./CompanyLogos.svelte";
  import { ArrowRight } from "phosphor-svelte";

  export let event: EventWithAttending;
  $: startDateIsToday = isToday(event.start);
  $: startDate = startDateIsToday
    ? `I dag kl. ${formatTime(event.start)}`
    : formatDate(event.start);
</script>

<div class="flex w-full flex-wrap items-center gap-2">
  {#if event.openForExternals}
    <Badge
      rounded
      class="h-6 w-[120px] whitespace-nowrap rounded-lg border border-gray-300 bg-transparent text-left dark:bg-zinc-800"
    >
      For alle
    </Badge>
  {:else}
    <Badge
      rounded
      class="h-6 w-[120px] whitespace-nowrap rounded-lg border border-gray-300 bg-transparent text-left dark:bg-zinc-800"
    >
      Kun interne
    </Badge>
  {/if}
  {#if event.category}
    <Badge
      rounded
      class="h-6 w-[100px] whitespace-nowrap rounded-lg border border-gray-300 bg-transparent text-left dark:bg-zinc-800"
    >
      #{event.category}
    </Badge>
  {:else}
    <div class="h-6 w-[100px]"></div>
  {/if}
  <Badge
    rounded
    class={`h-6 w-[120px] whitespace-nowrap rounded-lg border text-left ${
      startDate === "I dag"
        ? "border-transparent bg-zinc-800 text-white dark:bg-white dark:text-black"
        : "border-gray-300 bg-transparent dark:bg-zinc-800"
    }`}
  >
    {startDate}
  </Badge>
  <Badge
    rounded
    class="h-6 w-[150px] justify-start whitespace-nowrap rounded-lg border border-gray-300 bg-transparent text-left dark:bg-zinc-800"
    >Arrangør&nbsp;&nbsp;&nbsp;
    <CompanyLogos {event} height={4} />
  </Badge>
  {#if event.attending}
    <Badge
      rounded
      class="bg-yellowSpark h-6 w-[120px] whitespace-nowrap rounded-lg border-none text-left text-black"
    >
      Du er påmeldt
    </Badge>
  {:else}
    <div class="h-6 w-[120px]"></div>
  {/if}
  <div class="ml-auto flex h-6 min-w-[10px] items-center justify-end">
    <ArrowRight class="mr-2" />
  </div>
</div>
