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

  export let event: Event;
  export let numberOfParticipants: number;

  export let form;
  export let errors;
  export let enhance;
  export let delayed;
</script>

<h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
{#if dateHasPassed(event.deadline)}
  <p>Det er ikke lenger mulig å melde seg på dette arrangementet 😢</p>
{:else if !event.openForExternals}
  <p>Du må logge inn for å melde deg på dette arrangementet 🤠</p>
{:else if event.maxParticipant && numberOfParticipants >= event.maxParticipant}
  <p>Det er dessverre ikke flere ledige plasser på dette arrangementet 😢</p>
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
      <Label class="font-bold" for="fullName">Fullt navn*</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="fullName"
        id="fullName"
        placeholder="Fornavn Etternavn"
        bind:value={$form.fullName}
      />
      {#if $errors.fullName}
        <p class="text-xs text-red-600">Fyll inn gyldig navn (minst 2 bokstaver).</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="email">E-post*</Label>
      <Input
        size="sm"
        class="bg-white"
        type="email"
        name="email"
        id="email"
        placeholder="E-post"
        bind:value={$form.email}
      />
      {#if $errors.email}
        <p class="text-xs text-red-600">Fyll inn gyldig e-post.</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="telephone">Telefonnummer</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="telephone"
        id="telephone"
        placeholder="123 45 678"
        bind:value={$form.telephone}
      />
      {#if $errors.telephone}
        <p class="text-xs text-red-600">Fyll inn gyldig telefonnummer.</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="firm">Bedrift/selskap</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="firm"
        id="firm"
        bind:value={$form.firm}
        placeholder="Organisasjon"
      />
      {#if $errors.firm}
        <p class="text-xs text-red-600">Fyll inn gyldig selskapsnavn (minst 2 bokstaver).</p>
      {/if}
    </div>

    {#if event.isDigital}
      <RegistrationAttendingType {form} />
    {/if}

    {#if event.foodPreference && !(event.foodDeadline && dateHasPassed(event.foodDeadline))}
      <RegistrationFoodPreference {form} />
      {#if $errors.foodPreference}
        <p class="text-xs text-red-600">Vennligst begrens deg til maks 500 tegn.</p>
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
        <p class="text-xs text-red-600">Vennligst begrens deg til maks 500 tegn.</p>
      {/if}
    {/if}

    <div class="text-balance pt-4 text-sm">
      <span class="font-light"
        >Ved å melde deg på arrangementet samtykker du til at du har lest og forstått
      </span>
      <span>
        <a href="/personvern" target="_blank" class="font-normal underline"
          >Capra, Liflig og Fryde sin personvernerklæring</a
        >.</span
      >
    </div>

    <div class="flex w-full">
      <Button class="mt-3" pill color="dark" type="submit" disabled={$delayed}>
        <span class="ml-2">Meld meg på</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-2" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
