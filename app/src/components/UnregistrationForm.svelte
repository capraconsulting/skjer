<script lang="ts">
  import { Input, Button, ButtonGroup } from "flowbite-svelte";

  export let unregistrationForm;
  export let unregistrationErrors;
  export let unregistrationEnhance;
</script>

<form
  class="flex flex-col gap-6 mt-10"
  method="POST"
  action="?/submitUnregistration"
  use:unregistrationEnhance
>
  <div
    class="flex flex-col justify-center items-start p-4 sm:p-8 mb-8 gap-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-center gap-5">
      <div class="flex flex-col items-start gap-4">
        <h4
          class="tracking-tight leading-none text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
        >
          <p class="text-xl">Ønsker du å melde deg av?</p>
        </h4>

        <ButtonGroup class="w-full">
          <Input type="text" name="email" bind:value={$unregistrationForm.email} />
          <Button type="submit" color="dark">Send</Button>
        </ButtonGroup>

        {#if $unregistrationErrors.email}
          <p class="text-red-600 text-xs">Fyll inn gyldig epost.</p>
        {/if}
      </div>
    </div>
  </div>
</form>
