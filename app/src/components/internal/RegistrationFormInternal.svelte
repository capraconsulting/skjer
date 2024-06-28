<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Button, Spinner } from "flowbite-svelte";
  import RegistrationFoodPreference from "$components/shared/RegistrationFoodPreference.svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { dateHasPassed } from "$lib/utils/date.util";
  import Deadline from "$components/shared/Deadline.svelte";
  import { stegaClean } from "@sanity/client/stega";

  export let event: Event;
  export let numberOfParticipants: number;
  export let isAttending: boolean;

  export let form;
  export let delayed;
  export let enhance;
  export let errors;
</script>

{#if !isAttending}
  <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
  {#if dateHasPassed(event.deadline)}
    <p>Det er ikke lenger mulig å melde seg på dette arrangementet 😢</p>
  {:else if event.maxParticipant && numberOfParticipants >= event.maxParticipant}
    <p>Det er dessverre ikke flere ledige plasser på dette arrangementet 😢</p>
  {:else}
    <div class="pb-6">
      <Deadline deadline={event.deadline} />
    </div>
    <form
      class="flex flex-col gap-4"
      method="POST"
      action="?/submitRegistrationInternal"
      use:enhance
    >
      {#if event.isDigital}
        <RegistrationAttendingType {form} />
      {/if}

      {#if event.foodPreference}
        <RegistrationFoodPreference {form} />
        {#if $errors.foodPreference}
          <p class="text-xs text-red-600">Vennligst begrens deg til maks 500 tegn.</p>
        {/if}
      {/if}

      {#if event.customOptions?.length}
        {#each event.customOptions as customOption}
          <RegistrationCustomOption
            {form}
            inputType={stegaClean(customOption.fieldType)}
            optionLabel={stegaClean(customOption.fieldOption)}
          />
        {/each}
        {#if $errors.customOptions}
          <p class="text-xs text-red-600">Vennligst begrens deg til maks 500 tegn.</p>
        {/if}
      {/if}

      <div class="flex w-full">
        <Button class="mt-4" pill color="dark" type="submit" disabled={$delayed}
          ><span class="ml-3">Meld meg på</span>
          <span class="w-3">
            {#if $delayed}
              <Spinner color="gray" class="ml-2 " size="4" />
            {/if}
          </span>
        </Button>
      </div>
    </form>
  {/if}
{/if}
