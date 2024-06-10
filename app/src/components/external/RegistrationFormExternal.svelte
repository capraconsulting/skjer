<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Input, Label, Button, Alert, Spinner } from "flowbite-svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationAllergy from "$components/shared/RegistrationAllergy.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { sanitize } from "$lib/utils/sanitize.util";

  export let event: Event;
  export let form;
  export let errors;
  export let enhance;
  export let delayed;
  export let message;
</script>

{#if $message?.text}
  <Alert class="mb-6" color={$message.success ? "green" : $message.warning ? "yellow" : "red"}>
    {$message.text}
  </Alert>
{:else}
  <form class="flex flex-col gap-4" method="POST" action="?/submitRegistration" use:enhance>
    <div class="flex flex-col gap-1">
      <input type="text" name="subject" id="subject" class="hidden" />

      <Label for="fullName">Fullt navn*</Label>
      <Input
        size="sm"
        class="bg-white"
        type="text"
        name="fullName"
        id="fullName"
        bind:value={$form.fullName}
      />
      {#if $errors.fullName}
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
        bind:value={$form.email}
      />
      {#if $errors.email}
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
        bind:value={$form.telephone}
      />
      {#if $errors.telephone}
        <p class="text-xs text-red-600">Fyll inn gyldig telefonnummer.</p>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <Label for="firm">Selskap</Label>
      <Input size="sm" class="bg-white" type="text" name="firm" id="firm" bind:value={$form.firm} />
      {#if $errors.firm}
        <p class="text-xs text-red-600">Fyll inn gyldig selskapsnavn (minst 2 bokstaver).</p>
      {/if}
    </div>

    {#if event.isDigital}
      <RegistrationAttendingType {form} />
    {/if}

    {#if event.allergy}
      <RegistrationAllergy {form} />
    {/if}

    {#if event.customOptions?.length}
      {#each event.customOptions as customOption}
        <RegistrationCustomOption label={customOption} option={sanitize(customOption)} {form} />
      {/each}
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
      <Button class="mt-4" pill color="dark" type="submit" disabled={$delayed}
        ><span class="ml-3">Meld meg på</span>
        <span class="w-3">
          {#if $delayed}
            <Spinner class="ml-2" color="white" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
