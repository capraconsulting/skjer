<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Allergy } from "$models/allergy.model";
  import { Input, Label, Button, MultiSelect, Alert, Spinner } from "flowbite-svelte";

  export let event: Event;
  export let registrationForm;
  export let registrationErrors;
  export let registrationEnhance;
  export let registrationDelayed;

  let allergies = Object.entries(Allergy).map(([key, value]) => ({
    value: parseInt(key),
    name: value,
  }));
</script>

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
    <Label for="firm">Firma</Label>
    <Input
      size="sm"
      class="bg-white"
      type="text"
      name="firm"
      id="firm"
      bind:value={$registrationForm.firm}
    />
    {#if $registrationErrors.firm}
      <p class="text-xs text-red-600">Fyll inn gyldig firmanavn (minst 2 bokstaver).</p>
    {/if}
  </div>

  {#if event.allergy}
    <div class="flex flex-col gap-1">
      <Label for="allergies">Allergier</Label>
      <MultiSelect
        class="bg-white"
        items={allergies}
        bind:value={$registrationForm.allergies}
        id="allergies"
        name="allergies"
        size="sm"
      />
    </div>
  {/if}

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
