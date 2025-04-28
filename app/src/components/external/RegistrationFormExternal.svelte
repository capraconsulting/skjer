<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Input, Label, Button, Spinner } from "flowbite-svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationFoodPreference from "$components/shared/RegistrationFoodPreference.svelte";
  import Deadline from "$components/shared/Deadline.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { dateHasPassed } from "$lib/utils/date.util";
  import { stegaClean } from "@sanity/client/stega";
  import FoodDeadline from "$components/shared/FoodDeadline.svelte";
  import { _ } from "$lib/i18n";

  export let event: Event;
  export let numberOfParticipants: number;

  export let form;
  export let errors;
  export let enhance;
  export let delayed;
</script>

<h2 class="pb-4 text-base font-bold sm:text-xl">{$_('common.registration')}:</h2>
{#if dateHasPassed(event.deadline)}
  <p>{$_('common.registrationClosed')}</p>
{:else if !event.openForExternals}
  <p>{$_('common.loginRequired')}</p>
{:else if event.maxParticipant && numberOfParticipants >= event.maxParticipant}
  <p>{$_('common.noAvailableSpotsMessage')}</p>
{:else}
  <div class="flex flex-wrap gap-4 pb-6">
    <Deadline deadline={event.deadline} />
    {#if event.foodPreference && event.foodDeadline}
      <FoodDeadline foodDeadline={event.foodDeadline} />
    {/if}
  </div>
  <form class="flex flex-col gap-4" method="POST" action="?/submitRegistrationExternal" use:enhance>
    <input type="text" name="subject" id="subject" class="hidden" />

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="fullName">{$_('common.fullName')}</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="fullName"
        id="fullName"
        placeholder={$_('common.fullNamePlaceholder')}
        bind:value={$form.fullName}
      />
      {#if $errors.fullName}
        <p class="text-xs text-red-600">{$_('errors.invalidName')}</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="email">{$_('common.email')}</Label>
      <Input
        size="sm"
        class="bg-white"
        type="email"
        name="email"
        id="email"
        placeholder={$_('common.emailPlaceholder')}
        bind:value={$form.email}
      />
      {#if $errors.email}
        <p class="text-xs text-red-600">{$_('errors.invalidEmail')}</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="telephone">{$_('common.telephone')}</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="telephone"
        id="telephone"
        placeholder={$_('common.telephonePlaceholder')}
        bind:value={$form.telephone}
      />
      {#if $errors.telephone}
        <p class="text-xs text-red-600">{$_('errors.invalidPhone')}</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="firm">{$_('common.company')}</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="firm"
        id="firm"
        bind:value={$form.firm}
        placeholder={$_('common.companyPlaceholder')}
      />
      {#if $errors.firm}
        <p class="text-xs text-red-600">{$_('errors.invalidCompany')}</p>
      {/if}
    </div>

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

    <div class="text-balance pt-4 text-sm">
      <span class="font-light"
        >{$_('common.consentText')}
      </span>
      <span>
        <a href="/personvern" target="_blank" class="font-normal underline"
          >Capra, Liflig og Fryde sin {$_('common.privacyPolicy').toLowerCase()}</a
        >.</span
      >
    </div>

    <div class="flex w-full">
      <Button class="mt-3" pill color="dark" type="submit" disabled={$delayed}>
        <span class="ml-2">{$_('common.registerMe')}</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-2" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
