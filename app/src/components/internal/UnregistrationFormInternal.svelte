<script lang="ts">
  import { dateHasPassed } from "$lib/utils/date.util";
  import type { Event } from "$models/sanity.model";
  import { Button, Spinner } from "flowbite-svelte";

  export let event: Event;
  export let enhance;
  export let delayed;
  export let isAttending;
</script>

{#if isAttending}
  <h2 id="unregistration" class="pb-4 text-base font-bold sm:text-xl">Ønsker du å melde deg av?</h2>
  {#if dateHasPassed(event.deadline)}
    <p>Det er ikke lenger mulig å melde seg av dette arrangementet 😢</p>
  {:else}
    <form method="POST" action="?/submitUnregistrationInternal" use:enhance data-testid="unregistration-form">
      <Button pill color="dark" type="submit" disabled={$delayed} data-testid="confirm-button">
        <span class="ml-2">Meld meg av</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-1 " size="4" />
          {/if}
        </span>
      </Button>
    </form>
  {/if}
{/if}
