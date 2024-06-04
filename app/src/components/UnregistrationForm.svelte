<script lang="ts">
  import { Input, Button, ButtonGroup } from "flowbite-svelte";

  export let unregistrationForm;
  export let unregistrationErrors;
  export let unregistrationEnhance;
</script>

<form
  class="mt-10 flex flex-col gap-6"
  method="POST"
  action="?/submitUnregistration"
  use:unregistrationEnhance
>
  <div
    class="mb-8 flex flex-col items-start justify-center gap-4 rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-8"
  >
    <div class="flex flex-col items-center gap-5">
      <div class="flex flex-col items-start gap-4">
        <h4
          class="text-xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl"
        >
          <p class="text-xl">Ønsker du å melde deg av?</p>
        </h4>

        <ButtonGroup class="w-full">
          <Input
            type="text"
            placeholder="din-epost@epost.no"
            name="email"
            bind:value={$unregistrationForm.email}
          />
          <Button type="submit" color="dark">Send</Button>
        </ButtonGroup>

        {#if $unregistrationErrors.email}
          <p class="text-xs text-red-600">Fyll inn gyldig epost.</p>
        {/if}
      </div>
    </div>
  </div>
</form>
