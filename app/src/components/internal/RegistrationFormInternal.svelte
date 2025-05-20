<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Button, Spinner } from "flowbite-svelte";
  import RegistrationFoodPreference from "$components/shared/RegistrationFoodPreference.svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { dateHasPassed } from "$lib/utils/date.util";
  import Deadline from "$components/shared/Deadline.svelte";
  import { stegaClean } from "@sanity/client/stega";
  import FoodDeadline from "$components/shared/FoodDeadline.svelte";
  import { _ } from "$lib/i18n";

  export let event: Event;
  export let numberOfParticipants: number;
  export let isAttending: boolean;

  export let form;
  export let delayed;
  export let enhance;
  export let errors;
</script>

{#if !isAttending}
  <h2 class="pb-4 text-base font-bold sm:text-xl">{$_('common.registration')}:</h2>
  {#if dateHasPassed(event.deadline)}
    <p>{$_('common.registrationClosed')}</p>
  {:else if event.maxParticipant && numberOfParticipants >= event.maxParticipant}
    <p>{$_('common.noAvailableSpotsMessage')}</p>
  {:else}
    <div class="flex flex-wrap gap-4 pb-6">
      <Deadline deadline={event.deadline} />
      {#if event.foodPreference && event.foodDeadline}
        <FoodDeadline foodDeadline={event.foodDeadline} />
      {/if}
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

      {#if event.foodPreference && !(event.foodDeadline && dateHasPassed(event.foodDeadline))}
        <RegistrationFoodPreference {form} />
        {#if $errors.foodPreference}
          <p class="text-xs text-red-600">{$_('errors.textTooLong')}</p>
        {/if}
      {/if}

      {#if event.customOptions?.length}
        {#each event.customOptions as customOption}
          <RegistrationCustomOption
            {form}
            key={customOption._key}
            inputType={stegaClean(customOption.fieldType)}
            optionLabel={stegaClean(customOption.fieldOption)}
            radioValues={stegaClean(customOption.fieldValueRadio)}
            checkboxValue={stegaClean(customOption.fieldValueCheckbox)}
          />
        {/each}
        {#if $errors.customOptions}
          <p class="text-xs text-red-600">{$_('errors.textTooLong')}</p>
        {/if}
      {/if}

      <div class="flex w-full">
        <Button class="mt-3" pill color="dark" type="submit" disabled={$delayed}
          ><span class="ml-2">{$_('common.registerMe')}</span>
          <span class="w-2">
            {#if $delayed}
              <Spinner color="gray" class="ml-2" size="4" />
            {/if}
          </span>
        </Button>
      </div>
    </form>
  {/if}
{/if}
