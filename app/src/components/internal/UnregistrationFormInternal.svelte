<script lang="ts">
  import { dateHasPassed } from "$lib/utils/date.util";
  import type { Event } from "$models/sanity.model";
  import { Button, Spinner } from "flowbite-svelte";
  import { _ } from "$lib/i18n";

  export let event: Event;
  export let enhance;
  export let delayed;
  export let isAttending;
</script>

{#if isAttending}
  <h2 id="unregistration" class="pb-4 text-base font-bold sm:text-xl">{$_('common.wantToUnregister')}</h2>
  {#if dateHasPassed(event.deadline)}
    <p>{$_('common.unregistrationClosed')}</p>
  {:else}
    <form method="POST" action="?/submitUnregistrationInternal" use:enhance>
      <Button pill color="dark" type="submit" disabled={$delayed}>
        <span class="ml-2">{$_('common.unregisterMe')}</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-1 " size="4" />
          {/if}
        </span>
      </Button>
    </form>
  {/if}
{/if}
