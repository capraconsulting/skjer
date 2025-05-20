<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  import { createCategoryTranslation } from "$lib/utils/category.util";
  import { Badge } from "flowbite-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import { isToday } from "date-fns";
  import { _ } from "$lib/i18n";

  export let event: EventWithAttending;
  $: startDateIsToday = isToday(event.start);
  $: startDate = startDateIsToday
    ? `${$_('common.today')} ${$_('common.clock')} ${formatTime(event.start)}`
    : formatDate(event.start);

  // Create a reactive store for the category translation
  $: categoryTranslation = createCategoryTranslation(event.category);
</script>

<div class="flex flex-row flex-wrap content-center gap-2">
  {#if event.openForExternals}
    <Badge
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      {$_('filter.forAll')}
    </Badge>
  {:else}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      {$_('filter.internalOnly')}
    </Badge>
  {/if}
  {#if event.category}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      {$categoryTranslation}
    </Badge>
  {/if}
  <Badge
    rounded
    class={`h-6 whitespace-nowrap rounded-lg border ${
      startDateIsToday
        ? "border-transparent bg-zinc-800 text-white dark:bg-white dark:text-black"
        : "border-gray-300 bg-transparent dark:bg-zinc-800"
    }`}
  >
    {startDate}
  </Badge>

  {#if event.attending}
    <Badge rounded class="h-6 whitespace-nowrap rounded-lg border-none bg-yellowSpark text-black">
      {$_('common.youAreRegistered')}
    </Badge>
  {/if}
</div>
