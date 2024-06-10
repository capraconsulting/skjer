<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { AllergyItems } from "$models/allergy.model";
  import { Label, Button, MultiSelect, Spinner } from "flowbite-svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";

  export let event: Event;
  export let registrationForm;
  export let registrationEnhance;
  export let registrationDelayed;
</script>

<form
  class="flex flex-col gap-4"
  method="POST"
  action="?/submitRegistration"
  use:registrationEnhance
>
  <input class="hidden" type="text" name="fullName" bind:value={$registrationForm.fullName} />
  <input class="hidden" type="text" name="email" bind:value={$registrationForm.email} />

  {#if event.isDigital}
    <RegistrationAttendingType {registrationForm} />
  {/if}

  {#if event.allergy}
    <div class="flex flex-col gap-1">
      <Label class="font-bold" for="allergies">Allergier</Label>
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

  <div class="flex w-full">
    <Button pill color="dark" type="submit" disabled={$registrationDelayed}
      ><span class="ml-3">Meld meg på</span>
      <span class="w-3">
        {#if $registrationDelayed}
          <Spinner class="ml-2" color="white" size="4" />
        {/if}
      </span>
    </Button>
  </div>
</form>
