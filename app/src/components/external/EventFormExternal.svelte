<script lang="ts">
  import RegistrationFormExternal from "$components/external/RegistrationFormExternal.svelte";
  import UnregistrationFormExternal from "$components/external/UnregistrationFormExternal.svelte";
  import type { Event } from "$models/sanity.model";

  export let event: Event;

  export let registrationForm;
  export let registrationErrors;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;

  export let unregistrationForm;
  export let unregistrationErrors;
  export let unregistrationEnhance;
  export let unregistrationMessage;
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div class="py-6">
    <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
    <RegistrationFormExternal
      {event}
      form={registrationForm}
      errors={registrationErrors}
      enhance={registrationEnhance}
      delayed={registrationDelayed}
      message={registrationMessage}
    />
    <UnregistrationFormExternal
      form={unregistrationForm}
      errors={unregistrationErrors}
      enhance={unregistrationEnhance}
      message={unregistrationMessage}
    />
  </div>
</div>
