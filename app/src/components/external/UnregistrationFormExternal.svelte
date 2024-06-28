<script lang="ts">
  import { Input, Button, ButtonGroup, Spinner } from "flowbite-svelte";

  export let form;
  export let errors;
  export let delayed;
  export let enhance;
</script>

<form
  class="mt-20 flex flex-col gap-6"
  method="POST"
  action="?/submitUnregistrationExternal"
  use:enhance
>
  <input type="text" name="subject" id="subject" class="hidden" />

  <div
    class="mb-8 flex flex-col items-start justify-center rounded-lg border p-4 sm:p-8 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex flex-col items-center gap-5">
      <div class="items-start-4 flex flex-col">
        <h4
          class="text-2xl font-bold leading-none tracking-tight text-gray-900 sm:text-2xl dark:text-white"
        >
          <h2 class="pb-4 text-base font-bold sm:text-xl">Ønsker du å melde deg av?</h2>
        </h4>

        <ButtonGroup class="w-100">
          <Input
            class="bg-white"
            type="text"
            placeholder="din-epost@epost.no"
            name="email"
            bind:value={$form.email}
          />
          <Button class="w-48" type="submit" color="light" disabled={$delayed}>
            Meld meg av
            <span class="w-3">
              {#if $delayed}
                <Spinner color="gray" class="ml-2 " size="4" />
              {/if}
            </span>
          </Button>
        </ButtonGroup>
        {#if $errors.email}
          <p class="text-xs text-red-600">Fyll inn gyldig epost.</p>
        {/if}
      </div>
    </div>
  </div>
</form>
