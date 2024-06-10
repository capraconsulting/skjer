<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Button, Spinner } from "flowbite-svelte";
  import RegistrationAllergy from "$components/shared/RegistrationAllergy.svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { sanitize } from "$lib/utils/sanitize.util";

  export let event: Event;
  export let form;
  export let enhance;
  export let delayed;
</script>

<form class="flex flex-col gap-4" method="POST" action="?/submitRegistration" use:enhance>
  <input class="hidden" type="text" name="fullName" bind:value={$form.fullName} />
  <input class="hidden" type="text" name="email" bind:value={$form.email} />

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

  <div class="flex w-full">
    <Button pill color="dark" type="submit" disabled={$delayed}
      ><span class="ml-3">Meld meg på</span>
      <span class="w-3">
        {#if $delayed}
          <Spinner class="ml-2" color="white" size="4" />
        {/if}
      </span>
    </Button>
  </div>
</form>
