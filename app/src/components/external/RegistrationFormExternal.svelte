<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { AllergyItems } from "$models/allergy.model";
  import { Input, Label, Button, MultiSelect, Alert, Spinner } from "flowbite-svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";

  export let event: Event;
  export let registrationForm;
  export let registrationErrors;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;
</script>

{#if $registrationMessage?.message}
  <Alert
    class="mb-6"
    color={$registrationMessage.success ? "green" : $registrationMessage.warning ? "yellow" : "red"}
  >
    {$registrationMessage.message}
  </Alert>
{:else}
  <form
    class="flex flex-col gap-4"
    method="POST"
    action="?/submitRegistration"
    use:registrationEnhance
  >
    <div class="flex flex-col gap-1">
      <input type="text" name="subject" id="subject" class="hidden" />

      <Label for="fullName">Fullt navn*</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="fullName"
        id="fullName"
        bind:value={$registrationForm.fullName}
      />
      {#if $registrationErrors.fullName}
        <p class="text-xs text-red-600">Fyll inn gyldig navn (minst 2 bokstaver).</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label for="email">E-post*</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="email"
        id="email"
        bind:value={$registrationForm.email}
      />
      {#if $registrationErrors.email}
        <p class="text-xs text-red-600">Fyll inn gyldig epost.</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label for="telephone">Telefonnummer</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="telephone"
        id="telephone"
        bind:value={$registrationForm.telephone}
      />
      {#if $registrationErrors.telephone}
        <p class="text-xs text-red-600">Fyll inn gyldig telefonnummer.</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label for="firm">Selskap</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="firm"
        id="firm"
        bind:value={$registrationForm.firm}
      />
      {#if $registrationErrors.firm}
        <p class="text-xs text-red-600">Fyll inn gyldig selskapsnavn (minst 2 bokstaver).</p>
      {/if}
    </div>

    {#if event.isDigital}
      <RegistrationAttendingType {registrationForm} />
    {/if}

    {#if event.allergy}
      <div class="flex flex-col gap-1">
        <Label for="allergies">Allergier</Label>
        <MultiSelect
          class="bg-transparent"
          items={AllergyItems}
          bind:value={$registrationForm.allergies}
          id="allergies"
          name="allergies"
          size="sm"
        />
      </div>
    {/if}

    <div class="pt-4 text-sm">
      <span class="font-light"
        >Ved å melde deg på arrangementet samtykker du til at du har lest og forstått
      </span>
      <span
        ><a href="/personvern" target="_blank" class="font-normal underline"
          >Capra, Liflig og Fryde sin personvernerklæring</a
        >.</span
      >
    </div>

    <div class="flex w-full justify-end">
      <Button class="mt-4" pill color="dark" type="submit" disabled={$registrationDelayed}
        ><span class="ml-3">Meld meg på</span>
        <span class="w-3">
          {#if $registrationDelayed}
            <Spinner class="ml-2" color="white" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
