<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import { Alert, Button, Spinner } from "flowbite-svelte";
  import RegistrationAllergy from "$components/shared/RegistrationAllergy.svelte";
  import RegistrationAttendingType from "$components/shared/RegistrationAttendingType.svelte";
  import RegistrationCustomOption from "$components/shared/RegistrationCustomOption.svelte";
  import { sanitize } from "$lib/utils/sanitize.util";

  export let event: Event;
  export let isAttending;

  export let form;
  export let delayed;
  export let enhance;
</script>

{#if !isAttending}
  <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
  <form class="flex flex-col gap-4" method="POST" action="?/submitRegistrationInternal" use:enhance>
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
            <Spinner class="ml-2 text-black dark:text-white" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
