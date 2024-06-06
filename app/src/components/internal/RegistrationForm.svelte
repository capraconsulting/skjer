<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Allergy } from "$models/allergy.model";
  import { Label, Button, MultiSelect, Spinner, Alert } from "flowbite-svelte";

  export let event: Event;
  export let registrationForm;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;

  const allergies = Object.entries(Allergy).map(([key, value]) => ({
    value: parseInt(key),
    name: value,
  }));
</script>

{#if $registrationMessage?.message}
  <Alert
    color={$registrationMessage.success ? "green" : $registrationMessage.warning ? "yellow" : "red"}
    class="mb-6"
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
    <input class="hidden" type="text" name="fullName" bind:value={$registrationForm.fullName} />
    <input class="hidden" type="text" name="email" bind:value={$registrationForm.email} />
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

    <div class="flex w-full">
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
