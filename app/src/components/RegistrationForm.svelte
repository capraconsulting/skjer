<script lang="ts">
  import { page } from "$app/stores";
  import type { Event } from "$lib/sanity/queries";
  import { Allergy } from "$models/allergy.model";
  import { Input, Label, Button, MultiSelect, Spinner } from "flowbite-svelte";

  export let form;
  export let errors;
  export let enhance;
  export let message;
  export let delayed;
  export let event: Event;

  let allergies = Object.entries(Allergy).map(([key, value]) => ({
    value: parseInt(key),
    name: value,
  }));
</script>

{#if $message?.success === true}
  Du har meldt deg på arrangementet! Du får en bekreftelse på <b>{$message.email}</b> hvert øyeblikk.
{/if}

{#if !$message}
  {#if $page?.status >= 400}
    Det har skjedd en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.
  {/if}

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

    <Button color="dark" type="submit" disabled={$delayed}>
      <div class="flex gap-1">
        <span>Send inn</span>
      </div>
    </Button>
  </form>
{/if}
