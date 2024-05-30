<script lang="ts">
  import type { Event } from "$models/sanity.types";
  import { Allergy } from "$models/allergy.model";
  import { Input, Label, Button, MultiSelect, Alert, Spinner } from "flowbite-svelte";

  export let form;
  export let errors;
  export let enhance;
  export let delayed;
  export let event: Event;

  let allergies = Object.entries(Allergy).map(([key, value]) => ({
    value: parseInt(key),
    name: value,
  }));
</script>

<form class="flex flex-col gap-6" method="POST" action="?/submitRegistration" use:enhance>
  <div class="flex flex-col gap-1">
    <input type="text" name="subject" id="subject" class="hidden" />

    <Label for="fullName">Navn*</Label>
    <Input type="text" name="fullName" id="fullName" bind:value={$form.fullName} />
    {#if $errors.fullName}
      <p class="text-red-600 text-xs">Fyll inn gyldig navn (minst 2 bokstaver).</p>
    {/if}
  </div>

  <div class="flex flex-col gap-1">
    <Label for="email">E-post*</Label>
    <Input type="text" name="email" id="email" bind:value={$form.email} />
    {#if $errors.email}
      <p class="text-red-600 text-xs">Fyll inn gyldig epost.</p>
    {/if}
  </div>

  <div class="flex flex-col gap-1">
    <Label for="telephone">Telefonnummer</Label>
    <Input type="text" name="telephone" id="telephone" bind:value={$form.telephone} />
    {#if $errors.telephone}
      <p class="text-red-600 text-xs">Fyll inn gyldig telefonnummer.</p>
    {/if}
  </div>

  <div class="flex flex-col gap-1">
    <Label for="firm">Firma</Label>
    <Input type="text" name="firm" id="firm" bind:value={$form.firm} />
    {#if $errors.firm}
      <p class="text-red-600 text-xs">Fyll inn gyldig firmanavn (minst 2 bokstaver).</p>
    {/if}
  </div>

  {#if event.allergy}
    <div class="flex flex-col gap-1">
      <Label for="allergies">Allergier</Label>
      <MultiSelect
        items={allergies}
        bind:value={$form.allergies}
        id="allergies"
        name="allergies"
        size="md"
      />
    </div>
  {/if}

  <Button color="dark" type="submit" disabled={$delayed}
    >Send inn
    <span class="w-3">
      {#if $delayed}
        <Spinner class="ml-2" color="white" size="4" />
      {/if}
    </span>
  </Button>
</form>
